import { useCallback, useContext, useState } from 'react'
import '../styles/messageBox.css'
import { WebsocketConnectionContext } from '../contexts/WebsocketConnectionContext';
import { UserContext } from '../contexts/UserContext';

export function MessageBox(){
  const { sendJsonMessage } = useContext(WebsocketConnectionContext)
  const { userName } = useContext(UserContext);
  const [inputValue, setInputValue] = useState("");

  const handleClickSendMessage = useCallback(() => {
    sendJsonMessage({chat: inputValue, user: userName, type: "message"})
    setInputValue("");
  }, [inputValue, userName, sendJsonMessage]);

  const handleKeyPress = useCallback(
    (e: any) => {
      if (e.key === 'Enter' && inputValue.length > 0) {
        handleClickSendMessage();
      }
    },
    [handleClickSendMessage, inputValue]
  );

  return (
    <div className='message-box-wrapper'>
      <button 
        className={`send-btn ${inputValue.length > 0 && "filled"}`} 
        onClick={handleClickSendMessage}
      >
        <span className="material-symbols-outlined">send</span>
      </button>
      <input 
        className="message-box" 
        placeholder='Envie uma mensagem'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
      />
    </div>
  )
}