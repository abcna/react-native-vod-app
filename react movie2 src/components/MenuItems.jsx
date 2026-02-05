import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import action from "./Images/action.png";
import rajab from "./Images/rajab.png";
import family from "./Images/family.png";
import drama from "./Images/drama.jpg";
export default function MenuItems() {
  const { SubMenu } = Menu;
  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      style={{ height: "100%" }}
    >
      <SubMenu key="sub3" icon={<UserOutlined />} title="Movies">
        <Menu.Item key="1">
          <Link to="/news"> upcoming movies </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/populartv"> PoPular Tv shows </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/TopMovies"> Topmovies </Link>{" "}
        </Menu.Item>
        <Menu.Item key="4">
          <Link to="/topTv"> TopTv</Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu key="sub1" icon={<NotificationOutlined />} title="ganre ">
        <Menu.Item
          style={{
            backgroundImage: `url(${rajab})`,
          }}
          key="9"
        >
          <Link to="/comedygenre">
            <strong
              style={{
                border: "solid 2px",
                filter: "blur(0px)",
                justifyContent: "center",
                color: "red",
              }}
            >
              Comedy
            </strong>
          </Link>
        </Menu.Item>

        <Menu.Item
          style={{
            backgroundImage: `url(${action})`,
          }}
          key="12"
        >
          <Link to="/actiongenre">
            <strong
              style={{
                border: "solid 2px",
                filter: "blur(0px)",
                justifyContent: "center",
                color: "red",
              }}
            >
              action
            </strong>
          </Link>
        </Menu.Item>
        <Menu.Item
          style={{
            backgroundImage: `url(${family})`,
          }}
          key="13"
        >
          <Link to="/familygenre">
            <strong
              style={{
                border: "solid 2px",
                filter: "blur(0px)",
                justifyContent: "center",
                color: "red",
              }}
            >
              family
            </strong>
          </Link>
        </Menu.Item>
        <Menu.Item
          style={{
            backgroundImage: `url(${drama})`,
          }}
          key="14"
        >
          <Link to="/dramagenre">
            <strong
              style={{
                border: "solid 2px",
                filter: "blur(0px)",
                justifyContent: "center",
                color: "red",
              }}
            >
              {" "}
              Drama{" "}
            </strong>
          </Link>
        </Menu.Item>
        <Menu.Item
          style={{
            backgroundImage: `url(data:image/jpeg;base64,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)`,
          }}
          key="15"
        >
          <Link to="/animationgenre">
            <strong
              style={{
                border: "solid 2px",
                filter: "blur(0px)",
                justifyContent: "center",
                color: "red",
              }}
            >
              {" "}
              Animation{" "}
            </strong>
          </Link>
        </Menu.Item>
        <Menu.Item
          style={{
            backgroundImage: `url(data:image/jpeg;base64,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)`,
          }}
          key="16"
        >
          <Link to="/scearygenre">
            <strong
              style={{
                border: "solid 2px",
                filter: "blur(0px)",
                justifyContent: "center",
                color: "red",
              }}
            >
              {" "}
              sceary{" "}
            </strong>
          </Link>
        </Menu.Item>
        <Menu.Item
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w300/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg)`,
          }}
          key="17"
        >
          <Link to="/fictiongenre">
            {" "}
            <strong
              style={{
                border: "solid 2px",
                filter: "blur(0px)",
                justifyContent: "center",
                color: "red",
              }}
            >
              {" "}
              Science Fiction{" "}
            </strong>
          </Link>
        </Menu.Item>
      </SubMenu>
      ,
    </Menu>
  );
}
