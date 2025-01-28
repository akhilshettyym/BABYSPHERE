import cv2
import mediapipe as mp
from time import sleep
import firebase_admin
from firebase_admin import credentials, db, storage
import os

# Firebase Initialization
cred = credentials.Certificate("pyfi-demo-firebase-adminsdk-f64d3-041b367b77.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://pyfi-demo-default-rtdb.asia-southeast1.firebasedatabase.app/',
    'storageBucket': 'your-firebase-storage-bucket.appspot.com'
})

# Initialize Mediapipe pose and drawing classes
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

# Function to check for tummy sleeping using alignment of shoulders and head
def is_tummy_sleeping(pose_landmarks):
    left_shoulder = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER]
    right_shoulder = pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER]
    # Check shoulder alignment
    if abs(left_shoulder.x - right_shoulder.x) < 0.3:
        return True
    return False

# Function to check if the baby is sleeping sideways based on eye proximity
def is_side_sleeping(pose_landmarks):
    left_eye = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_EYE]
    right_eye = pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_EYE]
    left_shoulder = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER]
    right_shoulder = pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER]

    # Check if shoulders indicate a sideways roll
    if abs(left_shoulder.x - right_shoulder.x) < 0.3:
        return True

    # Check if the horizontal distance between eyes is very small
    eye_distance = abs(left_eye.x - right_eye.x)
    if eye_distance < 0.07:  # Adjust threshold based on testing
        return True
    return False

# Function to upload image to Firebase Storage
def upload_image_to_firebase(image_path):
    bucket = storage.bucket()
    blob = bucket.blob(os.path.basename(image_path))
    blob.upload_from_filename(image_path)
    # Get the public URL of the uploaded image
    return blob.public_url

# Main loop
while True:
    camera = cv2.VideoCapture(0)
    result, image = camera.read()
    camera.release()

    if not result:
        print("Error: Could not capture the image.")
        continue

    # Save the captured image
    image_path = "test123.jpg"
    cv2.imwrite(image_path, image)

    # Convert image to RGB for Mediapipe
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Initialize Mediapipe pose object
    pose = mp_pose.Pose()
    results = pose.process(image_rgb)

    # Initialize variables for Firebase
    alert_message = None
    unsafe_sleeping = False

    if results.pose_landmarks:
        # Draw pose landmarks on the image
        mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        # Check for unsafe sleeping patterns
        if is_tummy_sleeping(results.pose_landmarks):
            alert_message = 'Alert: Baby is sleeping on tummy!'
            unsafe_sleeping = True
            cv2.putText(image, alert_message, (50, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
        elif is_side_sleeping(results.pose_landmarks):
            alert_message = 'Alert: Baby is sleeping on side!'
            unsafe_sleeping = True
            cv2.putText(image, alert_message, (50, 100),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
        else:
            alert_message = 'Baby is in a safe sleeping position.'
            unsafe_sleeping = False

    # Display the image
    cv2.imshow('Baby Movement Detection', image)
    cv2.waitKey(1000)
    cv2.destroyAllWindows()

    # Upload the image to Firebase Storage
    image_url = upload_image_to_firebase(image_path)

    # Update Firebase Database
    ref = db.reference("baby_monitoring")
    ref.update({
        "unsafe_sleeping": unsafe_sleeping,
        "alert_message": alert_message,
        "image_url": image_url
    })

    print(f"Data sent to Firebase: {alert_message}, Image URL: {image_url}")
