import React, { useContext } from "react"
import '../styles/camPreview.css'
import Webcam from "react-webcam"
import { CamPreviewContext } from "../contexts/CamPreviewContext"

interface CamPreviewInterface {
  size: string,
}

export function CamPreview({size}:CamPreviewInterface){
  const {camState, setCamState} = useContext(CamPreviewContext);
  
  type camSizeType = {
    home: object,
    meet: object
  }

  const camSize:camSizeType = {
    home: {
      height: "40vh",
      width: "40vw",
    },
    meet: {
      height: "80vh",
      width: "80vw",
    }
  }

  return (
    <div className="cam-preview-container" style={camSize[size as keyof camSizeType]}>
      {!camState && <p style={{color: "white"}}>Câmera desligada</p> }
      <button className={`cam-btn ${!camState && 'cam-off'}`} onClick={() => setCamState(!camState)}>
        <span className="material-symbols-outlined">
          {camState ? 'videocam' : 'videocam_off'}
        </span>
      </button>
      {camState && <Webcam mirrored={true} className="webcam"/>}
    </div>
  )
}