import React, { useEffect, useState } from "react";
import { Space, List, Comment, Avatar, Popconfirm } from "antd";
import IconFont from "../IconFont";
import MyEditor from "../MyEditor";
import EmojiPopover from "./components/EmojiPopover";
import EmojiSelected from "./components/EmojiSelected";
import "./styles.scss";

export default function CommentList(props) {
  const { comments = [], onItemEdit, onItemDelete, onItemCheckEmoji } = props;
  console.log("comments: ", comments);

  return comments.length > 0 ? (
    <List
      className="comment-list"
      dataSource={comments}
      header={comments.length && `所有评论（${comments.length}）`}
      itemLayout="horizontal"
      renderItem={(item, index) => {
        // console.log("item: ", item); // comments 中的元数据
        const { id, author, content, datetime, showEditor = false, emojiAction } = item;

        return (
          <Comment
            author={author}
            datetime={datetime}
            className="comment-item"
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
                      onCancel={() => onItemEdit && onItemEdit(item, index, { showEditor: false })}
                      onReply={({ value }) =>
                        onItemEdit && onItemEdit(item, index, { value, showEditor: false })
                      }
                    />
                  </div>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                )}
                {emojiAction && <EmojiSelected selected={emojiAction} />}
              </Space>
            }
            actions={[
              <Space key={`comment-list-reply-to-${id}`} className="action-list" size={10}>
                {/* 回复 */}
                <IconFont type="icon-dino-A3" />
                {/* 添加表情 */}
                <EmojiPopover
                  selected={emojiAction}
                  onClick={(value) => onItemCheckEmoji && onItemCheckEmoji(item, index, { value })}
                />
                {/* 编辑 */}
                <IconFont
                  type="icon-dino-A1"
                  onClick={() => onItemEdit && onItemEdit(item, index, { showEditor: true })}
                />
                {/* 删除 */}
                <Popconfirm
                  title="确认删除该条评论吗？"
                  onConfirm={() => onItemDelete && onItemDelete(item, index)}
                  okText="确定"
                  cancelText="取消"
                >
                  <IconFont type="icon-dino-A2" />
                </Popconfirm>
              </Space>
            ]}
          />
        );
      }}
    />
  ) : null;
}
