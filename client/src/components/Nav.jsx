import {
  MDBCard,
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
} from "mdb-react-ui-kit";
import React, { useContext } from "react";
import { API } from "../constants";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Nav() {
  const { user } = useContext(AuthContext);
  const navigator = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigator("/sign-in");
  };
  return (
    <MDBCard
      className="d-flex"
      style={{
        flexDirection: "row",
        borderRadius: "15px",
        justifyContent: "space-between",
      }}
    >
      <div className="p-3">Logo</div>
      {user ? (
        <div className="p-3">
          <MDBDropdown>
            <MDBDropdownToggle
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <div style={{ display: "inline-flex", alignItems: "center" }}>
                <img
                  src={API + "/" + user.avatar}
                  className="rounded-circle"
                  alt="Avatar"
                  width={30}
                  height={30}
                />
                <span style={{ marginLeft: 10 }}>{user.name}</span>
              </div>
            </MDBDropdownToggle>
            <MDBDropdownMenu style={{ width: "100%" }} dark>
              <MDBDropdownItem onClick={handleSignOut} link>
                Sign out
              </MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
        </div>
      ) : null}
    </MDBCard>
  );
}
