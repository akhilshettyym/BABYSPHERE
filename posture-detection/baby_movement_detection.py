import cv2
import mediapipe as mp

# Initialize Mediapipe pose class
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

# Function to check for tummy sleeping using alignment of shoulders and head
def is_tummy_sleeping(pose_landmarks):
    nose = pose_landmarks.landmark[mp_pose.PoseLandmark.NOSE]
    left_shoulder = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER]
    right_shoulder = pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER]
    
    # Check if nose is near the horizontal midpoint of the shoulders
    shoulder_mid_x = (left_shoulder.x + right_shoulder.x) / 2
    is_face_down = abs(nose.x - shoulder_mid_x) < 0.05  # Adjust threshold based on testing
    
    # Check if the nose is closer to shoulder level, indicating face-down alignment
    if is_face_down and nose.y > left_shoulder.y and nose.y > right_shoulder.y:
        return True
    return False

# Initialize Mediapipe pose object
pose = mp_pose.Pose()

# Start capturing video from the webcam
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open the camera.")
    exit()

while True:
    ret, frame = cap.read()

    if not ret:
        print("Error: Failed to capture image.")
        break

    # Convert the frame to RGB as Mediapipe works with RGB images
    image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(image_rgb)

    if results.pose_landmarks:
        # Draw pose landmarks on the frame
        mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        # Check for unsafe sleeping patterns
        if is_tummy_sleeping(results.pose_landmarks):
            cv2.putText(frame, 'Alert: Baby is sleeping on tummy!', (50, 50), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)

    # Show the video feed
    cv2.imshow('Baby Movement Detection', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
