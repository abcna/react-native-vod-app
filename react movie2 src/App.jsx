import React, { useState } from "react";

import { Layout, Menu, Breadcrumb, Row, Col, Button, Card } from "antd";

import "./App.css";
import { Link, Route, Switch } from "react-router-dom";
import PopularTv from "./components/Pages/PopularTv.jsx";
import News from "./components/Pages/News";
import Home from "./components/Pages/Home";
import Search from "./components/search/Search.jsx";
import Registery from "./components/Pages/Registery";
import Login from "./components/Pages/Login";
import Movie from "./components/Pages/Movie";
import Tv from "./components/Pages/Tv";
import Selebs from "./components/Pages/Selebs";
import Familygenre from "./components/Pages/Familygenre";
import TopMovies from "./components/Pages/TopMovies.jsx";
import TopTv from "./components/Pages/TopTv";
import MenuItems from "./components/MenuItems";
import Actiongenre from "./components/Pages/Actiongenre";
import Animationgenre from "./components/Pages/Animationgenre";
import Comedygenre from "./components/Pages/Comedygenre";
import Dramagenre from "./components/Pages/Dramagenre";
import Scearygenre from "./components/Pages/Scearygenre";
import Fiction from "./components/Pages/Fictiongenre";
import Fictiongenre from "./components/Pages/Fictiongenre";
import Authentication from "./components/Authentication/Authentication";
import Auth from "./components/Authentication/Auth";
function App() {
  const { Header, Content, Footer, Sider } = Layout;
  const { Meta } = Card;
  return (
    <div className="App">
      {" "}
      <Row>
        <Col>
          <Layout>
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
                  <Authentication />
                </Menu.Item>
              </Menu>
            </Header>
            <Row style={{ marginTop: 20 }}>
              {" "}
              <Col span={24}>
                <Search />
              </Col>
            </Row>
            <Content style={{ padding: "0 50px" }}>
              <Layout
                className="site-layout-background"
                style={{ padding: "24px 0" }}
              >
                <Sider className="site-layout-background" width={200}>
                  <MenuItems />
                </Sider>
                <Content style={{ padding: "0 24px", minHeight: 280 }}>
                  <Switch>
                    <Route path="/news">
                      {" "}
                      <News />{" "}
                    </Route>
                    <Route path="/TopMovies">
                      <TopMovies />
                    </Route>
                    <Route path="/populartv">
                      {" "}
                      <PopularTv />{" "}
                    </Route>
                    <Route path="/registery">
                      <Registery />{" "}
                    </Route>
                    <Route path="/login">
                      <Login />{" "}
                    </Route>
                    <Route path="/toptv">
                      <TopTv />
                    </Route>
                    <Route path="/familygenre">
                      <Familygenre />
                    </Route>
                    <Route path="/actiongenre">
                      <Actiongenre />
                    </Route>
                    <Route path="/animationgenre">
                      <Animationgenre />
                    </Route>
                    <Route path="/comedygenre">
                      <Comedygenre />
                    </Route>
                    <Route path="/dramagenre">
                      <Dramagenre />
                    </Route>
                    <Route path="/scearygenre">
                      {" "}
                      <Scearygenre />
                    </Route>
                    <Route path="/fictiongenre">
                      <Fictiongenre />
                    </Route>
                    <Route path="/auth">
                      <Auth />
                    </Route>
                    <Route path="/profile"> </Route>
                    <Route exact path="/movie/:id" component={Movie} />
                    <Route exact path="/tv/:id" component={Tv} />
                    <Route exact path="/selebs/:id" component={Selebs} />

                    <Route exact path="/home">
                      {" "}
                      <Home />{" "}
                    </Route>
                    <Route path="/">
                      {" "}
                      <Home />{" "}
                    </Route>
                  </Switch>
                </Content>
              </Layout>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Ant Design ©2018 Created by Ant UED
            </Footer>
          </Layout>
        </Col>
      </Row>
      ,{" "}
    </div>
  );
}

export default App;
