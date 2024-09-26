import authService from "../services/AuthService";

const callApiWithToken = async (url, options = {}) => {
  const token = JSON.parse(localStorage.getItem("token"));
  options = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
      ...options.headers,
    },
  };

  if(options.headers['Content-Type'] == "multipart/form-data")
    delete options.headers['Content-Type']

  let res = await fetch(url, options);
  if (res.status == 401) {
    const refreshToken = await authService.refreshToken();
    if (!refreshToken.error) {
      token.accessToken = refreshToken.data.accessToken;
      localStorage.setItem("token", JSON.stringify(token));

      options = {
        ...options,
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          ...options.headers,

        },
      };

      if(options.headers['Content-Type'] == "multipart/form-data")
        delete options.headers['Content-Type']
      res = await fetch(url, options);
    } else {
      return {
        error: refreshToken.error,
      };
    }
  }

  return res.json();
};

export default callApiWithToken;
