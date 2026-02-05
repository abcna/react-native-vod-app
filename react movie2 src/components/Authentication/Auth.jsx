import React, { useContext, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { UserContext } from "../../contect/userContext";

export default function Auth() {
  const { setSessionId } = useContext(UserContext);
  const location = useLocation();
  const history = useHistory();
  const requestToken = new URLSearchParams(location.search).get(
    "request_token"
  );

  useEffect(() => {
    if (requestToken) {
      const url = `
    https://api.themoviedb.org/3/authentication/session/new?api_key=26b842803ccbaba051d1fd7169b8d506`;
      fetch(url, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          request_token: requestToken,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          setSessionId(data.session_id);
          history.replace("/");
        });
    }
  }, [requestToken]);

  return (
    <div style={{ color: "white" }}>
      <h1 style={{ color: "white" }}>Hellloooooo</h1>
    </div>
  );
}
