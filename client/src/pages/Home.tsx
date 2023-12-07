import '../styles/home.css';
import { CamPreview } from '../components/camPreview';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { WebsocketConnectionContext } from '../contexts/WebsocketConnectionContext';

function Home() {
  const navigate = useNavigate();
  const { userName, setUserName } = useContext(UserContext);
  const { sendJsonMessage } = useContext(WebsocketConnectionContext)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  return (
    <div className="App">
      <CamPreview size="home"/>
      <div className='enter-call'>
        <h1>Pronto para participar?</h1>
        <input className='username-input' placeholder='Digite seu nome' onChange={handleChange}/>
        <button 
          disabled={userName.length <= 0} 
          onClick={() => {
            localStorage.setItem("user", userName);
            sendJsonMessage({type: "connection", user: userName})
            navigate("/meet");
          }}
        >
            Participar
        </button>
      </div>
    </div>
  );
}

export default Home;
