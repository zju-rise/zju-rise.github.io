<!--
@file docs/maintenance.md
@purpose 面向实验室同学的新闻、论文、成员和研究方向维护指南。
@maintain 内容结构改变时同步修改这里的复制示例。
-->
# 日常内容维护

不需要修改页面组件。每次更新可以直接在 GitHub 打开相应 Markdown 文件，点击编辑，保存到一个分支并创建 Pull Request。检查通过后合并到 main，网站会自动更新。

建议使用 VS Code 或 GitHub 的编辑器；UTF-8 保存。文件名使用小写英文、数字和短横线。文件名同时也是记录 ID，成员资料发布后尽量不要改名，否则个人主页网址和论文引用也需要更新。

## 添加新闻

复制 `src/content/news/tbd.md`，命名如 `2026-11-01-paper-accepted.md`。`date` 决定从新到旧的排序，同一天多条新闻使用不同文件名即可。

```yaml
---
purpose: "RISE publication news."
maintain: "Edit the date and Markdown body."
sample: false
draft: false
placeholder: false
date: "2026-11-01"
title: "Congratulations on the new paper"
---

Congrats to **真实姓名** on their paper on agent security!
Read the [paper](https://实际论文地址).
```

日期必须为有效的 `YYYY-MM-DD`。页面显示英文月、日和年份，例如 `Nov 1, 2026`，维护时只需填写 `date`，无需手写显示日期。`title` 用于辅助阅读标识，正文直接展示，不必重复标题。新闻支持标准 Markdown 链接、加粗和分段，不要粘贴不可信 HTML 或脚本。

## 添加论文

在 `src/content/publications/` 新建文件，建议以论文简称命名。不要在首页、研究页和导师主页分别复制论文。

```yaml
---
purpose: "A publication record reused across the site."
maintain: "Update bibliographic fields and resource links here."
sample: false
draft: false
placeholder: false
title: "Your Actual Paper Title"
authors:
  - "First Author"
  - "Second Author"
year: 2026
venue: "ACM Conference on Computer and Communications Security"
venueShort: "CCS"
order: 1
featured: true
summary: "A short sentence for the homepage card."
directions:
  - "agent-security"
members:
  - "成员文件名，不带.md"
pdf: "https://实际论文地址"
code: "https://github.com/实际代码仓库"
project: "https://实际项目页"
---
```

- `year` 控制年份分组；同年按 `order` 从小到大排列。
- `venueShort` 控制会议筛选选项，同一会议请统一拼写。
- `featured: true` 自动显示在首页精选区；建议保持 4 篇。
- `directions` 可选 `agent-security`、`embodied-ai-security`，可同时设置。
- `members` 填本实验室成员文件 ID，而不是姓名。构建会检查是否存在，该成员的个人主页会自动列出论文。
- `pdf`、`code`、`project` 可省略。没有真实地址时删除该字段，切勿填 `#` 或示例地址。网站会将未提供的资源显示为不可用。
- BibTeX 自动生成，不需要手工创建 `.bib` 文件。
- 本地文件链接可写 `/files/papers/paper-name.pdf`，对应上传到 `public/files/papers/`。较大的论文建议使用公开论文地址，避免仓库持续膨胀。

页面筛选同时支持会议、年份、标题和作者。筛选结果保存在 URL 查询参数中，可以分享。

## 添加或调整成员

在 `src/content/people/` 新建如 `firstname-lastname.md`：

```yaml
---
purpose: "Member profile and team directory entry."
maintain: "Edit role, portrait and biography when the member's status changes."
sample: false
draft: false
placeholder: false
name: "Actual Name"
group: "phd"
order: 10
role: "PhD · Joined 2026"
interests: "Agent security and tool-use evaluation"
affiliation: "Zhejiang University"
photo: "/images/people/actual-name.jpg"
email: "真实邮箱"
---

A short biography in English. Describe research interests, current projects,
and academic background using verified information.
```

- `group`：`faculty`、`phd`、`masters`、`undergraduate`、`alumni`。
- 上传照片到 `public/images/people/`，建议竖幅、清晰的人像，统一裁切视觉；没有照片时省略 `photo`，显示首字母。
- `email`、`website`、`scholar`、`cv` 都是可选字段。没有地址就省略，不会生成死链接。
- 正文为个人主页 Biography，支持多段 Markdown。
- 毕业后保留文件 ID，修改 `group: alumni`、`role` 和 `affiliation`，论文关联不变。
- 导师额外的 `researchNotes` 和 `activities` 见 `tbd-faculty.md`。这些内容也在资料文件中维护，不在页面模板里。
- 新增导师会自动出现在 Faculty 区并生成个人主页；不需要改路由代码。

## 修改研究方向与公共文字

- 两个方向的简介、研究主题及右侧说明：`src/content/research/*.md`。
- 首页介绍、组内活动和 Join RISE 文字：`src/config/editorial.ts`。
- 实验室身份、邮箱和预览模式：`src/config/site.ts`。
- 字体、颜色、宽度、阴影：`src/styles/global.css` 顶部设计变量。

## 草稿、样例和正式发布

`draft: true` 会隐藏记录，并排除其关联用途。删成员前先清理其论文的 `members` 引用。`sample: true` 表示虚构设计示例，替换成经过确认的真实资料后再改为 false。

当前数据已清空为 TBD。`placeholder: true` 允许新闻日期和论文年份写 `TBD`，但不会将占位论文当作真实论文搜索或导出引用。填写真实记录时，请补齐日期/年份等字段并设 `placeholder: false`。

添加真实新闻或论文后，该栏目中剩余的占位记录会自动隐藏；成员则按各自分组隐藏占位记录。也可直接删除占位文件。导师占位资料在 `tbd-faculty.md`，其余成员分组各保留一份占位文件。

正式资料完善后：删除未使用的占位记录 → 填真实邮箱 → 保持 `sampleContent: false` → 设置 `contentPending: false` → 运行 `npm run verify`。待维护说明和 noindex 标签会随 contentPending 关闭而移除。

修改内容后本地执行：

```sh
npm run verify
npm run dev
```

构建报错会给出文件位置及字段。不要跳过校验强行发布。

## 修改网站样式或功能

与更新新闻、论文、成员使用同一套发布流程：修改文件 → 本地预览 → `npm run verify` → 提交到开发分支 → 创建 PR → 检查通过后合并 main → GitHub Actions 自动部署。

区别在于修改的位置和需要检查的范围：

| 修改内容 | 对应文件 | 重点检查 |
| --- | --- | --- |
| 新闻、论文、成员信息 | `src/content/` | 日期、作者、链接和内容正确性 |
| 邮箱、导航名称、公共介绍 | `src/config/` | 联系入口和导航目标 |
| 字体、间距、配色、手机布局 | `src/styles/global.css` | 桌面和手机上是否正常 |
| 页面布局和交互 | `src/pages/`、`src/components/`、`src/scripts/` | 受影响页面、键盘操作和功能行为 |

简单内容维护可以直接用 GitHub 网页编辑。布局或功能修改建议先在本地开发，运行 `npm run dev` 查看效果，确认后再提交；不要直接编辑 `dist/` 或线上生成的 HTML，也不需要手工重新上传网站。

日后让 Codex 修改时，说明要改的位置和效果即可。通常不必先改 Figma；涉及较大设计调整时可以先确认设计再实现。以仓库中实际运行的代码为网站版本依据，Figma 作为视觉参考。
