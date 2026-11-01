<!--
@file docs/maintenance.md
@purpose 网站维护手册：内容字段、页面元素、GitHub 在线编辑、本地编辑、发布与排错。
@maintain 以实际 schema、页面和工作流为准；字段、目录、显示规则或发布方式变更后同步更新。
-->
# RISE 网站维护手册

本手册面向负责更新网站的老师、同学和后续维护者。日常更新无需掌握 Astro；通常只需编辑文字资料、上传文件，再提交发布。

网站使用 Astro 生成静态网页，托管在 GitHub Pages。没有数据库或独立管理后台，**GitHub 仓库就是内容维护入口**。新闻、论文、成员信息、页面布局都随代码一起保存版本历史，可以查看和恢复。

- [网站首页](https://zju-rise.github.io/)
- [GitHub 仓库](https://github.com/zju-rise/zju-rise.github.io)
- [自动检查与部署记录](https://github.com/zju-rise/zju-rise.github.io/actions)

## 阅读导航

| 想做什么 | 阅读位置 |
| --- | --- |
| 找到需要修改的文件 | [1. 修改位置速查](#1-修改位置速查) |
| 理解文件格式、图片地址和占位符 | [2. 内容文件的基本规则](#2-内容文件的基本规则) |
| 添加或修改新闻 | [3. 新闻](#3-新闻) |
| 添加或修改论文 | [4. 论文](#4-论文) |
| 添加成员、更新导师简介、处理毕业成员 | [5. 成员与导师](#5-成员与导师) |
| 修改研究方向 | [6. 研究方向](#6-研究方向) |
| 修改首页、导航、邮箱、颜色、间距、校徽等 | [7. 网站文字与界面元素](#7-网站文字与界面元素) |
| 直接在 GitHub 网页维护 | [8. GitHub 在线维护](#8-github-在线维护) |
| 在本地修改、预览并推送 | [9. 本地维护](#9-本地维护) |
| 判断是否上线、处理报错、恢复旧版本 | [10. 发布检查与常见问题](#10-发布检查与常见问题) |

## 1. 修改位置速查

以下路径均从仓库根目录开始，在 GitHub 文件列表和本地项目文件夹中含义相同。

| 内容或元素 | 修改文件 | 说明 |
| --- | --- | --- |
| 首页右侧实验室简介 | `src/config/editorial.ts` → `home.introduction` | 首页顶部介绍段落 |
| From the Group | 同上 → `home.seminar`、`home.readingGroup` | 两条活动说明 |
| Working Together | 同上 → `home.together` | 合作介绍 |
| Join RISE | 同上 → `home.join` | 招生/加入介绍 |
| Latest News | `src/content/news/*.md` | 每条新闻一个文件，按日期排序 |
| 论文及首页精选 | `src/content/publications/*.md` | `featured` 控制是否进入首页精选 |
| 成员姓名、身份、照片、个人主页链接 | `src/content/people/*.md` | 每位成员一个文件 |
| 导师简介 | `src/content/people/ZhaoBinbin.md` → `facultySummary` | People 页照片右侧的介绍 |
| Research 顶部总述 | `src/config/editorial.ts` → `research` | 两个方向上方的介绍 |
| 智能体安全 | `src/content/research/agent-security.md` | 介绍、研究主题及右侧说明 |
| 具身智能安全 | `src/content/research/embodied-ai-security.md` | 同上 |
| 实验室名称、展开词、导航、联系邮箱 | `src/config/site.ts` | 公共配置 |
| 校徽和成员照片 | `public/images/` | 引用方式见第 2 节 |
| PDF、CV 等下载文件 | `public/files/` | 可按需创建子目录 |
| 页头、校徽结构 | `src/components/Header.astro` | 包含部分固定文字 |
| 页脚文字 | `src/components/Footer.astro` | 包含固定地点、品牌和待维护提示 |
| 首页模块标题、排列、主标题和副标题 | `src/pages/index.astro` | 内容配置不包含这些固定标题 |
| Research 页结构 | `src/pages/research.astro` | 研究区块及关联论文 |
| Publications 页结构、筛选控件 | `src/pages/publications.astro` | 筛选逻辑在 `src/scripts/publication-filters.ts` |
| People 页结构 | `src/pages/people/index.astro` | 分组和导师概览布局 |
| 成员分组显示名称 | `src/lib/content.ts` → `groupLabels` | 如 Master’s Students |
| 保留的站内个人资料页 | `src/pages/people/[id].astro` | People 页默认不链接到这里 |
| 论文列表、论文卡片、成员卡片 | `src/components/PaperRow.astro`、`PaperCard.astro`、`MemberCard.astro` | 修改这些会影响多个页面 |
| 蓝色标题条 | `src/components/SectionBar.astro` | 全站共享组件 |
| 照片显示方式 | `src/components/Portrait.astro`、`src/styles/global.css` | 默认自动裁切适配 |
| 字体、颜色、间距、阴影、手机布局 | `src/styles/global.css` | 全站统一样式 |
| 浏览器标题、SEO 描述、图标 | `src/layouts/BaseLayout.astro`、`src/config/site.ts` | 部分标题含固定的 RISE/ZJU 字样 |
| 网站域名 | `astro.config.mjs` | 仅迁移域名时修改，另见部署指南 |
| 内容字段校验 | `src/content.config.ts` | 新增字段先在此定义，再接入页面 |
| 自动部署规则 | `.github/workflows/pages.yml` | 日常内容维护无需修改 |

`dist/` 是自动构建结果，**不要手工修改或上传**。发布时 GitHub Actions 会重新生成。

## 2. 内容文件的基本规则

### 2.1 Markdown 文件格式

新闻、论文、成员和研究方向使用 `.md` 文件。文件必须以 `.md` 结尾，并直接放在对应目录中；当前内容加载器不读取其中的子文件夹。

```yaml
---
purpose: "Description of this record."
maintain: "Instructions for future editors."
sample: false
draft: false
placeholder: false
# 在这里继续填写该类资料的字段。
---

这里是正文，支持 Markdown。
```

两行 `---` 之间是 YAML 字段；第二行 `---` 后是正文。不同栏目对正文的使用不同：新闻会展示正文；成员正文用于保留的站内个人资料页；论文和研究方向的主要页面目前使用字段，不展示其 Markdown 正文。

编辑规则：

- 使用英文半角冒号和引号，冒号后留一个空格。
- 缩进使用空格，不使用 Tab；列表下级通常缩进两个空格。
- 文本建议用双引号包住，尤其是包含冒号、`#` 等字符时。
- `true`、`false` 和数字不要加引号；新闻日期要加引号。
- 多段说明可写成 `- >-`，后续行缩进两格；具体见导师模板。
- 网页内容保持英文，维护说明可以用中文。

Markdown 常用写法：

```markdown
普通文字。

**加粗文字**

[链接文字](https://example.org/)

- 第一项
- 第二项
```

### 2.2 所有内容共用的状态字段

| 字段 | 含义与用法 |
| --- | --- |
| `purpose` | 本文件用途，必填，可保留模板说明 |
| `maintain` | 后续维护提示，必填 |
| `sample` | 是否虚构示例；真实资料填写 `false`。当前网站拒绝发布未隐藏的虚构示例 |
| `draft` | `true` 暂不展示；`false` 正常展示。草稿仍须符合字段格式 |
| `placeholder` | `true` 为 TBD 占位；录入真实资料后改为 `false` |

新增真实新闻后，占位新闻自动隐藏；新增真实论文后，占位论文自动隐藏；成员占位按分组隐藏，例如新增真实硕士生只会隐藏硕士栏的占位。占位文件可以保留备用，也可以在有真实内容后删除。

### 2.3 图片和下载文件的地址

文件放在 `public/` 下，网页引用时去掉 `public`，保留开头的 `/`：

| 仓库中的实际文件 | 内容字段中填写 |
| --- | --- |
| `public/images/ZhaoBinbin.jpg` | `/images/ZhaoBinbin.jpg` |
| `public/images/new-member.jpg` | `/images/new-member.jpg` |
| `public/files/papers/paper.pdf` | `/files/papers/paper.pdf` |

必须同时提交资料文件和它引用的图片/PDF。写入地址不会自动上传文件。不要使用电脑上的 `/Users/...`、桌面路径或 `/public/...` 作为网页地址。

文件名、扩展名和大小写必须完全一致，例如 `Photo.jpg` 与 `photo.JPG` 不相同。新增文件建议使用英文小写和短横线；已有文件不要随意改名。照片建议 JPG、PNG 或 WebP，压缩到约 1 MB 以内；替换照片后若画面裁切不理想，先调整原图留白。

### 2.4 文件名与资料 ID

文件名会生成内容 ID。小写文件名 `new-member.md` 的 ID 为 `new-member`，对应保留的站内地址 `/people/new-member/`。已有的 `ZhaoBinbin.md` 对应 `zhaobinbin`，`ZhiSijie.md` 对应 `zhisijie`。

论文的 `members` 填的是这个 ID，不能填显示姓名或带 `.md` 的文件名。发布后避免改成员文件名；如确需改名，必须同步更新所有论文的 `members` 引用。

## 3. 新闻

### 添加新闻

在 `src/content/news/` 新建文件，例如 `2026-11-01-news.md`。下面仅为格式示例，发布前替换成真实消息；尚未确认时保持 `draft: true`。

```yaml
---
purpose: "RISE news entry."
maintain: "Update the date, title, and English body."
sample: false
draft: true
placeholder: false
date: "2026-11-01"
title: "Paper acceptance announcement"
---

Congratulations to the authors on the acceptance of **Paper Title** at Conference Name!
```

确认消息后设置 `draft: false`，提交发布即可，无需修改首页代码。

| 字段/内容 | 页面效果 |
| --- | --- |
| `date` | `YYYY-MM-DD` 格式；页面自动显示为 `Nov 1, 2026`，并按日期从新到旧排列 |
| `title` | 辅助标识和无障碍描述，当前不作为独立的可见新闻标题展示 |
| 第二个 `---` 后的正文 | 首页实际展示的新闻内容，可放链接和加粗文字 |

修改已有新闻直接编辑原文件。删除某条新闻可删除文件，或设为 `draft: true`。当前首页显示所有可见新闻，没有自动截取前几条；需要限制数量时由开发维护者修改 `src/pages/index.astro` 的数据读取。

## 4. 论文

### 4.1 新增论文模板

在 `src/content/publications/` 新建小写英文文件，例如 `paper-short-name.md`。模板中的标题、作者、会议、描述都必须替换为真实信息。确认后把 `draft` 改为 `false`。

```yaml
---
purpose: "Publication record shared across the website."
maintain: "Update bibliographic details, links, and associations here."
sample: false
draft: true
placeholder: false
title: "Paper Title"
authors:
  - "First Author"
  - "Second Author"
year: 2026
venue: "Full Conference or Journal Name"
venueShort: "Venue Abbreviation"
order: 10
featured: true
summary: "A short English explanation of the actual contribution."
directions:
  - "agent-security"
members: []
---
```

### 4.2 字段说明

| 字段 | 填写方法与作用 |
| --- | --- |
| `title` | 论文完整标题 |
| `authors` | 全部作者，按论文原始顺序逐行填写 |
| `year` | 数字年份，如 `2026`；按年份从新到旧分组 |
| `venue` | 会议或期刊全名 |
| `venueShort` | 简称，自动进入 Conference 筛选项；同一会议统一拼写，避免出现两个选项 |
| `order` | 同一年内数字越小越靠前；相同值时按文件 ID 排序 |
| `featured` | `true` 进入首页 Selected Publications；`false` 不在首页精选展示 |
| `summary` | 首页精选卡片说明，必填 |
| `directions` | 至少一个：`agent-security`、`embodied-ai-security`，可同时填写两个 |
| `members` | 本组作者的成员 ID 列表；暂无关联时填 `[]` |
| `pdf`、`code`、`project` | 可选资源链接；没有就省略整行，不填空字符串、`TBD` 或 `#` |

关联两个研究方向和导师的写法（替换模板中的同名字段，不要重复添加）：

```yaml
directions:
  - "agent-security"
  - "embodied-ai-security"
members:
  - "zhaobinbin"
```

资源链接写在第二个 `---` 之前，例如：

```yaml
pdf: "/files/papers/paper.pdf"
code: "https://github.com/organization/project"
project: "https://example.org/project/"
```

以上均为格式示例，链接需换成真实地址。本地资源须先放入 `public/` 对应位置；外链使用 `https://`。

### 4.3 自动展示规则与维护边界

- Publications 页自动生成年份和会议筛选项，不需要手动增加年份或选项。
- 首页显示所有 `featured: true` 的可见论文；当前没有数量上限。保持适当数量可避免首页过长。
- Research 页按 `directions` 自动关联论文，**目前每个方向只显示排序后的第一篇**；想显示更多，修改 `src/pages/research.astro` 中关联论文后的 `.slice(0, 1)`。
- Research 页的 Explore related work 当前按关键词 `agent` 或 `embodied` 搜索，并非按 `directions` 精确筛选，因此结果可能与关联列表不同。
- 站内个人资料页按 `members` 关联论文；导师页最多展示前三篇，其他成员页展示全部关联论文。
- 真实论文的 BibTeX 自动生成。目前统一输出 `@inproceedings` 和 `booktitle`，并非完整的期刊引用格式；没有 DOI、卷期、页码等字段。期刊论文有严格引用要求时，应先扩展 `src/lib/filters.ts` 的导出逻辑及对应测试。
- 删除或隐藏论文后，它会从关联页面消失。删除成员或研究方向前，先检查是否仍有论文引用，否则构建会失败。

## 5. 成员与导师

### 5.1 新增普通成员

1. 将照片放入 `public/images/`。没有照片可先不填 `photo`。
2. 在 `src/content/people/` 新建 `.md` 文件，例如 `new-member.md`。
3. 按模板填写，确认后把 `draft` 改为 `false`。

```yaml
---
purpose: "Member profile and People-page entry."
maintain: "Update identity, portrait, interests, and personal website."
sample: false
draft: true
placeholder: false
name: "Member Name"
group: "masters"
order: 10
role: "MS · Joined 2026"
interests: "Agent Security"
affiliation: "Zhejiang University"
email: ""
website: ""
---

Write a verified English biography here if a retained internal profile is needed.
```

确认照片已上传后，在第二个 `---` 前添加实际路径，例如：

```yaml
photo: "/images/new-member.jpg"
```

### 5.2 字段与分组

| 字段 | 用途 |
| --- | --- |
| `name` | 英文姓名，按本人确认的写法填写 |
| `group` | 决定所在分组，必须使用下表代码 |
| `order` | 同组内数字越小越靠前；相同数字按姓名排序 |
| `role` | 姓名下方的显示文字，需手动与身份保持一致 |
| `interests` | 非校友成员卡片显示的研究方向 |
| `affiliation` | 所属单位；校友卡片在研究方向位置显示此字段，可填写毕业去向 |
| `photo` | 可选本地照片地址；没有就删除整行，页面显示姓名首字母 |
| `email` | 可选公开邮箱，允许省略或 `""`；有值时须为有效邮箱 |
| `website` | 可选个人主页完整 `http://` 或 `https://` URL，允许省略或 `""` |
| `scholar`、`cv` | 可选 Google Scholar/CV 链接，用于保留的站内个人资料页；没有则省略，地址为 HTTPS 或根路径 |
| `joined` | 可选数字年份，当前不会自动更新 `role`，日常不需要填写 |

| 页面分组 | `group` | `role` 示例 |
| --- | --- | --- |
| Faculty | `faculty` | 真实职称 |
| PhD Students | `phd` | `PhD · Joined 2026` |
| Master’s Students | `masters` | `MS · Joined 2026` |
| Undergraduate Students | `undergraduate` | `Undergraduate · Class of 2027` |
| Alumni | `alumni` | `MS · Graduated 2026` |

硕士使用 **MS**。`group` 和 `role` 是独立字段，改变分组不会自动改变身份文字。

People 页姓名和照片只跳转到 `website`；教师的 Personal homepage 也使用该字段。未填写 URL 时点击没有跳转，符合当前设计。站内 `/people/成员ID/` 资料页仍会生成，但 People 页不链接过去；`email`、`scholar`、`cv` 等联系信息主要展示在那里。

### 5.3 修改导师简介

现有导师资料在 `src/content/people/ZhaoBinbin.md`。普通成员字段同样适用，另有以下字段：

```yaml
facultySummary:
  - >-
    First paragraph of the verified faculty introduction.
  - >-
    Second paragraph covering education, research, or academic service.
```

`facultySummary` 每项显示为 People 页照片右侧的一段。新增段落时另起一行 `- >-`，后续文字缩进保持一致。`interests` 显示 Research directions。保持客观英文表述，沿用现有不使用人称代词的写法。

文件第二个 `---` 后的正文用于保留的站内个人资料页，修改正文不会自动改变 People 页简介；需要时同步维护两处。以下可选结构只用于站内资料页，不影响 People 页：

```yaml
researchNotes:
  - title: "Agent Security"
    text: "Verified description of this research direction."
    direction: "agent-security"
activities:
  - title: "Academic Service"
    text: "Verified service information."
```

`researchNotes.direction` 只接受两个既有研究方向 ID。没有这些扩展内容时不必填写。旧的 `editorial.facultyOverview` 仅作缺少简介时的回退；`facultyWelcome` 当前没有页面使用，日常修改导师无需编辑它。

### 5.4 毕业、离组、隐藏与删除

- **毕业转校友**：保留文件名，将 `group` 改为 `alumni`，更新 `role`、`affiliation`、`order` 和个人主页。
- **暂时隐藏**：设 `draft: true`。若有论文引用此成员，需先处理引用，否则验证会报找不到成员。
- **彻底删除**：删除资料文件前搜索论文中的成员 ID；解除引用后再删除。照片确认没有其他地方引用后可删除。
- **仅更新照片**：可替换同路径文件，无需改资料；若改文件名，要同步修改 `photo`。

## 6. 研究方向

两个既有文件分别为：

- `src/content/research/agent-security.md`
- `src/content/research/embodied-ai-security.md`

| 字段 | 对应页面位置 |
| --- | --- |
| `title` | 蓝色长条中的方向名称 |
| `order` | 方向排列顺序，数字小的在前 |
| `overview` | 左侧方向介绍 |
| `topics` | Research Topics 下的列表，每个 `-` 是一项 |
| `pipeline` | 右侧 Security across the system 卡片的第一段 |
| `perspective` | 同一卡片的第二段 |

编辑这些字段即可，不需要改页面。页面顶端总述在 `src/config/editorial.ts` 的 `research` 字段；Related Publications 由论文资料自动关联，不能直接在方向文件中填写。

不要仅通过新建文件增加第三个研究方向。当前论文、导师方向枚举及页面搜索逻辑都围绕两个方向，需要开发者一并修改 `src/content.config.ts`、相关类型与页面逻辑。既有文件名也是关联 ID，不应随意改名。

## 7. 网站文字与界面元素

### 7.1 首页文案、联系邮箱

打开 `src/config/editorial.ts`，按第 1 节对应关系修改文本。此文件是 TypeScript，不是 YAML：

```ts
introduction: 'New English introduction.',
```

保留引号、逗号、花括号。若英文包含单引号，例如 `group's`，在单引号字符串中写为 `group\'s`，或使用双引号包住整段。

首页 Send Email 和页脚 Contact 共用 `src/config/site.ts` 的 `email`，当前为 `binbinz@zju.edu.cn`。修改 `contactHref()` 中的 `subject`、`body` 可改变邮件主题及正文模板。按钮通过 `mailto:` 打开访客邮件客户端，**不会由网站自动发送邮件**；电脑未配置邮件客户端时可能没有预期反应。

导师资料中的 `email` 是另一个独立字段，如希望站内资料页也显示邮箱，需要另外填写；不会自动与公共邮箱同步。

### 7.2 导航、标题与页脚

- 导航名称及链接：修改 `src/config/site.ts` → `navigation`。默认黑色，当前页面蓝色的状态由页头和 CSS 自动处理。
- 添加导航并不会创建页面。新增页面还需在 `src/pages/` 新建对应 `.astro` 文件，并完成路由和样式。
- 首页固定主标题、副标题、Latest News、Selected Publications、From the Group 等标题：修改 `src/pages/index.astro`。
- Header 顶部说明、Footer 品牌/地点、浏览器页签标题等有固定文字；更换学校或品牌时需同步核对第 1 节列出的文件，不能只改 `site.name`。
- 修改现有路径可能破坏历史链接；只改显示名称时优先保留原路径。

### 7.3 字体、颜色、尺寸、卡片和布局

全站样式在 `src/styles/global.css`。优先修改 `:root` 中的统一变量：

| 设置 | 当前值/选择器 | 作用 |
| --- | --- | --- |
| 主色 | `--blue: #003f88` | 链接、当前导航、标题条和按钮 |
| 正文色 | `--ink` | 正文文字 |
| 默认导航色 | `--nav-ink` | 非当前页面导航 |
| 次要文字 | `--muted` | 日期、说明等 |
| 浅色卡片 | `--pale`、`--paper-blue` | 简介面板和论文卡片 |
| 分割线 | `--line` | 页头、页脚和列表边界 |
| 卡片阴影 | `--shadow` | 公共卡片的立体感 |
| 内容宽度 | `--content-width: 900px` | 居中区域最大宽度 |
| 字体 | `font-family: Arial, Helvetica, sans-serif` | 全站英文字体 |
| 基础字号/行距 | `font-size`、`line-height` | 正文阅读密度 |

导航间距在 `nav` 的 `gap`；新闻间距在 `.news-list`、`.news-item`；论文间距在 `.paper-list`、`.paper-row`；成员网格和照片在 `.member-grid`、`.portrait` 等规则中。手机样式位于文件后段的响应式规则，修改桌面设置后也要检查那里是否有覆盖值。

修改卡片的结构和字段排列，要编辑对应 `.astro` 组件；仅调整颜色、圆角、阴影或间距通常只需改 CSS。新增模块或交互属于功能修改，除预览外应运行完整验证，必要时补充相关测试。

### 7.4 校徽、浏览器图标与搜索引擎设置

校徽位于 `public/images/zju-official.png`，页头引用在 `Header.astro`；浏览器图标在 `BaseLayout.astro`。现有页头使用针对原图的裁切尺寸，替换为不同尺寸的图时还需检查 `.university-emblem` 样式，避免被裁掉。

`site.description` 是默认网页描述。`contentPending: true` 会显示页脚待维护提示，并通过 robots 元信息要求搜索引擎不索引；公开资料准备完毕后改为 `false`。`sampleContent` 继续保持 `false`。允许索引不代表立即被搜索引擎收录。

### 7.5 源码文件说明规范

新增手写源码保留 `@file`、`@purpose`、`@maintain` 文件头；内容记录使用 `purpose`、`maintain`。不要删除已有说明。二进制图片的来源记录在 `docs/assets.md`，无需修改图片本身添加注释。`package-lock.json` 由 npm 管理，不手工编辑。完整验证会检查相关文件头。

## 8. GitHub 在线维护

适合少量文字修改、添加新闻/论文、上传成员照片，无需安装 Node.js 或运行终端。需要对仓库有写权限；没有权限时联系仓库管理员添加协作者或组织团队权限，不使用共享账号密码。

### 8.1 修改现有文字文件

1. 打开[仓库](https://github.com/zju-rise/zju-rise.github.io)，确认分支为 `main`。
2. 按第 1 节路径打开目标文件，点击编辑按钮（铅笔）。
3. 修改文字，保留 YAML/TypeScript 的原有格式。GitHub Preview 只能预览部分 Markdown，不能代替完整网站预览。
4. 点击提交更改，填写简短说明，例如 `Update homepage introduction`。
5. 单人小改且有权限时可直接提交到 `main`；多人协作推荐选择新分支，并创建 Pull Request（简称 PR，合并请求）。
6. 使用 PR 时，等待 `verify` 检查通过，再按团队规则审核并合并到 `main`。**仅保存分支或创建 PR 不会更新正式网站。**
7. 到 Actions 查看合并后/直接提交到 `main` 的部署，按第 10 节确认上线。

### 8.2 新增资料与上传图片/PDF

在对应文件夹使用 **Add file → Create new file**，输入带 `.md` 的文件名，复制本手册模板并填写真实资料。图片和 PDF 使用 **Add file → Upload files**；新建下载目录时可在本地创建后上传，也可直接使用仓库已有目录。

**推荐把一组资料和资源提交到同一个新分支：**

1. 在仓库分支选择器中，从最新 `main` 创建维护分支，例如 `content/add-member`。
2. 确认仍在该分支，上传照片到 `public/images/` 并提交。
3. 在同一分支新增或修改成员资料，填写与照片匹配的地址并提交。
4. 创建一个 PR，检查照片和资料都包含在更改列表中。
5. 等完整检查通过后合并。这样正式网站不会出现“资料已发布、照片未上传”的中间状态。

若选择直接修改 `main`，先上传资源，再提交引用它的资料文件。每次 `main` 提交都会触发部署；等待最后一次成功即可。

### 8.3 删除、改名与恢复

在文件页面的操作菜单中可删除文件；编辑文件时可修改文件名。删除/改名之前检查所有引用，尤其是成员 ID 和图片路径。恢复方式见第 10 节。

网页在线编辑完成后，如果还要用本地电脑继续维护，务必先同步远程最新内容，不能直接在旧副本上继续提交。

## 9. 本地维护

### 9.1 首次准备

需要 Git、Node.js **22.23.4 或满足当前 Astro 要求的更新版本**、npm **10+**，以及可编辑文本的工具，如 VS Code。GitHub Actions 当前使用 Node.js 22.23.4，本地使用相同版本最便于排查差异。

新维护者先克隆仓库，命令会在终端当前目录创建 `zju-rise.github.io` 文件夹：

```sh
git clone https://github.com/zju-rise/zju-rise.github.io.git
cd zju-rise.github.io
node --version
npm --version
npm ci
```

已有项目副本的维护者，在编辑器打开自己的项目文件夹，使用集成终端即可；不要重复克隆覆盖已有项目。后续命令都在含 `package.json` 的仓库根目录执行。`npm ci` 首次运行或依赖锁文件更新后运行，日常改文案不需要重复安装。

如果 GitHub 推送要求登录，按 Git 或 GitHub 的凭据提示完成认证；账号密码不能直接当 HTTPS Git 密码使用。不要将 token 写入项目文件或提交到仓库。

### 9.2 每次开始前同步

先查看当前分支和未提交修改：

```sh
git status
git branch --show-current
```

`M` 表示已修改，`??` 表示新文件尚未加入 Git。**只有工作区干净时才执行下面的分支切换和合并步骤**；有未提交工作时先保存为合适的提交，或交由熟悉 Git 的维护者处理，不要丢弃文件。

推荐从最新 `main` 创建每次更新使用的分支：

```sh
git switch main
git pull --ff-only origin main
git switch -c content/update-2026-11-02
```

最后一行分支名是示例，每次换成未使用的新名字。如果已有副本没有本地 `main`，先运行以下命令建立，再创建维护分支：

```sh
git fetch origin
git switch -c main --track origin/main
```

如果继续使用现有 `codex/implement-lab-site` 分支，不必切换；在工作区干净时先同步远程 `main`：

```sh
git fetch origin
git merge origin/main
```

出现冲突时暂停编辑和推送，确认并保留双方需要的内容后再继续。不要用强制推送覆盖远程修改。如果 `git pull --ff-only` 提示不能快进，说明存在分叉，需要先检查提交历史，不能反复执行相同命令解决。

### 9.3 编辑与预览

根据第 1～7 节修改资料、上传本地图片或调整样式，然后启动开发预览：

```sh
npm run dev
```

浏览器访问终端打印的地址，通常是 `http://127.0.0.1:4321/`；端口被占用时以实际输出为准。保存文件后通常会自动刷新。按 **Control + C** 停止预览，或另开一个项目终端执行检查。

发布前执行：

```sh
npm run verify
```

它会依次进行类型/内容检查、测试、构建、生成页面的本地链接与资源检查、文件说明检查。任一步报错都应先修复，**不要在验证失败时继续发布**。可选运行 `npm run preview` 查看刚生成的生产构建效果。

人工检查至少包括：改动文字是否正确、照片和资源能否打开、个人主页是否跳转正确、手机窄屏是否正常。若改了论文，检查年份/会议筛选、搜索及资源链接。验证脚本不逐一访问外部网站，外链仍需手动打开确认。

### 9.4 提交修改

查看差异，确认没有无关文件：

```sh
git status
git diff
```

将实际需要的文件加入暂存区。下面演示仅修改首页文案的情况：

```sh
git add src/config/editorial.ts
git diff --cached
git commit -m "Update homepage content"
```

新增成员时需要同时加入照片和资料。`git add .` 会收录所有未忽略的改动和删除；只有确认全部都属于本次更新时才使用。不要添加 `node_modules/`、`dist/`、私人文件或凭据。

### 9.5 选择发布方式

**方式 A：多人维护，推荐使用 PR。**

假设当前分支为 `content/update-2026-11-02`：

```sh
git push -u origin content/update-2026-11-02
```

在 GitHub 仓库打开 Pull requests，创建以 `main` 为目标分支的 PR，等待检查及审核，然后合并。PR 检查通过并不表示已发布；合并 `main` 后还有一次部署。

**方式 B：有直接写入 main 权限时，从当前分支发布。**

适用于现有 `codex/implement-lab-site` 等分支。在同步远程、验证通过并提交后：

```sh
git push origin HEAD:main
```

这表示将**当前分支的所有待推送提交**更新到远程 `main`，不只发送最后一个提交。操作前确认提交历史中没有无关工作。它不会把本地分支改名为 `main`，也不保证以后只写 `git push` 就会发布。

如果在本地 `main` 上维护，且该分支跟踪 `origin/main`，也可使用 `git push origin main`。若 main 受保护、要求 PR，使用方式 A。

常用直接发布顺序如下，确认每一步成功后再执行下一步：

```sh
npm run verify
git status
git diff
git add src/config/editorial.ts
git diff --cached
git commit -m "Update homepage content"
git push origin HEAD:main
```

上例只收录首页文案文件；修改其他内容时，将 `git add` 后的路径替换为实际文件。不要原样照抄而漏掉照片、论文或成员文件。

### 9.6 下次继续维护

每次开始仍回到 9.2 同步。尤其是在 GitHub 网页编辑、别人提交、或 PR 合并后，本地副本不会自动同步。新建维护分支时从最新 `main` 开始，不复用已经合并且含旧提交的分支。

## 10. 发布检查与常见问题

### 10.1 如何确认正式网站已更新

完整流程是：

**修改 → 提交 → 远程 main 更新 → Actions verify → Actions deploy → 查看正式网站。**

`git commit` 仅保存本地历史；推送开发分支仅保存到远程分支；两者都不等于正式发布。

1. 打开[Actions](https://github.com/zju-rise/zju-rise.github.io/actions)，找到对应 `main` 最新提交的工作流。
2. 核对提交说明或短 SHA 是否与你的更新一致。本地可用 `git log -1 --oneline` 查看。
3. 等 `verify` 和 `deploy` 都显示成功。通常需要数分钟，不能只根据 `git push` 成功判断上线。
4. 打开正式网站核对实际内容。若显示旧版，Mac 按 **⌘ + Shift + R**、Windows 按 **Ctrl + F5**，或使用无痕窗口。
5. 若仍旧，确认访问的是 `https://zju-rise.github.io/`，不是另一个分支预览、本地旧进程或其他网站地址。

无需每次重新设置 Pages、手动上传 `dist` 或登录服务器。首次 Pages 设置、权限与域名迁移详见 [deployment.md](deployment.md)。

### 10.2 常见问题速查

| 现象/提示 | 检查与处理 |
| --- | --- |
| `InvalidContentEntryDataError` | 先看报错中的文件路径和字段；检查 YAML 格式、group、日期、年份、邮箱及 URL |
| `email: Invalid email address` | 没有邮箱填 `email: ""` 或省略；有邮箱填合法地址，不能填 TBD |
| 找不到图片、`ENOENT`、`broken local reference` | 确认资源已放入 public、引用不包含 public、路径及大小写完全一致，并已提交资源文件 |
| 新成员/新闻不出现 | 检查扩展名是否 `.md`、是否在正确目录、`draft` 是否 false、是否仍为 placeholder；不要放入内容目录的子文件夹 |
| `missing member` / `missing direction` | 论文引用了不存在或被隐藏的成员/方向；修正 ID 或先解除对应引用 |
| 修改成员正文，People 页没变化 | 正文用于站内资料页；成员卡片改字段，导师右侧改 facultySummary |
| 没有个人主页跳转 | website 未填写时正常；若需要跳转，填写完整 http/https URL |
| 新论文未出现在首页 | 确认 featured 为 true 且非草稿；真实论文存在后占位论文会隐藏 |
| 会议筛选出现两个近似选项 | 同一会议的 venueShort 拼写不统一，统一所有相关记录 |
| Node.js 不受支持 | 查看 node --version，切换到与工作流一致的受支持版本；不要强行跳过版本要求 |
| `branch: command not found` | 正确命令是 git branch 或 git branch --show-current |
| `nothing to commit` | 没有新的已跟踪改动，可能已提交；查看 git status 和 git log -1，不必创建空提交 |
| push 提示无 upstream | 使用手册中的明确推送命令；不要假定当前开发分支的 git push 会更新 main |
| push 被拒绝，提示 fetch first / non-fast-forward | 远程有新提交；先同步并处理差异，重新验证再推送，不使用 --force |
| push 因保护规则或权限被拒绝 | 检查登录账号与仓库权限，或改走 PR；不要绕过团队分支保护 |
| Actions 红色失败 | 打开最新工作流，展开第一个失败步骤查看具体日志；修复源文件后重新提交，重跑相同失败代码通常无效 |
| verify 成功但 deploy 失败 | 查看 Pages Source 是否为 GitHub Actions、工作流部署权限及环境限制；联系管理员处理 |
| deploy 成功但页面似乎没变 | 对照提交 SHA、访问地址和部署时间，再强制刷新；检查是否修改了真正被页面使用的字段 |
| GitHub 在线修改后本地推送冲突 | 本地尚未同步远程，按 9.2 拉取/合并后处理冲突，再验证发布 |

报错中出现 `dist/...` 是指出生成后的哪个页面发现问题。应修复 `src/` 或 `public/` 中的源文件，而不是编辑 `dist/`。

### 10.3 恢复误改内容

**少量文字误改：** 打开 GitHub 文件的 History，查看正确的历史版本，复制需要恢复的内容到当前文件，再提交正常更新。本地也可用编辑器对比历史。优先恢复需要的段落，保留别人之后的修改。

**完整撤销一个已提交更新：** 由熟悉 Git 的维护者检查提交范围后，在干净、已同步的维护分支运行 `git revert 提交SHA`，再验证并通过 PR 或推送 main 发布。这里的 `提交SHA` 必须替换为真实值；合并提交的撤销需要额外处理，不直接套用此命令。

不要使用 `git reset --hard` 或 `git push --force` 来恢复网站；这会丢弃本地工作或覆盖共享历史。撤销只是生成恢复提交，仍需完成部署才能改变线上内容。

### 10.4 交接检查单

- 新维护者能访问仓库，并有适当编辑权限。
- 明确日常使用 GitHub 在线编辑还是本地维护，以及团队是否要求 PR。
- 本地环境可以运行 `npm ci`、`npm run verify` 和预览。
- 知道资源放在 public、内容放在 src/content，知道不要修改 dist。
- 能找到首页文案、导师简介、邮箱、导航和样式配置。
- 知道如何查看 Actions、核对部署提交和恢复误改。
- 修改字段、显示逻辑或部署方式时同步更新本手册。
