import React, { useRef, useMemo, useState } from "react";
import { Button, Avatar, Space } from "antd";
import MyEditor from "../MyEditor";

export default function Comment() {
  const reactQuillRef = useRef(null);

  const [value, setValue] = useState();
  const [linkVisible, setLinkVisible] = useState(false);

  return (
    <Space align="start">
      <Avatar
        style={{ marginTop: 5 }}
        src="https://joeschmoe.io/api/v1/random"
      />
      <Space direction="vertical">
        <MyEditor />
      </Space>
    </Space>
  );
}
