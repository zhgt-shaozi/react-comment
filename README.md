# react-comment

Created with CodeSandbox

使用 wangEditor + antd 实现一个纯静态的评论 + 提及的组件（仿语雀）

缺陷：

1. mention-link 不是 a 标签、且样式较难修改，缺少事件交互；
2. 链接、图片添加的 modal 没有修改样式、且缺少接口交互，图片上传的的服务器地址；
3. 将 editor 的 scroll 设置为 false 时，其使用场景只适合文档那种；
4. wangEditor 的编辑的内容和生成的内容不一致，会导致做 comment 时，无法完全采用 editor 中的样式，比如 code 标签，p 标签等，但是可以自定义样式；
5. 数据格式需要继续推敲，需要接口交互；
