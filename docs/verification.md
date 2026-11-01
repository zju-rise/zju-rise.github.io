<!--
@file docs/verification.md
@purpose 当前 TBD 内容版本的验证范围和上线前待补充的资料。
@maintain 实质性修改后重跑 npm run verify，并更新相关验证记录。
-->
# 验证记录 · 2026-11-01

当前版本已删除全部虚构新闻、论文、成员和导师经历，改为明确的 TBD 占位内容。RISE 名称、浙大身份、两个已确认的研究方向名称和页面结构保留。

- Astro / TypeScript 检查：无错误、警告或提示。
- 自动测试：7 项，覆盖组合筛选、作者/会议搜索、大小写和重音处理、中文搜索、BibTeX 转义，以及禁止为 TBD 论文生成引用。
- 静态构建：10 个 HTML 页面，无占位论文 BibTeX 文件；原虚构成员页面已从输出删除。
- 构建后检查：内部页面、图片、锚点、唯一 HTML ID、语言声明、viewport 和手写文件头。
- 内容检查：构建输出不再包含原虚构人名、论文标题、会议和祝贺新闻。
- TBD 新闻日期不生成无效 datetime；TBD 论文不进入筛选索引，暂无真实论文时筛选控件禁用。
- 填入真实内容后，新闻/论文栏目自动隐藏占位记录，成员按分组隐藏占位记录。
- 校徽继续使用已核对的官方资产，代码不引用临时 Figma URL。

截图和浏览器追踪在本地 output/playwright、.playwright-cli，已忽略，不提交仓库。

## 后续维护

所有占位文件有 placeholder: true。填齐真实信息后改为 false；新闻日期必须为 YYYY-MM-DD，论文年份必须为数字。修改说明见 maintenance.md。

sampleContent 已设为 false，构建拒绝虚构样例。contentPending 保持 true，网站有待维护说明及 noindex，资料完善后再关闭。Join RISE 收件邮箱仍需在 site.ts 中填写。

GitHub Actions 发布结果以仓库运行记录为准，本地构建成功不等于线上发布成功。
