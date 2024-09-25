import { API } from "../constants";
import callApiWithToken from "../utils/callApiWithToken";

const userService = {
  getInfo() {
    return callApiWithToken(`${API}/user/get-info`);
  },

  getList() {
    return callApiWithToken(`${API}/user/get-list`);
  },
};

export default userService;
