import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBTabs,
  MDBTabsContent,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsPane,
  MDBTypography,
} from "mdb-react-ui-kit";

import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { ChatBoard, Nav, RoomBox, UserBox } from "../components";
import ChatBox from "../components/UserBox";
import { socket } from "../config/socket";
import { AuthContext } from "../context/AuthProvider";
import userService from "../services/userService";
import chatService from "../services/chatService";

export default function Dashboard() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const [roomList, setRoomList] = useState([]);

  const [isFetching, setIsFetching] = useState(false);

  const [roomId, setRoomId] = useState(null);
  const [tab, setTab] = useState("tab1");
  const { user } = useContext(AuthContext);

  const handleTabClick = (value) => {
    if (value === tab) {
      return;
    }

    setTab(value);
  };

  const handleUserClick = async (receiver) => {
    let body = {
      members: [user._id, receiver._id],
      type: 1
    };

    let response = await chatService.createRoom(body);

    if (!response.error) {
      setRoomId(response.data._id);
      setTab("tab1");
    }
  };

  const handleOpenChat = (chatRoomId) => {
    setRoomId(chatRoomId);
  };

  useEffect(() => {
    // no-op if the socket is already connected
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    function userAdded(data) {
      setOnlineUsers(data);
    }
    socket.emit("ADD_USER", user);

    socket.on("USER_ADDED", userAdded);

    return () => {
      socket.off("USER_ADDED", userAdded);
    };
  }, [socket, user]);

  // fetch user & room list
  useEffect(() => {
    async function fetchUserList() {
      setIsFetching(true);
      try {
        let response = await userService.getList();
        if (!response.error) setUserList(response.data);
        else console.log(response.error);
      } catch (err) {
        console.log({ err });
      } finally {
        setIsFetching(false);
      }
    }

    async function fetchRoomList() {
      setIsFetching(true);
      try {
        let response = await chatService.getRoom();
        if (!response.error) setRoomList(response.data);
        else console.log(response.error);
      } catch (err) {
        console.log({ err });
      } finally {
        setIsFetching(false);
      }
    }

    if (tab == "tab2") fetchUserList();
    if (tab == "tab1") fetchRoomList();
  }, [tab]);

  return (
    <MDBContainer
      fluid
      className="h-100 py-5"
      style={{ backgroundColor: "#CDC4F9" }}
    >
      <Nav />

      <MDBRow className="h-100">
        <MDBCol md="12" className="my-1">
          <MDBCard id="chat3" style={{ borderRadius: "15px" }}>
            <MDBCardBody>
              <MDBRow>
                <MDBCol sm="6" lg="5" xl="4" className="mb-4 mb-md-0">
                  <div
                    style={{
                      position: "relative",
                      height: "60vh",
                      overflow: "scroll",
                    }}
                  >
                    <MDBTabs className="mb-3 w-100">
                      <MDBTabsItem>
                        <MDBTabsLink
                          onClick={() => handleTabClick("tab1")}
                          active={tab === "tab1"}
                        >
                          Chat
                        </MDBTabsLink>
                      </MDBTabsItem>
                      <MDBTabsItem>
                        <MDBTabsLink
                          onClick={() => handleTabClick("tab2")}
                          active={tab === "tab2"}
                        >
                          Danh sách người dùng
                        </MDBTabsLink>
                      </MDBTabsItem>
                    </MDBTabs>

                    <MDBTabsContent>
                      <MDBTabsPane open={tab === "tab1"}>
                        <MDBTypography listUnStyled className="mb-0">
                          {isFetching
                            ? "...loading"
                            : roomList?.map((room) => (
                                <RoomBox
                                  key={"room" + room._id}
                                  room={room}
                                  setId={handleOpenChat}
                                />
                              ))}
                        </MDBTypography>
                      </MDBTabsPane>
                      <MDBTabsPane open={tab === "tab2"}>
                        <MDBTypography listUnStyled className="mb-0">
                          {isFetching
                            ? "...loading"
                            : userList?.map((user) => (
                                <UserBox
                                  key={"user" + user._id}
                                  user={user}
                                  setId={handleUserClick}
                                />
                              ))}
                        </MDBTypography>
                      </MDBTabsPane>
                    </MDBTabsContent>
                  </div>
                </MDBCol>
                <MDBCol sm="6" lg="7" xl="8">
                  {roomId ? (
                    <ChatBoard chatRoomId={roomId} />
                  ) : (
                    "Vui lòng chọn user để chat"
                  )}
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
