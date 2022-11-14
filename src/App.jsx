import React from "react";
import { Card } from "antd";
import Comment from "./components/Comment";
import "./styles.scss";

export default function App() {
  return (
    <div className="app">
      {/* 评论组件 */}
      <Card style={{ width: "80%", margin: "0 auto" }}>
        <Comment />
      </Card>
    </div>
  );
}
