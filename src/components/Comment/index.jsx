import React, { useRef, useMemo, useState } from "react";
import { Avatar, Space } from "antd";
import Mock from "mockjs";
import MyEditor from "../MyEditor";
import CommentList from "../CommentList";
import "./styles.scss";

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

const mockName = () => {
  return Mock.Random.cname();
};

/** 重点
 * @dataSource 数据格式，只嵌套两层，有两种：
 * ① 采用数据平铺的方式，对于回复的内容，可单独指定字段表示回复，然后修改其样式使评论列表有层次感，组件无需嵌套
 * ② 采用🌲结构的方式，对于回复的内容，数据会显示在第二层，组件采用嵌套的方式实现（弃用）
 *
 * @固定数据格式
 * @id 唯一标识符
 * @author 评论人、作者
 * @content 评论内容
 * @datetime 评论时间
 *
 * @额外数据格式
 * @emojis 表情项
 * @parentId 子项中添加一个父项 id，用来判断是否为子项，便于删除操作使用
 * @commenter 被评论者（子项，且只在回复其他子项时才展示）
 * @isDelete 父评论项是否被删除（拥有子评论项的父项被删除，不会从列表中消失，反之则消失）
 * @showEditor 是否显示编辑的 editor
 * @showReplyEditor 是否显示回复的 editor
 * TODO childComments 子项的 list，表明子项的个数，便于删除操作使用（需要接口配合）
 */
const initData = [
  {
    id: mockId(),
    author: mockName(),
    content: `<p>测试评论。。。<span data-w-e-type="mention" data-w-e-is-void data-w-e-is-inline data-value="郝大脸" data-info="%7B%22value%22%3A%22haodalian%22%7D">@郝大脸</span></p>`,
    datetime: "9 小时前",
    emojis: "momo"
  },
  {
    id: mockId(),
    author: mockName(),
    content: `<p>测试评论。。。</p><p><img src="https://konachan.com/image/3839a7794f1763574f8bc6ec5b132dde/Konachan.com%20-%20349836%20animal%20anthropomorphism%20bird%20cat%20chai_%28artist%29%20drink%20food%20fruit%20no_humans%20original%20polychromatic%20signed%20white.png" alt="。。。" data-href="" style="width: 30%;"/></p>`,
    datetime: "6 小时前"
  },
  { id: mockId(), author: mockName(), content: `<p>${mockContent()}</p>`, datetime: "4 小时前" }
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

// 重点 添加节点
const _addNode = (data = [], id, { newValue, currentValue }) => {
  const index = data.findIndex((item) => item.id === id);
  Object.keys(currentValue).length > 0 && data.splice(index, 1, { ...data[index], ...currentValue }); // 修改当前位置的数据
  data.splice(index + 1, 0, { ...newValue }); // 在指定位置的后面插入数据

  return data;
};

// 重点 删除节点，ids 可以是一个数组 / 字符串
const _deleteNode = (data = [], ids) => {
  if (Array.isArray(ids)) {
    return data.filter((item) => !ids.includes(item.id));
  }
  return data.filter((item) => item.id !== ids);
};

/**
 * @components 评论回复组件
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
  const actions = {
    // 编辑 & editor - 确定(异步)
    onItemEdit: (id, { value, showEditor }) => {
      let newData = [];
      if (value) {
        newData = _updateNode([...comments], id, { content: value, showEditor });
      } else {
        // 取消 / 编辑操作
        newData = _updateNode([...comments], id, { showEditor });
      }
      setComments(newData);
    },
    // 删除（异步）
    onItemDelete: (id) => {
      let newData = [];
      const index = comments.findIndex((item) => item.id === id); // 查找当前评论项的下标
      const curComment = comments[index];
      const prevComment = comments[index - 1]; // 上一项
      const nextComment = comments[index + 1]; // 下一项
      // 重点 删除父项时，若当前评论项为 父项 & 拥有子项（下一项为子项） 时，走 update，反之则 delete
      // 重点 在删除子项时，当父项（上一项）被删除，且下一项不是子项（父项只有一条子项），父项也随之删除
      if (!curComment?.parentId && nextComment && nextComment.parentId) {
        newData = _updateNode([...comments], id, {
          isDelete: true,
          content: "",
          emojis: "",
          showEditor: false,
          showReplyEditor: false
        });
      } else {
        if (curComment?.parentId && prevComment?.isDelete && !nextComment?.parentId) {
          newData = _deleteNode([...comments], [id, prevComment.id]);
        } else {
          newData = _deleteNode([...comments], id);
        }
      }
      setComments(newData);
    },
    // 添加表情（异步）
    onItemCheckEmoji: (id, { value }) => {
      let newData = [];
      newData = _updateNode([...comments], id, { emojis: value });
      setComments(newData);
    },
    // 回复 & editor - 确定(异步)
    onItemReply: (id, { value, showReplyEditor }) => {
      let newData = [];
      if (value) {
        // 重点 添加子项，并将当前项的 showReplyEditor 置为 false
        // 重点 查找当前项，只有当前项为子项时（回复子项时），才会显示被评论者，而被评论者是当前项的作者
        const curComment = comments.find((item) => item.id === id);

        newData = _addNode([...comments], id, {
          newValue: {
            id: mockId(),
            author: "Dinos",
            datetime: "3 小时前",
            content: value,
            parentId: curComment.id,
            ...(curComment.parentId && { commenter: curComment.author })
          },
          currentValue: { showReplyEditor: false }
        });
      } else {
        // 取消 / 回复操作
        newData = _updateNode([...comments], id, { showReplyEditor });
      }
      setComments(newData);
    }
  };

  return (
    <>
      <CommentList comments={comments} {...actions} />

      <div className="comment">
        <Avatar className="avatar" src="https://joeschmoe.io/api/v1/random" />
        <MyEditor onReply={onReply} showCancelBtn={false} editorStyle={{ minHeight: 188 }} />
      </div>
    </>
  );
}
