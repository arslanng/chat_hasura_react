import "./App.css";
import { Button, Form, Input, List } from "antd";
import { useMutation, useSubscription } from "@apollo/client";
import { CREATE_MESSAGE, USER_CREATED_MUTATION, CHAT_SUB } from "./queries";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(localStorage.getItem("user_id") || null);

  const [createUser, { loading: user_loading }] = useMutation(
    USER_CREATED_MUTATION
  );
  const [createMessage, { loading: message_loading }] =
    useMutation(CREATE_MESSAGE);
  const { data, loading } = useSubscription(CHAT_SUB);

  const onFinish = async (values) => {
    const data = await createUser({
      variables: {
        object: values,
      },
    });
    console.log("data:", data.data.insert_users_one.id);
    localStorage.setItem("user_id", data.data.insert_users_one.id);
    setUser(localStorage.getItem("user_id"));
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onMessage = (values) => {
    createMessage({
      variables: {
        object: { user_id: user, message: values.message },
      },
    });
    console.log("Success:", values);
  };
  const onMessageFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const logOut = () => {
    localStorage.removeItem("user_id")
    setUser(null)
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const messages = data.messages;
  console.log(messages);

  return (
    <div className="App">
      {!user && (
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="User name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input disabled={user_loading} />
          </Form.Item>

          <Form.Item
            label="Background Color"
            name="background_color"
            rules={[
              {
                required: true,
                message: "Please select your Background Color!",
              },
            ]}
          >
            <Input type="color" disabled={user_loading} />
          </Form.Item>

          <Form.Item
            label="Text Color"
            name="text_color"
            rules={[
              {
                required: true,
                message: "Please select your Background Color!",
              },
            ]}
          >
            <Input type="color" disabled={user_loading} />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" loading={user_loading}>
              Gir
            </Button>
          </Form.Item>
        </Form>
      )}
      {user && (
        <div>
          <h1>{user} <Button onClick={logOut}>Çıkış</Button></h1>
          <List>
            {messages &&
              messages.map((message) => (
                <p className={message.user.id === user ? "benim" : "diger"}>
                  
                  <span style={{padding:10, backgroundColor: message.user.background_color, color: message.user.text_color}}>
                    {message.user.name}
                  </span>
                  <span>
                    {message.message}
                  </span>
                </p>
              ))}
          </List>
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onMessage}
            onFinishFailed={onMessageFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Message"
              name="message"
              rules={[
                {
                  required: true,
                  message: "Please input your message!",
                },
              ]}
            >
              <Input disabled={message_loading} />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                loading={message_loading}
              >
                Gönder
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
}

export default App;
