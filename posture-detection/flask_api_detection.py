import cv2
import mediapipe as mp
from flask import Flask, Response, jsonify, request
import requests
import numpy as np

# Initialize Flask app
app = Flask(__name__)

# Mediapipe initialization
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

# Initialize Mediapipe pose object
pose = mp_pose.Pose()

# URL of the Raspberry Pi video feed
RASPBERRY_PI_VIDEO_URL = "http://192.168.99.120:5000/video_feed"

# To store the notification state
notification_sent = {"tummy": False, "side": False, "normal": False}

# Function to check for tummy sleeping
def is_tummy_sleeping(pose_landmarks):
    left_shoulder = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER]
    right_shoulder = pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER]
    return abs(left_shoulder.x - right_shoulder.x) < 0.3

# Function to check for side sleeping
def is_side_sleeping(pose_landmarks):
    left_eye = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_EYE]
    right_eye = pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_EYE]
    return abs(left_eye.x - right_eye.x) < 0.07

# Function to process the frames and overlay posture detection results
def generate_frames():
    global notification_sent
    stream = requests.get(RASPBERRY_PI_VIDEO_URL, stream=True)
    if stream.status_code != 200:
        print("Error: Unable to access video feed.")
        return

    bytes_buffer = b''
    for chunk in stream.iter_content(chunk_size=1024):
        bytes_buffer += chunk
        a = bytes_buffer.find(b'\xff\xd8')  # JPEG start
        b = bytes_buffer.find(b'\xff\xd9')  # JPEG end
        if a != -1 and b != -1:
            # Extract JPEG image
            jpg = bytes_buffer[a:b+2]
            bytes_buffer = bytes_buffer[b+2:]

            # Decode image
            frame = cv2.imdecode(np.frombuffer(jpg, dtype=np.uint8), cv2.IMREAD_COLOR)

            # Convert the frame to RGB
            image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(image_rgb)

            if results.pose_landmarks:
                # Draw pose landmarks on the frame
                mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

                # Check and overlay warnings
                if is_tummy_sleeping(results.pose_landmarks):
                    cv2.putText(frame, 'Alert: Baby is sleeping on tummy!', (50, 50),
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
                    if not notification_sent["tummy"]:
                        send_notification("Alert: Baby is sleeping on tummy!")
                        notification_sent = {"tummy": True, "side": False, "normal": False}
                elif is_side_sleeping(results.pose_landmarks):
                    cv2.putText(frame, 'Alert: Baby is sleeping on side!', (50, 100),
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
                    if not notification_sent["side"]:
                        send_notification("Alert: Baby is sleeping on side!")
                        notification_sent = {"tummy": False, "side": True, "normal": False}
                else:
                    # Normal position
                    cv2.putText(frame, 'Normal: Baby is in a safe position.', (50, 150),
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
                    if not notification_sent["normal"]:
                        send_notification("Normal: Baby is in a safe position.")
                        notification_sent = {"tummy": False, "side": False, "normal": True}

            # Encode the processed frame to JPEG
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            # Yield the processed frame
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

def send_notification(message):
    """
    This function simulates sending a notification.
    Replace with your own notification logic (e.g., push notifications, email, SMS).
    """
    print(f"Notification sent: {message}")
    # Example: Integrate with an API like Twilio, Firebase, or custom backend for real notifications.

@app.route('/processed_feed')
def processed_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/send_notification', methods=['POST'])
def api_send_notification():
    """
    Manual endpoint to send a notification (optional API for external triggering).
    """
    data = request.json
    if "message" in data:
        send_notification(data["message"])
        return jsonify({"status": "success", "message": "Notification sent."}), 200
    return jsonify({"status": "error", "message": "Missing 'message' in request."}), 400

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5002, threaded=True)