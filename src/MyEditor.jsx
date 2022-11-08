import React, { useRef, useEffect, useState } from "react";
import { Button, Avatar, Space } from "antd";
import { DomEditor } from "@wangeditor/editor";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import "@wangeditor/editor/dist/css/style.css";
import "./styles.scss";

export default function MyEditor(props) {
  const { style } = props;

  const reactQuillRef = useRef(null);

  const [editor, setEditor] = useState(null);
  const [value, setValue] = useState("");
  const [linkVisible, setLinkVisible] = useState(false);

  // 及时销毁 editor ，重要！
  useEffect(() => {
    const toolbar = DomEditor.getToolbar(editor);
    // const curToolbarConfig = toolbar.getConfig();
    console.log("toolbar: ", toolbar);

    return () => {
      if (editor === null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  // 工具栏配置
  const toolbarConfig = {
    // 想要排除的配置项
    excludeKeys: [
      "|", // 配置项间的分割线
      "lineHeight", // 默认行高
      "fontFamily", // 默认字体
      "insertVideo", // 简洁模式下的插入视频
      "insertTable", // 插入表格
      "undo", // 撤销
      "redo", // 重做
      "emotion", // 表情
      "group-more-style", // 默认模式下的更多...菜单，包括删除线、行内代码、清除格式等
      "group-video" // 默认模式下的插入视频菜单
    ],
    // 插入的配置项，index 表示从第几项开始插入（基于 toolbar.config.toolbarKeys）
    insertKeys: { index: 6, keys: ["through", "code", "clearStyle"] }
  };

  // 编辑器配置
  const editorConfig = {
    placeholder: "请输入内容",
    readOnly: false, // 是否只读
    autoFocus: false // 是否自动对焦
  };

  const handleChange = (editor) => {
    setValue(editor.getHtml());
  };

  return (
    <div className="editor-box">
      {/* 工具栏 */}
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default" // 默认模式，简洁模式为 simple
        className="editor-toolbar"
      />
      {/* 编辑器 */}
      <Editor
        defaultConfig={editorConfig}
        value={value}
        onCreated={setEditor} // 创建编辑器
        onChange={handleChange}
        mode="default"
        className="editor"
        style={style}
      />
    </div>
  );
}
