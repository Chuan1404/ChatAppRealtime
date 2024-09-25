import { MDBIcon } from "mdb-react-ui-kit";
import { useContext, useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import chatService from "../services/chatService";
import { AuthContext } from "../context/AuthProvider";
import { API } from "../constants";
import { socket } from "../config/socket";

const ChatBoard = ({ chatRoomId = null }) => {
  const inputRef = useRef(null);
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const chatRef = useRef()

  const handleChat = async () => {
    let content = inputRef.current.value;

    if (content) {
      let data = {
        chatRoomId,
        senderId: user._id,
        content,
        createdAt: new Date(),
        senderObject: {
          avatar: user.avatar
        }
      }
      socket.emit("SEND_MESSAGE", data)
      setMessages([...messages, data])
      inputRef.current.value = "";
      await chatService.createChat(data);

    }
  };

  const onEnter = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      handleChat()
  }
  }

  useEffect(() => {
    async function fetchMessage() {
      setIsFetching(true);

      let response = await chatService.getChat(chatRoomId);

      if (!response.error) {
        setMessages(response.data);
      }

      setIsFetching(false);
    }

    fetchMessage();
  }, []);

  useEffect(() => {
    function handleReceiveMessage(data) {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, data];
        return updatedMessages;
      });
    }
    socket.on("RECEIVE_MESSAGE", handleReceiveMessage);

    return () => {
      socket.off("RECEIVE_MESSAGE", handleReceiveMessage);
    }
    
  }, [socket]);

  useEffect(() => {
    let height = chatRef.current.scrollHeight
    chatRef.current.scrollTop = height
  }, [messages]);
  return (
    <>
      <div
        style={{
          position: "relative",
          height: "60vh",
          overflow: "scroll",
        }}
        className="pt-3 pe-3"
        ref={chatRef}
      >
        {isFetching
          ? "...loading"
          : messages?.map((message, index) => (
              <MessageBox
                key={index}
                message={message}
                isSameUser={message.senderId == user._id}
              />
            ))}
      </div>
      <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
        <img
          src={API + "/" + user.avatar}
          alt="avatar 3"
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
        />
        <input
          type="text"
          className="form-control form-control-lg"
          id="exampleFormControlInput2"
          placeholder="Type message"
          ref={inputRef}
          onKeyDown={onEnter} 
        />
        <a className="ms-1 text-muted" href="#!">
          <MDBIcon fas icon="paperclip" />
        </a>
        <a className="ms-3 text-muted" href="#!">
          <MDBIcon fas icon="smile" />
        </a>
        <a className="ms-3" href="#!">
          <MDBIcon fas icon="paper-plane" onClick={handleChat} />
        </a>
      </div>
    </>
  );
};

export default ChatBoard;
