import React, { useEffect, useState } from "react";
import { Button, Space } from "antd";
import { DomEditor, Boot } from "@wangeditor/editor";
import mentionModule from "@wangeditor/plugin-mention";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import "@wangeditor/editor/dist/css/style.css";
import MentionModal from "./MentionModal";
import "./styles.scss";

// 注册插件、拓展菜单。要在创建编辑器之前注册，且只能注册一次，不可重复注册。
Boot.registerModule(mentionModule);

export default function MyEditor(props) {
  const { style } = props;

  const [editor, setEditor] = useState(null);
  const [value, setValue] = useState("");
  const [mentionModalVisible, setMentionModalVisible] = useState(false);

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

  // TODO 工具栏配置
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

  // TODO 编辑器配置
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
    },
    // 添加第三方插件
    EXTEND_CONF: {
      // 提及@ 功能
      mentionConfig: {
        showModal: () => setMentionModalVisible(true),
        hideModal: () => setMentionModalVisible(false)
      }
    }
  };

  // 将选中的提及项展示在 editor 中
  const insertMention = ({ name, value }) => {
    const mentionNode = {
      type: "mention", // 必须是 'mention'
      value: name, // 展示上去的内容，只能是字符串，会以 data-value 的形式展示在 DOM 上
      info: { value }, // 自定义额外信息，会以 data-info 的形式展示在 DOM 上，但实质上是一个编码的对象形式，需要使用 decodeURIComponent 对其转义，得到正确的对象形式，便于后端拿到
      children: [{ text: "" }] // 必须有一个空 text 作为 children
    };

    if (editor) {
      editor.restoreSelection(); // 恢复选区
      editor.deleteBackward("character"); // 删除 '@'
      editor.insertNode(mentionNode); // 插入 mention
      editor.move(1); // 移动光标
    }
  };

  const handleChange = (editor) => {
    setValue(editor.getHtml());
  };

  const handleReply = () => {
    if (!editor) return;
    console.log("editor: ", editor);
    console.log("value: ", value);
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
        {/* 提及组件 */}
        <MentionModal
          visible={mentionModalVisible}
          onCancel={() => setMentionModalVisible(false)}
          insertMention={insertMention}
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
