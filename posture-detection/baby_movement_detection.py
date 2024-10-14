import cv2
import mediapipe as mp
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
pose = mp_pose.Pose()
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Error: Could not open the camera.")
    exit()
while True:
    ret, frame = cap.read()
    if not ret:
        print("Error: Failed to capture image.")
        break
    image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(image_rgb)
    if results.pose_landmarks:
        mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
    cv2.imshow('Baby Movement Detection', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
cap.release()
cv2.destroyAllWindows()