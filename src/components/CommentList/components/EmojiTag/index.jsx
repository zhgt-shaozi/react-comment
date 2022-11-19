import React, { useEffect, useState } from "react";
import { Space } from "antd";
import { EmojiGather } from "../../constants";
import "./styles.scss";

export default function EmojiSelected(props) {
  const { selected } = props;

  return (
    <Space>
      {EmojiGather.map((item) => {
        if (selected.split(",").includes(item.code)) {
          return (
            <div className="emoji-post" key={item.code}>
              <img src={item.url} height={16} width={16} style={{ display: "block" }} />
              <span>{1}</span>
            </div>
          );
        }
        return null;
      })}
    </Space>
  );
}
