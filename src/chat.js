import React, { useEffect, useState } from "react";
import "./App.css"; // Ensure to create and link this CSS file

function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };
            if (socket) {
                await socket.emit("send_message", messageData);
                setMessageList((list) => [...list, messageData]);
                setCurrentMessage(""); // Clear the input field after sending the message
            } else {
                console.error("Socket is not defined");
            }
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on("recieve_message", (data) => {
                setMessageList((list) => [...list, data]);
                console.log("Message received:", data);
            });
        }

        // Cleanup on unmount
        return () => {
            if (socket) {
                socket.off("recieve_message");
            }
        };
    }, [socket]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                {messageList.map((messageContent, index) => (
                    <div key={index} className="message" id={username === messageContent.author ? "you" : "other"}>
                        <div className="message-meta">
                            <span className="author">{messageContent.author}</span> 
                            <span className="time">{messageContent.time}</span>
                        </div>
                        <div className="message-content">{messageContent.message}</div>
                    </div>
                ))}
            </div>
            <div className="chat-footer">
                <input
                    type="text"
                    placeholder="Write message here"
                    value={currentMessage}
                    onChange={(event) => setCurrentMessage(event.target.value)}
                    onKeyDown={(event) =>{
                        event.key === "Enter" && sendMessage();
                    }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    );
}

export default Chat;