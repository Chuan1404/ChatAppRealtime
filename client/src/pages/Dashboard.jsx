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

import React, { useContext, useEffect, useState } from "react";
import { AddGroupPopup, ChatBoard, Nav, RoomBox, UserBox } from "../components";
import { socket } from "../config/socket";
import { AuthContext } from "../context/AuthProvider";
import chatService from "../services/chatService";
import userService from "../services/userService";

export default function Dashboard() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
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
    let formData = new FormData();
    let body = {
      members: JSON.stringify([user._id, receiver._id]),
      type: 1,
    };

    for (var key in body) {
      formData.append(key, body[key]);
    }

    let response = await chatService.createRoom(formData);

    if (!response.error) {
      setRoomId(response.data._id);
      setTab("tab1");
    }
  };

  const handleOpenChat = (chatRoomId) => {
    socket.emit("JOIN_ROOM", chatRoomId);
    setRoomId(chatRoomId);
  };

  const handleAddRoom = (room) => {
    setRoomList([...roomList, room]);
  };

  useEffect(() => {
    // no-op if the socket is already connected
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

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
    if (tab == "tab3") fetchUserList();
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
                          onClick={() => handleTabClick("tab3")}
                          active={tab === "tab3"}
                        >
                          Danh sách người dùng
                        </MDBTabsLink>
                      </MDBTabsItem>
                    </MDBTabs>

                    <MDBTabsContent>
                      <MDBTabsPane open={tab === "tab1"}>
                        <MDBTypography listUnStyled className="mb-0">
                          {isFetching ? (
                            "...loading"
                          ) : (roomList && roomList.length > 0) ? (
                            roomList.map((room) => (
                              <RoomBox
                                key={"room" + room._id}
                                room={room}
                                setId={handleOpenChat}
                              />
                            ))
                          ) : (
                            <div className="my-4">
                              Chọn người để chat ở "Danh sách người dùng" hoặc thêm nhóm chat mới
                            </div>
                          )}

                          <AddGroupPopup handleAddRoom={handleAddRoom} />
                        </MDBTypography>
                      </MDBTabsPane>
                      <MDBTabsPane open={tab === "tab2"}>
                        <MDBTypography listUnStyled className="mb-0">

                        </MDBTypography>
                      </MDBTabsPane>
                      <MDBTabsPane open={tab === "tab3"}>
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
