import React, { useRef, useMemo, useState } from "react";
import { Button, Avatar, Space } from "antd";
import MyEditor from "../MyEditor";
import CommentList from "../CommentList";

// API 模拟异步请求
const fetch = (params) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { id, value } = params;
      resolve({
        code: 200,
        success: true,
        data: { id, author: "Dinos", content: value, datetime: "2022-11-12 11:26:54" }
      });
    }, 1000);
  });
};

export default function Comment() {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "张三",
      content: "<p>测试。。。。</p>",
      datetime: "6 小时前",
      emojiAction: "thumbs_up,momo"
    },
    {
      id: 2,
      author: "李四",
      content: "<p>测试评论评论。。。。</p>",
      datetime: "8 小时前",
      emojiAction: "thumbs_up,momo,thumbs_down,+1"
    }
  ]);

  // 回复
  const onReply = async ({ value }) => {
    const { data } = await fetch({ id: comments.length + 1, value });

    setComments([...comments, data]);

    return data; // 重点 return 是为了让子组件能够顺利拿到 res
  };

  // item 操作项
  const itemActions = {
    // 编辑 & 编辑的 editor - 取消 / 确定(异步)
    onItemEdit: (item, i, { value, showEditor }) => {
      const newData = [...comments];
      if (value) {
        // 表示确定
        newData.splice(i, 1, { ...newData[i], showEditor, content: value });
      } else {
        newData.splice(i, 1, { ...newData[i], showEditor });
      }
      setComments(newData);
    },
    // 删除（异步）
    onItemDelete: (item, i) => {
      const { id } = item;
      let newData = [...comments];
      newData = comments.filter((com) => com.id !== id);
      newData.forEach((com, index) => (com.id = index + 1)); // 重置 comments 的 id
      setComments(newData);
    },
    // 添加表情（异步）
    onItemCheckEmoji: (item, i, { value }) => {
      const newData = [...comments];
      newData.splice(i, 1, { ...newData[i], emojiAction: value });
      setComments(newData);
    }
  };

  return (
    <>
      <CommentList comments={comments} {...itemActions} />

      <Space align="start" style={{ padding: "16px 0" }}>
        <Avatar style={{ marginTop: 5 }} src="https://joeschmoe.io/api/v1/random" />
        <Space direction="vertical">
          <MyEditor onReply={onReply} showCancelBtn={false} />
        </Space>
      </Space>
    </>
  );
}
