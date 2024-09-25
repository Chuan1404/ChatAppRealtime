import { useContext, useEffect, useState } from "react";
import { API } from "../constants";
import { AuthContext } from "../context/AuthProvider";

const RoomBox = ({ room = null, setId = () => {} }) => {
  const [receiver, setReceiver] = useState(null);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    // personal room
    if (room.type == 1) {
      let m = room.members.find((item) => item._id != user._id);
      setReceiver(m);
    }
  }, []);

  const handleClick = () => {
    setId(room._id);
  };
  return (
    <div className="p-1">
      <li
        className="p-2 border-bottom"
        style={{ backgroundColor: "#eee" }}
        onClick={handleClick}
      >
        <a href="#!" className="d-flex justify-content-between">
          <div className="d-flex flex-row" style={{ alignItems: "center" }}>
            <img
              src={
                room.type == 1
                  ? `${API}/${receiver?.avatar}`
                  : `${API}/${room.image}`
              }
              alt="avatar"
              className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
              width="60"
              height="60"
            />
            <div className="pt-1">
              <p className="fw-bold mb-0">
                {room.type == 1 ? receiver?.name : room.name}
              </p>
            </div>
          </div>
        </a>
      </li>
    </div>
  );
};

export default RoomBox;
