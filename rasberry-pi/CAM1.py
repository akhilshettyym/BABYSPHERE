from picamzero import Camera
from io import BytesIO
from PIL import Image
import asyncio
import websockets

# Initialize the camera
cam = Camera()

async def send_frames(websocket, path):
    cam.start_preview()  # Starts the camera preview
    try:
        while True:
            # Capture frame
            frame = cam.capture_image()
           
            # Convert to bytes
            with BytesIO() as output:
                frame.save(output, format="JPEG")
                frame_data = output.getvalue()
           
            # Send frame over WebSocket
            await websocket.send(frame_data)
           
            # Limit frame rate
            await asyncio.sleep(1 / 30)  # 30 FPS
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")
    finally:
        cam.stop_preview()

# Start WebSocket server
start_server = websockets.serve(send_frames, "0.0.0.0", 8000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
