import { API } from "../constants";

const MessageBox = ({ isSameUser = false, message = {} }) => {
  return (
    <div
      className={`d-flex flex-row ${
        isSameUser ? "justify-content-end" : "justify-content-start"
      }`}
    >
      {!isSameUser && (
        <img
          src={`${API}/${message?.senderObject?.avatar}`}
          alt="avatar"
          style={{ width: "45px", height: "45px", borderRadius: '50%', marginRight: 5 }}
        />
      )}
      <div>
        <p
          className={`small p-2 me-3 mb-1 rounded-3 ${
            isSameUser ? "text-white" : "text-black"
          }`}
          style={{ background: isSameUser ? "rgb(59, 113, 202)" : "#f5f6f7" }}
        >
          {message.content}
        </p>
        <p className="small me-3 mb-3 rounded-3 text-muted">
          {new Date(message.createdAt).toTimeString().split(' ')[0]}
        </p>
      </div>
    </div>
  );
};

export default MessageBox;
