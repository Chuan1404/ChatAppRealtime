import { MDBBtn, MDBTypography } from "mdb-react-ui-kit";
import { API } from "../constants";

const UserBox = ({ user = null, setId = () => {} }) => {
  const handleUserClick = () => {
    setId(user);
  };
  return (
    <div className="p-1">
      <li
        className="p-2 border-bottom"
        style={{ backgroundColor: "#eee" }}
        onClick={handleUserClick}
      >
        <a href="#!" className="d-flex justify-content-between">
          <div className="d-flex flex-row" style={{ alignItems: "center" }}>
            <img
              src={user ? `${API}/${user.avatar}` : ""}
              alt="avatar"
              className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
              width="60"
              height="60"
            />
            <div className="pt-1">
              <p className="fw-bold mb-0">{user ? user.email : ""}</p>
            </div>
          </div>
        </a>
      </li>
    </div>
  );
};

export default UserBox;
