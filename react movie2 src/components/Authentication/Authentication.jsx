import React, { useContext } from "react";
import { Button, Avatar, Badge, Menu, Dropdown } from "antd";
import { UserContext } from "../../contect/userContext";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { DownOutlined } from "@ant-design/icons";
export default function Authentication() {
  const { user, logout } = useContext(UserContext);
  const menu = (
    <Menu style={{ textAlign: "center" }}>
      <Menu.Item>
        <Link to="/profile">{user && <span>{user.username}</span>} </Link>
      </Menu.Item>
      <Menu.Divider />

      <Menu.Item danger onClick={logout}>
        {" "}
        Log out
      </Menu.Item>
    </Menu>
  );
  function handleLogin() {
    fetch(
      "https://api.themoviedb.org/3/authentication/token/new?api_key=26b842803ccbaba051d1fd7169b8d506"
    )
      .then((r) => r.json())
      .then((data) => {
        console.log(data.request_token);
        window.location = `https://www.themoviedb.org/authenticate/${
          data.request_token
        }?redirect_to=${import.meta.env.VITE_REDIRECT_URL}`;
      });
  }

  return (
    <nav>
      {user ? (
        <Dropdown overlay={menu} placement={"bottomCenter"}>
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            <DownOutlined />

            <span>
              <Badge dot>
                <Avatar shape="square" icon={<UserOutlined />} />
              </Badge>
            </span>
          </a>
        </Dropdown>
      ) : (
        <Button danger onClick={handleLogin}>
          Login
        </Button>
      )}
    </nav>
  );
}
