import { ReactNode, useContext } from 'react'
import '../styles/chat.css'
import { MessageBox } from './messageBox'
import { WebsocketConnectionContext } from '../contexts/WebsocketConnectionContext'
import { Message } from './message';

export function Chat(){
  const {chatHistory} = useContext(WebsocketConnectionContext);

  const renderChatHistory = ():ReactNode => {
    return chatHistory.map((message, index) => (
      <Message messageData={message} key={index}/>
    ))
  }

  return (
    <div className="chat-box">
      <p className='chat-title'>Mensagens na chamada</p>
      <div className='chat-conversation'>
        {renderChatHistory()}
      </div>
      <MessageBox/>
    </div>
  )
}