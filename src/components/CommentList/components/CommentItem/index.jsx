import React, { useState } from "react";
import { Space, Comment, Avatar, Popconfirm } from "antd";
import IconFont from "../../../IconFont";
import MyEditor from "../../../MyEditor";
import EmojiPopover from "../EmojiPopover";
import EmojiSelected from "../EmojiSelected";
import "./styles.scss";

const CommentItem = (props) => {
  const {
    id,
    author, // 作者
    content, // 内容
    datetime, // 日期
    showEditor = false, // 点击编辑时是否展示 editor
    emojis, // 表情列表
    onItemEdit, // 编辑 / 编辑器的提交 / 取消
    onItemDelete, // 删除
    onItemCheckEmoji, // 添加表情
    isReply // 是否为回复列
  } = props;

  return (
    <Comment
      data-id={id}
      className={`comment-item${isReply ? " comment-item-reply" : ""}`}
      author={author}
      datetime={datetime}
      avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
      content={
        <Space direction="vertical" size={14}>
          {showEditor ? (
            <div style={{ marginTop: 6 }}>
              <MyEditor
                onReplyText="提交"
                defaultValue={content}
                editorStyle={{ minHeight: 80 }}
                unAsync
                onCancel={() => onItemEdit && onItemEdit(id, { showEditor: false })}
                onReply={({ value }) => onItemEdit && onItemEdit(id, { value, showEditor: false })}
              />
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          )}
          {emojis && <EmojiSelected selected={emojis} />}
        </Space>
      }
      actions={[
        <Space key={`comment-list-reply-to-${id}`} className="action-list" size={10}>
          {/* 回复 */}
          <IconFont type="icon-dino-A3" />
          {/* 添加表情 */}
          <EmojiPopover
            selected={emojis}
            onClick={(value) => onItemCheckEmoji && onItemCheckEmoji(id, { value })}
          />
          {/* 编辑 */}
          <IconFont type="icon-dino-A1" onClick={() => onItemEdit && onItemEdit(id, { showEditor: true })} />
          {/* 删除 */}
          <Popconfirm
            title="确认删除该条评论吗？"
            onConfirm={() => onItemDelete && onItemDelete(id)}
            okText="确定"
            cancelText="取消"
          >
            <IconFont type="icon-dino-A2" />
          </Popconfirm>
        </Space>
      ]}
    >
      {/* 回复 */}
    </Comment>
  );
};

export default CommentItem;
