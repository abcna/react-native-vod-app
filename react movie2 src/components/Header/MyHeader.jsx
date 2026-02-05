import React from "react";
import { Link } from "react-router-dom";
import { Menu, Header, Layout } from "antd";
export default function MyHeader() {
  const { SubMenu } = Menu;
  const { Header, Content, Footer, Sider } = Layout;
  return (
    <Header className="header">
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
        <Menu.Item key="1">
          {" "}
          <Link to="/"> </Link>
          <Link to="/home"> home </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/news"> news </Link>
        </Menu.Item>

        <Menu.Item style={{ marginLeft: 1000 }} key="10">
          <Button danger onClick={handleClick}>
            Login
          </Button>
        </Menu.Item>
      </Menu>
    </Header>
  );
}
