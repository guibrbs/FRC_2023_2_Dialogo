import React, { createContext, useContext, useMemo, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { OutboundMessageInterface } from "../interface/outboundMessageInterface";
import { UserContext } from "./UserContext";

type WebsocketConnectionType = {
  sendJsonMessage: SendJsonMessage,
  readyState: ReadyState,
  chatHistory: Array<OutboundMessageInterface>,
  loggedUsers: Array<string>,
}

export const WebsocketConnectionContext = createContext<WebsocketConnectionType>({
  readyState: -1,
  sendJsonMessage: function<T = unknown>(jsonMessage: T, keep?: boolean){
    throw new Error("Function not implemented.");
  },
  chatHistory: [],
  loggedUsers: [],
});

export const WebsocketConnectionContextProvider:React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatHistory, setChatHistory] = useState<Array<OutboundMessageInterface>>([]);
  const {setOtherUserName, userName} = useContext(UserContext);
  const [loggedUsers, setLoggedUsers] = useState<Array<string>>([]);

  const { sendJsonMessage, readyState } = useWebSocket("ws://192.168.1.20:8765", {
    onOpen: () => console.log("opened"),
    onMessage: async (message) => {
      let receivedData = message.data;

      try{
        receivedData = JSON.parse(receivedData);
      }catch{}

      if (receivedData["type"] === "message"){
        setChatHistory([...chatHistory, receivedData]);
      }

      if (receivedData["type"] === "connection"){
        const receivedUser = receivedData["user"]
        if (userName !== receivedUser){
          setOtherUserName(receivedUser);
        }

        setLoggedUsers([...loggedUsers, receivedUser])
      }

      if (receivedData["type"] === "streaming"){
        const canvaId = 'canvas-2';

        const canvas = document.getElementById(canvaId) as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        var image = new Image(50, 50);
        image.onload = function () {
          ctx!.drawImage(image, 0, 0, 300, 150);
        };

        image.src = receivedData["frame"];
      }

      if (receivedData["type"] === "audio"){
        var playPromise = new Audio("data:audio/wav;base64," + receivedData["audio"])
        playPromise.play()
      }
    },
    share: true
  });

  const contextValue = useMemo(() => {
    return {
        sendJsonMessage,
        chatHistory,
        readyState,
        loggedUsers,
    };
  }, [sendJsonMessage, chatHistory, readyState, loggedUsers]);

  
  return (
    <WebsocketConnectionContext.Provider value={contextValue}>
      {children}
    </WebsocketConnectionContext.Provider>
  )
}