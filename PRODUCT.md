<!--
@file PRODUCT.md
@purpose 固定实验室网站的用户、内容和托管约束。
@maintain 功能范围变化时更新，不将设计样例当作真实成果。
-->
# RISE 实验室网站

面向全球访问者的浙江大学 AI 安全实验室英文主页。RISE 为 Robotics / Intelligence / Security / Environment，研究方向为 Agent Security 和 Embodied AI Security。

访客需要了解研究方向、浏览新闻与论文、认识师生、查看个人主页并通过邮件联系。维护者需要不改页面代码即可更新新闻、论文和成员。

使用 GitHub Pages 根域名，无运行时服务器、数据库或自建登录后台。内容来自仓库 Markdown，由 GitHub Actions 检查并静态发布。实验室成员使用自己的 GitHub 账号维护。

当前设计预览包含明确标注的虚构资料；真实数据提供后再切换正式内容模式。
