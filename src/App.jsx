import React from "react";
import { Card } from "antd";
import Comment from "./components/Comment";

export default function App() {
  return (
    <div style={{ padding: 18 }}>
      {/* 评论组件 */}
      <Card style={{ width: "70%", margin: "0 auto" }}>
        <Comment />
      </Card>
    </div>
  );
}
