import React from "react";
import { useState } from "react";
import { Form, Input, Button, Checkbox, Row , Col } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import style from "../../style.css";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom"
export default function Login() {
 
    let history = useHistory()

  const onFinish = (values) => {
    console.log("Success:", values);
    history.push("/store")
    
  };
  

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
      <Row justify='center'>
          <Col>
       
    <Form
      style={{ maxWidth: 300}}
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Please input your Username!" }]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>مرا به خاطر بسپار</Checkbox>
        </Form.Item >
        <Form.Item>
        <a style={{float:'right'}} className="login-form-forgot" href="">
          رمز را فراموش کردم
        </a>
        </Form.Item>
      </Form.Item>

      <Form.Item>
        <Button style={{width:'100%'}} type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        یا <Link to="/registery">حالا ثبت نام کن </Link>
      </Form.Item>
    </Form>
    </Col>
      </Row>
  );
}
