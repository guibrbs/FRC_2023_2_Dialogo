import { useCallback, useContext, useEffect, useRef } from 'react'
import { Chat } from '../components/chat'
import '../styles/meetScreen.css'
import { CamPreviewContext } from '../contexts/CamPreviewContext';
import { UserContext } from '../contexts/UserContext';
import { WebsocketConnectionContext } from '../contexts/WebsocketConnectionContext';
import Webcam from 'react-webcam';

export function MeetScreen() {
  const { camState } = useContext(CamPreviewContext);
  const { userName } = useContext(UserContext);
  const { loggedUsers, sendJsonMessage } = useContext(WebsocketConnectionContext);
  const loggedUserName = userName || localStorage.getItem("user")
  const webcamRef = useRef<Webcam>(null);

  const sendVideoToWebSocket = useCallback(() => {
    const webcam = webcamRef.current;
    if (webcam && webcam.video) {
      const videoStream = webcam.video as HTMLVideoElement;

      videoStream.addEventListener('play', () => {
        const sendFrame = () => {
          if (videoStream.paused || videoStream.ended) {
            return;
          }

          const canvas = document.createElement('canvas');
          canvas.width = videoStream.videoWidth;
          canvas.height = videoStream.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoStream, 0, 0, canvas.width, canvas.height);
            const base64 = canvas.toDataURL('image/png');
            sendJsonMessage({user: loggedUserName, type: "streaming", frame: base64});
          }

          setTimeout(sendFrame, 120);
        };
        sendFrame();
      });
    }
  }, [loggedUserName, sendJsonMessage]);

  const encodePCMtoBase64 = useCallback((pcmData: Float32Array): string => {
    const pcmBytes = new Int16Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      const val = Math.max(-1, Math.min(1, pcmData[i]));
      pcmBytes[i] = val < 0 ? val * 0x8000 : val * 0x7FFF;
    }
  
    const pcmBuffer = new ArrayBuffer(pcmBytes.length * 2);
    const dataView = new DataView(pcmBuffer);
    pcmBytes.forEach((sample, offset) => {
      dataView.setInt16(offset * 2, sample, true);
    });
  
    const base64String = arrayBufferToBase64(pcmBuffer);
    return base64String;
  }, []);
  
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const startStreamingAudio = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const audioSource = audioContext.createMediaStreamSource(stream);

      const bufferSize = 4096 * 4;
      const scriptNode = audioContext.createScriptProcessor(bufferSize, 1, 1);

      scriptNode.onaudioprocess = (audioProcessingEvent: AudioProcessingEvent) => {
        const inputBuffer = audioProcessingEvent.inputBuffer;
        const inputData = inputBuffer.getChannelData(0);

        const base64Data = encodePCMtoBase64(inputData);
        sendJsonMessage({type: "audio", user: loggedUserName, audio: base64Data})
      };

      audioSource.connect(scriptNode);
      scriptNode.connect(audioContext.destination);
    } catch (err) {
      console.error('Erro ao acessar o microfone:', err);
    }
  }, [encodePCMtoBase64, loggedUserName, sendJsonMessage]);

  /* const startStreamingAudio = async () => {
    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia({audio: true});
    } catch (error) {
      console.log(error)
    }
    
    const recorder = new MediaRecorder(stream as MediaStream);
    
    recorder.ondataavailable = ({ data }) => {
      var reader = new FileReader();
      reader.onload = function() {
        if (reader.result instanceof ArrayBuffer) {
          console.error('Failed to read data as a string.');
        } else if (typeof reader.result === 'string') {
          var base64data = reader.result.split(',')[1]; // Extract base64 string after comma
          sendJsonMessage({ type: "audio", user: loggedUserName, audio: base64data });
        } else {
          console.error('Unexpected type of reader result.');
        }
      };
      reader.readAsDataURL(data);
    };

    recorder.start(1000);
  }; */

  useEffect(() => {
    if (loggedUsers.includes(loggedUserName as string)){
      sendVideoToWebSocket();
      startStreamingAudio();
    }
  }, [loggedUserName, loggedUsers, sendVideoToWebSocket, startStreamingAudio]);
  

  return (
    <div className='screen-wrapper'>
      <div className='cam-wrapper'>
        <Webcam ref={webcamRef} className="cam" mirrored={true}/>
        <canvas id="canvas-2" className='cam'/>
      </div>
      <Chat />
    </div>
  )
}