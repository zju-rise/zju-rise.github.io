<!--
@file README.md
@purpose 项目入口：启动、目录说明、检查命令和部署概览。
@maintain 新维护者从这里开始；详细更新示例见 docs/maintenance.md。
-->
# RISE · Zhejiang University

以最终 Figma 为依据的全英文实验室静态网站。Astro + TypeScript + 原生 CSS，无数据库、服务端或运行时外部 API。

- 网站地址：<https://zju-rise.github.io/>
- 设计稿：<https://www.figma.com/design/aQPsLNTIrVbdtso7ReBbHy?node-id=57-199>
- 日常维护：[维护指南](docs/maintenance.md)
- 部署及交接：[部署指南](docs/deployment.md)

## 本地运行

需要 Node.js **22.23.4 或更高版本**（与 GitHub Actions 保持一致）以及 npm 10+。

```sh
node --version
npm ci
npm run dev
```

浏览器访问终端打印的本地地址。若使用 nvm，可先运行 `nvm install 22.23.4` 和 `nvm use 22.23.4`。开发依赖只在本地/Actions 构建时使用，线上仅有 HTML、CSS、少量 JavaScript 和图片。

```sh
npm run check    # Astro / TypeScript 检查
npm test         # 筛选与 BibTeX 行为测试
npm run build    # 输出静态文件到 dist/
npm run preview  # 预览生产构建
npm run verify   # 完整检查、测试、构建和本地链接/文件头检查
```

## 文件放在哪里

```text
src/
  config/             站点名称、邮箱、公共介绍
  content/            日常维护的 Markdown 内容（每条记录一个文件）
    news/             日期 + 新闻正文
    publications/     作者、会议、年份、链接、首页推荐和成员关联
    people/           成员身份、照片、个人简介
    research/         两个研究方向
  content.config.ts   内容结构及字段校验
  components/         公共页头、蓝色标题条、论文条目、成员卡片
  layouts/            HTML 骨架与 SEO 信息
  pages/              页面路由及静态 BibTeX 下载
  scripts/            仅论文筛选需要的浏览器脚本
  styles/             全站设计变量、页面布局、移动适配
  lib/                内容排序、跨文件引用检查、筛选纯函数
public/images/        线上使用的校徽和成员照片
scripts/              构建产物及手写文件说明检查
.github/workflows/    PR 检查、main 自动发布
```

所有手写源码使用 `@file`、`@purpose`、`@maintain` 文件头；内容记录使用 `purpose`、`maintain` 元数据；JSON 使用 `_file` 自说明对象。自动生成的 `package-lock.json` 必须保持 npm 原样，图片无法内嵌代码注释，来源统一记录在 `docs/assets.md`。

## 内容状态

当前是 **TBD 待维护状态**：所有虚构人物、新闻、论文、会议和导师经历均已删除。保留明确的 TBD 占位记录，使用 `placeholder: true` 标识；真实资料填写后改为 false。占位论文不生成 BibTeX、不进入搜索，新增真实内容后同栏目的占位条目自动隐藏。

收件邮箱尚未填写，Send Email 只打开带主题和正文模板的空收件人草稿，**不会自动发送邮件**。上线前在 `src/config/site.ts` 填写 `email`。

`sampleContent: false` 已启用，构建拒绝虚构样例。资料完善后设置 `contentPending: false`，移除待维护说明并允许搜索引擎索引；在此之前保持 true。

## 发布流程

推送到 `main` → 自动检查 → 构建 → GitHub Pages。PR 只检查，不部署。首次由仓库管理员启用 Settings → Pages → Source: GitHub Actions。无需添加个人 token 或部署密钥。
