from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import cv2
import numpy as np
import mediapipe as mp

app = FastAPI()

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

def is_side_sleeping(pose_landmarks):
    left_eye = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_EYE]
    right_eye = pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_EYE]
    left_shoulder = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER]
    right_shoulder = pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER]
    # Check if the horizontal distance between eyes is very small, indicating a sideways roll
    eye_distance = abs(left_eye.x - right_eye.x)
    if eye_distance < 0.02:  # Adjust threshold based on testing
        return True
    return False
@app.post("/process-frame/")
async def process_frame(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(frame_rgb)

    if results.pose_landmarks and is_side_sleeping(results.pose_landmarks):
        return JSONResponse(content={"alert": "Unsafe position detected!"})
    return JSONResponse(content={"alert": "Safe position"})