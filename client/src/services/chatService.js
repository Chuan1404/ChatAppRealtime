import { API } from "../constants";
import callApiWithToken from "../utils/callApiWithToken";

const chatService = {
  createRoom(formData) {
    return callApiWithToken(`${API}/chat/create-room`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });
  },

  getRoom() {
    return callApiWithToken(`${API}/chat/get-room`);
  },

  createChat(data) {
    return callApiWithToken(`${API}/chat/create-chat`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getChat(chatRoomId) {
    return callApiWithToken(`${API}/chat/get-chat/${chatRoomId}`);
  },
};

export default chatService;
