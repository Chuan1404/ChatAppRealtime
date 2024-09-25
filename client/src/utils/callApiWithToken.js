import authService from "../services/AuthService";

const callApiWithToken = async (url, options = {}) => {
  const token = JSON.parse(localStorage.getItem("token"));
  options = {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
  };
  let res = await fetch(url, options);
  if (res.status == 401) {
    const refreshToken = await authService.refreshToken();
    if (!refreshToken.error) {
      token.accessToken = refreshToken.data.accessToken;
      localStorage.setItem("token", JSON.stringify(token));

      options = {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token.accessToken}`,
        },
      };
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
