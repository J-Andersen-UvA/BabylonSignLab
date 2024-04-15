import cv2 as cv2
import numpy as np

def get_first_and_last_frame(video_path):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Could not open video.")
        return

    total_frames = 0
    first_frame = None
    last_frame = None

    # Read frames in a loop
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        total_frames += 1
        if total_frames == 1:
            first_frame = frame  # Save the first frame
        if total_frames == 81:
            last_frame = frame  # Continuously update to save the last frame
    print("Total frames in the video: ", total_frames)

    # Release the video capture object
    cap.release()

    # Save the first and last frames as images
    if first_frame is not None:
        cv2.imwrite('first_frame.png', first_frame)
        print("First frame saved as 'first_frame.png'")
    if last_frame is not None:
        cv2.imwrite('last_frame.png', last_frame)
        print("Last frame saved as 'last_frame.png'")

    #cv2.waitKey(0)  # Wait for a key press to exit
    cv2.destroyAllWindows()  # Close the image display window

# Replace 'path_to_video.webm' with your video file path


get_first_and_last_frame('AAP.webm')