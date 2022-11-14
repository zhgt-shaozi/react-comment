import React, { useRef, useEffect, useState, useCallback } from "react";
import { Input, Space, Avatar, Empty, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { isEmpty, debounce } from "lodash";
import "./styles.scss";

const dataSource = [
  { name: "张三", value: "zhangsan", email: "zhangsan@gmail.com" },
  { name: "李四", value: "lisi", email: "lisi@gmail.com" },
  { name: "王五", value: "wangwu", email: "wangwu@gmail.com" },
  { name: "Dinos", value: "dinos", email: "dinos@gmail.com" },
  { name: "郝大脸", value: "haodalian", email: "haodalian@gmail.com" },
  { name: "郝可爱", value: "haokeai", email: "haokeai@gmail.com" },
  { name: "郝漂亮", value: "haopiaoliang", email: "haopiaoliang@gmail.com" },
  { name: "嘘，", value: "xu", email: "xu@gmail.com" }
];

// API 模拟异步请求
const fetch = (params) => {
  console.log("params: ", params);
  return new Promise((resolve) => {
    setTimeout(() => {
      const { keyword } = params;
      resolve({
        code: 200,
        success: true,
        data: !keyword ? dataSource : dataSource.filter((item) => item.value.includes(keyword))
      });
    }, 500);
  });
};

export default function MentionModal(props) {
  const { visible, onCancel, insertMention } = props;

  const mentionRefs = useRef(null);
  const inputRefs = useRef(null);
  const userListRefs = useRef(null);

  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [dom, setDom] = useState(null); // 每次悬浮 li，就将该元素存进来
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible || !mentionRefs) {
      setUserInfo([]);
      return;
    }

    // 重点 获取光标位置
    const modalDom = mentionRefs.current;

    const domSelection = document.getSelection(); // 表示用户的光标开始位置到结束位置的选区
    const domRange = domSelection.getRangeAt(0); // 返回一个包含当前选区内容的区域对象
    if (domRange === null) return;

    const selectionRect = domRange.getBoundingClientRect(); // 返回一个 DOMRect 对象，其提供了元素的大小及其相对于视口的位置
    console.log("selectionRect: ", selectionRect);

    // 定位 modal 的位置
    setTop(selectionRect.top + 20);
    setLeft(selectionRect.left + 5);

    // 重点 让 modal 的 opacity = 1，解决位置闪烁的问题
    modalDom.style.opacity = 1;

    // 让 input 聚焦
    inputRefs && inputRefs.current.focus();

    // 调用请求
    fetchUserInfo();
  }, [visible, mentionRefs]);

  // 获取用户列表
  const fetchUserInfo = async (params) => {
    setLoading(true);

    const { success, data } = await fetch(params || { keyword: "" });
    if (success) {
      setLoading(false);
      setUserInfo(data);
    }
  };

  // 重点 创建一个全局的 点击事件，点击除自身外的任意地方，使 input 失焦
  const handleClick = useCallback(
    (event) => {
      // 🍋 node.contains(otherNode) 来验证 node 节点中是否包含 otherNode 节点，返回 boolean; 可以用来判断当前元素是否为本身
      // 🍋 classList.contains(class) 来验证 classList 类列表中是否包含 class 类，返回 boolean
      if (visible && mentionRefs.current && !mentionRefs.current.contains(event.target)) {
        dom && dom.removeAttribute("style");
        onCancel && onCancel();
      }
    },
    [visible]
  );

  useEffect(() => {
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true); // 卸载事件
    };
  }, [handleClick]);

  // 重点 鼠标移入事件
  const handleMouseMove = (item) => {
    if (!userListRefs?.current) return;

    const li = userListRefs.current.querySelector(`li[data-id=${item.value}]`);

    setDom((prevDom) => {
      if (prevDom && prevDom.getAttribute("data-id") !== li.getAttribute("data-id")) {
        prevDom.removeAttribute("style"); // 将上一次悬浮的 li 的样式删除掉
      }
      return li;
    });

    li.style.backgroundColor = "#eef1f0";
  };

  // 点击 li
  const handleClickItem = (item) => {
    insertMention && insertMention(item);
    onCancel && onCancel();
  };

  // input 输入
  const handleChangeInput = (e) => {
    const { value: inputValue } = e.target;
    fetchDebounce(inputValue);
  };

  // 添加防抖
  const fetchDebounce = debounce(async (keyword) => {
    fetchUserInfo({ keyword });
  }, 600);

  return visible ? (
    <div ref={mentionRefs} id="mention-modal" className="mention-modal" style={{ top, left }}>
      <div className="search">
        <Input
          ref={inputRefs}
          prefix={<SearchOutlined style={{ fontSize: 12, color: "#6b7785" }} />}
          placeholder="试试在此输入姓名搜索更多人"
          bordered={false}
          onChange={handleChangeInput}
        />
      </div>

      <Spin spinning={loading}>
        {isEmpty(userInfo) ? (
          <Empty description="暂无数据" style={{ padding: "18px 0", color: "#00000040" }} />
        ) : (
          <ul ref={userListRefs} className="user-list">
            {userInfo.map((item) => (
              <li
                key={item.value}
                data-id={item.value}
                onMouseEnter={() => handleMouseMove(item)}
                onClick={() => handleClickItem(item)}
              >
                <Space style={{ width: "100%" }}>
                  <Avatar src="https://joeschmoe.io/api/v1/random" />
                  <Space direction="vertical" size={0}>
                    <span className="name">{item.name}</span>
                    <span className="email">{item.email}</span>
                  </Space>
                </Space>
              </li>
            ))}
          </ul>
        )}
      </Spin>
    </div>
  ) : null;
}
