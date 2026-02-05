import { createContext, useState, useEffect } from "react";
import React from "react";
export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(getLocaleStorageSessionId);
  function getLocaleStorageSessionId() {
    return localStorage.getItem("session_id");
  }
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("session_id", sessionId);
      fetch(
        `https://api.themoviedb.org/3/account?api_key=26b842803ccbaba051d1fd7169b8d506&session_id=${sessionId}`
      )
        .then((r) => r.json())
        .then((data) => setUser(data));
    }
  }, [sessionId]);
  function logout() {
    localStorage.clear();
    setUser(null);
    setSessionId(null);
  }

  return (
    <UserContext.Provider value={{ user, setUser, setSessionId, logout }}>
      {children}
    </UserContext.Provider>
  );
}
