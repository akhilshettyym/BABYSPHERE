from picamzero import Camera

cam = Camera()
cam.start_preview()
cam.record_video("~/Desktop/new_video.mp4", duration=5)
cam.stop_preview()