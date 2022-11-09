import React, { useRef, useEffect, useState } from "react";
import { Button, Avatar, Space } from "antd";
import { DomEditor, IEditorConfig } from "@wangeditor/editor";
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
      "justifyJustify", // 两端对齐
      "group-more-style", // 默认模式下的更多...菜单，包括删除线、行内代码、清除格式等
      "group-video", // 默认模式下的插入视频菜单
      "group-indent" // 默认模式下的调整缩进菜单
    ],
    // 插入的配置项，index 表示从第几项开始插入（基于 toolbar.config.toolbarKeys）；
    // toolbar.config.toolbarKeys 会根据 mode 的值发生改变；default 是 32 项，simple 是 30 项；
    insertKeys: {
      index: 6,
      keys: [
        "through", // 删除线
        "code", // 行内代码
        "clearStyle" // 清除格式
      ]
    }
  };

  // 编辑器配置
  const editorConfig = {
    placeholder: "请输入内容",
    readOnly: false, // 是否只读
    autoFocus: false, // 是否自动对焦
    // maxLength: 200, // 编辑内容的最大长度
    // 自定义菜单，可通过 editor.getMenuConfig('菜单名称') 来获取默认的菜单内容
    MENU_CONF: {
      // color: { colors: ["#000", "#333", "#666"] }  // 文字颜色
      // uploadImage: { server: "", fieldName: "" } // 图片上传
      // bgColor: { colors: [] }, // 文字背景颜色
      // fontSize: { fontSizeList: ["12px", "16px"] }, // 字号
      // fontFamily: { fontFamilyList: ["黑体", "楷体"] }, // 字体
      // lineHeight: { lineHeightList: ["1", "1.5"] }, // 行高
      // emotion: { emotions: ["😄"] }, // 表情
    }
  };

  const handleChange = (editor) => {
    setValue(editor.getHtml());
  };

  const handleReply = () => {
    if (!editor) return;
    console.log("editor: ", editor);
  };

  return (
    <Space direction="vertical" size={12} style={{ wdith: "100%" }}>
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

      <Space>
        <Button type="primary" onClick={handleReply}>
          回复
        </Button>
        <Button type="text">取消</Button>
      </Space>
    </Space>
  );
}
