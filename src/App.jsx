import React from "react";
// import { Comment, Avatar } from "antd";
import Comment from "./components/Comment";
import CommentList from "./components/CommentList";
import "./styles.scss";

export default function App() {
  return (
    <div className="app">
      {/* 评论列表 */}
      <CommentList />

      {/* 评论 */}
      <Comment />
    </div>
  );
}
