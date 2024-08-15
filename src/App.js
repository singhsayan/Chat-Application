import './App.css';
import { io } from "socket.io-client";
import { useState } from 'react';
import Chat from './chat';
import ScrollToBottom from 'react-scroll-to-bottom';

const socket = io.connect("http://localhost:3001");

function App() {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const [showChat, setShowChat] = useState(false);

    const joinRoom = () => {
        if (username !== "" && room !== "") {
            socket.emit("join_room", room);
            setShowChat(true);
        }
    };

    return (
        <div className="App">
            {!showChat ? (
                <div className='joinChatContainer'>
                    <h2>Chat App</h2>
                    <input 
                        type='text' 
                        placeholder='Sayan'
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <input 
                        type='text' 
                        placeholder='room id'
                        onChange={(event) => setRoom(event.target.value)}
                    />
                    <button onClick={joinRoom}>Join a room</button>
                </div>
            ) : (
                <Chat socket={socket} username={username} room={room} />
            )}
        </div>
    );
}

export default App;