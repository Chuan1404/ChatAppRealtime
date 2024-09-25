import { API } from "../constants";

const authService = {
  signUp(formData) {
    return fetch(`${API}/auth/sign-up`, {
      method: "POST",
      headers: {
        // Note: Do not set 'Content-Type' header when sending FormData
        // It will be automatically set by the browser to "multipart/form-data"
      },
      body:formData,
    }).then((res) => res.json());
  },

  signIn(form) {
    return fetch(`${API}/auth/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    }).then((res) => res.json());
  },

  refreshToken() {
    const token = JSON.parse(localStorage.getItem('token'))
    return fetch(`${API}/auth/refresh-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            refreshToken: token.refreshToken
        })
    }).then(res => res.json())
}
};

export default authService;
