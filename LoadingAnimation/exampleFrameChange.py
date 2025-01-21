import asyncio
import requests  # For sending POST requests

# Flask server URL for posting frame data
FLASK_SERVER_URL = "http://127.0.0.1:5000/send-frame"

async def frame_sender():
    current_frame = 0
    while True:
        # Simulate updating the current frame
        current_frame += 1
        if current_frame > 100: 
            current_frame = 0
        print(f"Sending frame: {current_frame}")

        # Send the frame to the Flask server
        frame_data = {'frame': current_frame}
        response = requests.post(FLASK_SERVER_URL, json=frame_data)
        print(response.json())

        # Wait for 0.5 second before sending the next frame
        await asyncio.sleep(0.5)

async def main():
    await frame_sender()

asyncio.get_event_loop().run_until_complete(main())
