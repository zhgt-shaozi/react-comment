import React, { useRef, useMemo, useState } from "react";
import { Button, Avatar, Space } from "antd";
import MyEditor from "./MyEditor";
import "./styles.scss";

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
        <Button type="primary">回复</Button>
      </Space>
    </Space>
  );
}
