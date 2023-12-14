import asyncio
import base64
import binascii
import io
import time
import wave
import websockets
import json

connected_clients = set()
CONNECTED_CLIENTS_NAME = []

async def handle_messages(parsed_message):
  current_time = time.asctime()
  parsed_message.update({"time": current_time})
  await asyncio.gather(*[client.send(json.dumps(parsed_message)) for client in connected_clients])

async def handle_connection(parsed_message):
  user_name = parsed_message.get("user")
  CONNECTED_CLIENTS_NAME.append(user_name)
  await asyncio.gather(*[client.send(json.dumps(parsed_message)) for client in connected_clients])

async def stream_video(websocket, parsed_message):
  await asyncio.gather(*[client.send(json.dumps(parsed_message)) for client in connected_clients if client != websocket])

async def stream_audio(websocket, parsed_message):
  try:
    audio_bytes = base64.b64decode(parsed_message["audio"], validate=True)  # Validate padding

    audio_buffer = io.BytesIO(audio_bytes)

    num_channels = 1
    sample_width = 2
    frame_rate = 44100
    frames = len(audio_bytes) // sample_width // num_channels
    audio_data = (num_channels, sample_width, frame_rate, frames, 'NONE', 'not compressed')

    with wave.open(audio_buffer, 'wb') as wav_file:
      wav_file.setparams(audio_data)
      wav_file.writeframes(audio_bytes)

      audio_buffer.seek(0)
      buffer_size = 4096 * 4
      audio_data_wav = audio_buffer.read(buffer_size)

      audio_base64 = base64.b64encode(audio_data_wav).decode('utf-8')
      parsed_message["audio"] = audio_base64

      await asyncio.gather(*[client.send(json.dumps(parsed_message)) for client in connected_clients if client != websocket])
  except binascii.Error as e:
    print(f"Error decoding Base64 audio: {e}")
     

async def handler(websocket):
  connected_clients.add(websocket)

  try:
    async for message in websocket:
      parsed_message = json.loads(message)

      if parsed_message.get("type") == "message":
        await handle_messages(parsed_message)

      if parsed_message.get("type") == "connection":
        await handle_connection(parsed_message)

      if parsed_message.get("type") == "streaming" and len(CONNECTED_CLIENTS_NAME) > 1:
        await stream_video(websocket, parsed_message)

      if parsed_message.get("type") == "audio" and len(CONNECTED_CLIENTS_NAME) > 1:
        await stream_audio(websocket, parsed_message)

  except websockets.exceptions.ConnectionClosedError:
      pass
  finally:
      connected_clients.remove(websocket)

async def main():
    async with websockets.serve(handler, "192.168.1.20", 8765):
        print("WebSocket server started...")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
