import cv2
cap = cv2.VideoCapture(0)  #camera's index number
while True:
    ret, frame = cap.read()
    if not ret:
        break
    cv2.imshow('Baby Monitoring Feed', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):#q to exit video feed
        break
cap.release()
cv2.destroyAllWindows()