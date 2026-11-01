<!--
@file docs/verification.md
@purpose 首次实现的验证范围、结果和上线前仍需补充的资料。
@maintain 实质性修改后重跑 npm run verify，并更新相关验证记录。
-->
# 验证记录 · 2026-11-01

- `npm run check`：Astro / TypeScript 无错误、警告或提示。
- `npm test`：6 项测试覆盖组合筛选、作者与会议搜索、大小写/重音/中文搜索、BibTeX 特殊字符处理。
- `npm run build`：静态输出，30 个 HTML 页面及 9 个 BibTeX 文件，不需要服务端运行时。
- 构建后检查：内部页面、图片、下载链接、锚点、唯一 HTML ID、英文语言声明、viewport 和源码自说明文件头。
- 浏览器：五类页面在 320、390、768、1280px 下访问正常，无横向溢出。桌面和 390px 截图已目视核对。
- 浏览器交互：会议 CCS + 年份 2026 + 作者 Haoran 的组合筛选得到 1 条，未匹配关键词显示无结果提示，清空恢复 9 篇论文。
- 正式内容开关负向检查：保留样例并将 sampleContent 改为 false 时，构建按预期拒绝，随后已恢复预览配置。
- 校徽：原始 PNG 与 Figma 资产 SHA-256 一致；本地文件引用无临时 Figma URL。
- `npm audit --omit=dev`：本次安装未报告生产依赖漏洞。

截图和浏览器追踪保存在本地 output/playwright、.playwright-cli，已加入忽略规则，不提交到仓库。

## 真实资料待补充

当前所有设计样例均带 sample 标记，网站页脚有说明并设置 noindex。需要实验室提供真实新闻、论文、成员、导师简历和照片后替换。Join RISE 尚无实际收件邮箱，按钮打开无收件人的邮件草稿，需补充 site.ts 的 email。

GitHub Actions 实际部署结果以仓库 Actions 和 Pages 的运行记录为准，本地构建成功不等于线上发布成功。
