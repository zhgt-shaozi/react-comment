import React, { useState, useEffect } from "react";
import { Space, Avatar, Popconfirm } from "antd";
import { Comment } from "@ant-design/compatible"; // antd v4 -> antd v5 的兼容包（v5 中移除了 Comment 组件）
import { CaretRightOutlined } from "@ant-design/icons";
import IconFont from "../../../IconFont";
import MyEditor from "../../../MyEditor";
import EmojiPopover from "../EmojiPopover";
import EmojiTag from "../EmojiTag";
import "./styles.scss";

const CommentItem = (props) => {
  const {
    id,
    author,
    content,
    datetime,
    showEditor = false,
    showReplyEditor = false,
    emojis,
    parentId,
    commenter,
    isDelete = false,

    onItemEdit, // 编辑 / 编辑器的提交 / 取消 操作
    onItemDelete, // 删除操作
    onItemCheckEmoji, // 添加表情操作
    onItemReply // 回复 编辑器的回复 / 取消操作
  } = props;

  return !isDelete ? (
    <Comment
      data-id={id}
      className={`comment-item${parentId ? " comment-item-reply" : ""}`}
      author={
        <Space>
          {author}
          {commenter && (
            <>
              <CaretRightOutlined />
              {commenter}
            </>
          )}
        </Space>
      }
      datetime={datetime}
      avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
      content={
        <Space direction="vertical" size={14}>
          {showEditor ? (
            <div style={{ marginTop: 6 }}>
              <MyEditor
                onReplyText="提交"
                defaultValue={content}
                editorStyle={{ minHeight: 100 }}
                unAsync
                onCancel={() => onItemEdit && onItemEdit(id, { showEditor: false })}
                onReply={({ value }) => onItemEdit && onItemEdit(id, { value, showEditor: false })}
              />
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          )}
          {emojis && <EmojiTag selected={emojis} />}
        </Space>
      }
      actions={[
        <Space key={`comment-list-reply-to-${id}`} className="action-list" size={10}>
          {/* 回复 */}
          <IconFont
            type="icon-dino-A3"
            onClick={() => onItemReply && onItemReply(id, { showReplyEditor: true })}
          />
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
      {showReplyEditor && (
        <MyEditor
          editorStyle={{ minHeight: 100 }}
          unAsync
          onCancel={() => onItemReply && onItemReply(id, { showReplyEditor: false })}
          onReply={({ value }) => onItemReply && onItemReply(id, { value })}
        />
      )}
    </Comment>
  ) : (
    <Comment
      data-id={id}
      className="comment-item"
      author={author}
      datetime={datetime}
      avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
      content={<div className="comment-delete">该评论已删除</div>}
    />
  );
};

export default CommentItem;
