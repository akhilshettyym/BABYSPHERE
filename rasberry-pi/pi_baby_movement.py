import cv2
import mediapipe as mp
from picamzero import Camera

# Initialize Mediapipe pose and drawing classes
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

# Function to check for tummy sleeping using alignment of shoulders and head
def is_tummy_sleeping(pose_landmarks):
    nose = pose_landmarks.landmark[mp_pose.PoseLandmark.NOSE]
    left_shoulder = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER]
    right_shoulder = pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER]
    
    shoulder_mid_x = (left_shoulder.x + right_shoulder.x) / 2
    is_face_down = abs(nose.x - shoulder_mid_x) < 0.05
    
    if is_face_down and nose.y > left_shoulder.y and nose.y > right_shoulder.y:
        return True
    return False

# Function to check if the baby is sleeping sideways based on eye proximity
def is_side_sleeping(pose_landmarks):
    left_eye = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_EYE]
    right_eye = pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_EYE]
    
    eye_distance = abs(left_eye.x - right_eye.x)
    if eye_distance < 0.02:
        return True
    return False

# Initialize the PicamZero camera
cam = Camera()

# Start the camera preview
# cam.start_preview()

# Initialize Mediapipe Pose object
pose = mp_pose.Pose()

try:
    while True:
        # Get the current frame as a NumPy array
        frame = cam.frame  # Provides the current camera frame as an RGB array

        # Convert frame from RGB to BGR (OpenCV expects BGR format)
        frame_bgr = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)

        # Process the frame with Mediapipe
        results = pose.process(frame)

        if results.pose_landmarks:
            # Draw pose landmarks on the frame
            mp_drawing.draw_landmarks(frame_bgr, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

            # Check for unsafe sleeping patterns
            if is_tummy_sleeping(results.pose_landmarks):
                cv2.putText(frame_bgr, 'Alert: Baby is sleeping on tummy!', (50, 50),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
            elif is_side_sleeping(results.pose_landmarks):
                cv2.putText(frame_bgr, 'Alert: Baby is sleeping on side!', (50, 100),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)

        # Display the frame with landmarks and alerts
        cv2.imshow('Baby Movement Detection', frame_bgr)

        # Exit the loop if 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

finally:
    # Stop the camera preview and release resources
    cam.stop_preview()
    cv2.destroyAllWindows()
