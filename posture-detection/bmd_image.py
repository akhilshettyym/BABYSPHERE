import cv2
import mediapipe as mp
from time import sleep
# Initialize Mediapipe pose and drawing classes
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

# Function to check for tummy sleeping using alignment of shoulders and head
def is_tummy_sleeping(pose_landmarks):
    nose = pose_landmarks.landmark[mp_pose.PoseLandmark.NOSE]
    left_shoulder = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER]
    right_shoulder = pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER]
    if abs(left_shoulder.x - right_shoulder.x) < 0.3:
        return True
    return False

# Function to check if the baby is sleeping sideways based on eye proximity
def is_side_sleeping(pose_landmarks):
    left_eye = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_EYE]
    right_eye = pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_EYE]
    nose = pose_landmarks.landmark[mp_pose.PoseLandmark.NOSE]
    left_shoulder = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER]
    right_shoulder = pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER]
    eye_distance = abs(left_eye.x - right_eye.x)
    if abs(left_shoulder.x - right_shoulder.x) < 0.3:
        return True

    # Check if the horizontal distance between eyes is very small, indicating a sideways roll
    elif eye_distance < 0.07:  # Adjust threshold based on testing
        return True
    return False
while True:
    camera=cv2.VideoCapture(0)
    result, image = camera.read()
    if result:
        cv2.imwrite("test123.jpg", image)
    # Load a JPEG image from the device
    image_path = "test123.jpg"  # Replace with the path to your image
    image = cv2.imread(image_path)

    if image is None:
        print("Error: Could not load the image.")
        exit()

    # Initialize Mediapipe pose object
    pose = mp_pose.Pose()

    # Convert the image to RGB as Mediapipe works with RGB images
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = pose.process(image_rgb)

    if results.pose_landmarks:
        # Draw pose landmarks on the image
        mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        # Check for unsafe sleeping patterns
        # if is_tummy_sleeping(results.pose_landmarks):
        #     cv2.putText(image, 'Alert: Baby is sleeping on tummy!', (50, 50), 
        #                 cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)

        # Check for side-sleeping position
        if is_side_sleeping(results.pose_landmarks):
            cv2.putText(image, 'Alert: Baby is sleeping on side!', (50, 100), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)

    # Display the image
    cv2.imshow('Baby Movement Detection', image)
    cv2.waitKey(1000)
    cv2.destroyAllWindows()
