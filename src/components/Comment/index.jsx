import React, { useRef, useMemo, useState } from "react";
import { Button, Avatar, Space } from "antd";
import Mock from "mockjs";
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

const mockId = () => {
  return `FC-${Mock.Random.string("number", 5)}`;
};

const mockContent = () => {
  return Mock.mock("@cparagraph(1, 3)");
};

const initData = [
  {
    id: mockId(),
    author: "张三",
    content: `<p>${mockContent()}</p>`,
    datetime: "6 小时前",
    emojis: "thumbs_up,momo"
  },
  {
    id: mockId(),
    author: "王五",
    content: `<p>${mockContent()}</p>`,
    datetime: "7 小时前",
    emojis: "momo",
    isReply: true
  },
  { id: mockId(), author: "李四", content: `<p>${mockContent()}</p>`, datetime: "8 小时前" },
  { id: mockId(), author: "王五", content: `<p>${mockContent()}</p>`, datetime: "9 小时前" }
];

// 重点 查找🌲节点，并修改该节点数据
const _findTreeNode = (tree, id, changeValue = {}) => {
  // console.log("changeValue: ", changeValue);
  // 开启递归
  const searchId = (source, id) => {
    source.forEach((item) => {
      if (item.id === id) {
        // 遍历传来的对象，对 item 进行赋值
        for (const key in changeValue) {
          item[key] = changeValue[key];
        }
        return;
      }
      if (item.replyList && item.replyList.length > 0) {
        searchId(item.replyList, id);
      }
    });
  };
  searchId(tree, id);
  return tree;
};

// 重点 查找🌲节点，并删除该节点
const _deleteTreeNode = (tree, id) => {
  tree.forEach((item, index) => {
    if (item.id === id) {
      tree.splice(index, 1);
      return;
    }
    if (item.replyList && item.replyList.length > 0) {
      _deleteTreeNode(item.replyList, id);
    }
  });
  return tree;
};

// 重点 查找节点，并修改该节点数据
const _updateNode = (data = [], id, changeValue = {}) => {
  const index = data.findIndex((item) => item.id === id); // 找到对应的 index
  data.splice(index, 1, { ...data[index], ...changeValue });

  return data;
};

// 重点 删除节点
const _deleteNode = (data = [], id) => {
  return data.filter((item) => item.id !== id);
};

/**
 * @components 评论回复组件
 * @dataSource 数据格式，只嵌套两层，有两种：
 * ① 采用数据平铺的方式，对于回复的内容，可单独指定字段表示回复，然后修改其样式使评论列表有层次感，组件无需嵌套
 * ② 采用🌲结构的方式，对于回复的内容，数据会显示在第二层，组件采用嵌套的方式实现（弃用）
 */

export default function Comment() {
  const [comments, setComments] = useState(initData);

  // 回复
  const onReply = async ({ value }) => {
    const { data } = await fetch({ id: mockId(), value });

    setComments([...comments, data]);

    return data; // 重点 return 是为了让子组件能够顺利拿到 res
  };

  // item 操作项
  const itemActions = {
    // 编辑 & 编辑的 editor - 取消 / 确定(异步)
    onItemEdit: (id, { value, showEditor }) => {
      let newData = [];
      if (value) {
        // 确定操作
        newData = _updateNode([...comments], id, { showEditor, content: value });
      } else {
        // 取消 / 编辑操作
        newData = _updateNode([...comments], id, { showEditor });
      }
      setComments(newData);
    },
    // 删除（异步）
    onItemDelete: (id) => {
      let newData = [];
      newData = _deleteNode([...comments], id);
      setComments(newData);
    },
    // 添加表情（异步）
    onItemCheckEmoji: (id, { value }) => {
      let newData = [];
      newData = _updateNode([...comments], id, { emojis: value });
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
