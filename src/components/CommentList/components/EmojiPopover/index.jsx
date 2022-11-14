import React, { useEffect, useState } from "react";
import { Space, Popover } from "antd";
import IconFont from "../../../IconFont";
import "./styles.scss";
import { EmojiGather } from "../../constants";

export default function EmojiPopover(props) {
  /**
   * @props 属性
   * @selected  父组件传来的选中项
   */
  const { onClick, selected } = props;

  const [emojiActive, setEmojiActive] = useState([]); // 选中的 emoji
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!selected) return;

    setEmojiActive(selected.split(","));
  }, [selected]);

  const handleClick = (item) => {
    let newData = [...emojiActive];

    if (emojiActive.includes(item.code)) {
      const index = emojiActive.findIndex((v) => v === item.code);
      newData.splice(index, 1);
    } else {
      newData.push(item.code);
    }

    setOpen(false);
    setEmojiActive(newData);

    onClick && onClick(newData.join(","));
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  return (
    <Popover
      content={
        <Space size={4} style={{ display: "flex" }}>
          {EmojiGather.map((item, index) => (
            <div
              key={item.code}
              className={`emoji ${emojiActive.includes(item.code) && "emoji-active"}`}
              onClick={() => handleClick(item)}
            >
              <img src={item.url} height={20} width={20} style={{ display: "block" }} />
            </div>
          ))}
        </Space>
      }
      overlayClassName="emoji-popover" // 卡片类名
      open={open}
      onOpenChange={handleOpenChange}
    >
      {/* 需要额外包一层 html 标签，否则 对 Popover 无法生效 */}
      <span>
        <IconFont type="icon-dino-A" />
      </span>
    </Popover>
  );
}
