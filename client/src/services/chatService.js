import { API } from "../constants";
import callApiWithToken from "../utils/callApiWithToken";

const chatService = {
  createRoom(data) {
    return callApiWithToken(`${API}/chat/create-room`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
  },

  getRoom() {
    return callApiWithToken(`${API}/chat/get-room`);
  },

  createChat(data) {
    return callApiWithToken(`${API}/chat/create-chat`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
  },

  getChat(chatRoomId) {
    return callApiWithToken(`${API}/chat/get-chat/${chatRoomId}`);
  },
};

export default chatService;
