import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

export default function App() {
  
  return (
    <div id="app">
      <Routes>
        <Route
          index
          element={
            <AuthProvider>
              <Dashboard />
            </AuthProvider>
          }
        />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
      </Routes>
    </div>
  );
}
