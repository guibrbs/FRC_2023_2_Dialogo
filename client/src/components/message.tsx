import { useContext } from "react";
import { parseTime } from "../utils/parseTime";
import { UserContext } from "../contexts/UserContext";
import '../styles/message.css'
import { OutboundMessageInterface } from "../interface/outboundMessageInterface";

interface MessageInterface {
  messageData: OutboundMessageInterface
}

export const Message = ({messageData}: MessageInterface) => {
  const {userName} = useContext(UserContext);
  const {chat, user, time} = messageData;
  const isUser = user === userName

  return (
    <div className={`message ${!isUser && "out"}`}>
      <p> 
        <b>{isUser ? "Você" : user} </b> 
        <span className="time">{parseTime(time)}</span>
      </p>
      <p>{chat}</p>
    </div>
  )
}