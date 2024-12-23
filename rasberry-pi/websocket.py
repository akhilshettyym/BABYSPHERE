import asyncio
import websockets
import base64
import time
import requests
from picamzero import Camera
from threading import Thread
import os

# Global variables
latest_image = None
latest_result = None

# Function to capture an image every 1 second
def capture_images():
    global latest_image, latest_result

    cam = Camera()

    while True:
        # Take photo and read it as binary
        image_path = os.path.expanduser("~/Desktop/new_image.jpg")
        cam.take_photo(image_path)
        
        with open(image_path, "rb") as image_file:
            image_data = image_file.read()
            latest_image = base64.b64encode(image_data).decode('utf-8')

        # Send the image to the API
        files = {
            'file': ('image.jpg', image_data, 'image/jpeg')
        }
        try:
            response = requests.post('https://babysphere-2-0.onrender.com/process-frame/', files=files)
            if response.status_code == 200:
                latest_result = response.json().get("alert", "No alert received")
            else:
                latest_result = f"Error: {response.status_code}"
        except Exception as e:
            latest_result = f"Error: {str(e)}"

        time.sleep(1)

# WebSocket server to share image and result
async def websocket_handler(websocket, path):
    global latest_image, latest_result

    while True:
        if latest_image:
            message = {
                "image": latest_image,
                "result": latest_result if latest_result else "No result available"
            }
            await websocket.send(str(message))
        await asyncio.sleep(1)

# Start the WebSocket server
async def start_websocket_server():
    server = await websockets.serve(websocket_handler, "0.0.0.0", 8765)
    await server.wait_closed()

# Thread to run the camera capture
camera_thread = Thread(target=capture_images)
camera_thread.daemon = True
camera_thread.start()

# Run the WebSocket server
asyncio.get_event_loop().run_until_complete(start_websocket_server())
asyncio.get_event_loop().run_forever()
