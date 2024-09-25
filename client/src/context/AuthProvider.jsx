import { createContext, useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import userService from "../services/userService";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigator = useNavigate();
  const providerValue = useMemo(() => ({ user, isLoading }), [user, isLoading]);

  useEffect(() => {
    let token = JSON.parse(localStorage.getItem("token"));

    if (!token) {
      navigator("/sign-in");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await userService.getInfo();
        if (!res.error) {
          setUser(res.data);
        } else {
          localStorage.removeItem("token");
          navigator("/sign-in");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigator]);
  return (
    <AuthContext.Provider value={providerValue}>
      {isLoading ? "...Loading" : children}
    </AuthContext.Provider>
  );
}
