import React from "react";
import { List } from "antd";
import CommentItem from "./components/CommentItem";
import "./styles.scss";

export default function CommentList(props) {
  const { comments = [], ...actions } = props;
  console.log("comments: ", comments);

  return comments.length > 0 ? (
    <List
      className="comment-list"
      dataSource={comments}
      header={comments.length && `所有评论（${comments.length}）`}
      itemLayout="horizontal"
      renderItem={(item, index) => {
        // console.log("item: ", item); // comments 中的元数据
        return <CommentItem {...item} {...actions} />;
      }}
    />
  ) : null;
}
