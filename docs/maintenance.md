<!--
@file docs/maintenance.md
@purpose 面向初次维护者的逐步操作说明：图片、成员、新闻、论文、检查和发布。
@maintain 字段或发布流程改变后同步更新；示例须能直接对照实际目录操作。
-->
# 网站维护：从修改到上线

这份指南不要求你理解 Astro。日常维护主要是“放好图片、填写资料、检查、提交”四件事。

**你这次先看第 2、3 节就够了。以后添加新闻、论文时，再看第 5、6 节。**

## 1. 先理解三个位置

| 位置 | 用途 | 你需要做什么 |
| --- | --- | --- |
| `src/content/` | 存放新闻、论文和成员资料 | 新建或编辑 `.md` 文件 |
| `public/` | 存放图片、PDF 等文件 | 把文件真正放进这里 |
| `dist/` | 系统自动生成的网页 | 不要手动修改，它每次构建都会重建 |

`.md` 是普通文本文件，可以用 VS Code 打开。文件开头两行 `---` 之间是资料字段，第二个 `---` 之后是正文。

**在文件里写了图片地址，不代表图片已经上传。资料文件和图片文件都必须存在，发布时也必须一起提交。**

## 2. 这次照片报错为什么发生

你当前的照片实际位置是：

```text
public/
└── images/
    └── ZhiSijie.jpg
```

因此成员资料应写：

```yaml
photo: "/images/ZhiSijie.jpg"
```

之前写的是 `/images/people/ZhiSijie.jpg`，系统就会去找 `public/images/people/ZhiSijie.jpg`。但没有这层 `people` 文件夹，所以检查失败。

记住这条对应关系：**网站地址不写 public，硬盘位置要写 public。**

因此 `/public/images/ZhiSijie.jpg` 也不正确；不是把 public 补进地址，而是从硬盘位置中去掉 public。

| 文件在电脑里的位置 | `.md` 里应写的地址 |
| --- | --- |
| `public/images/ZhiSijie.jpg` | `/images/ZhiSijie.jpg` |
| `public/images/people/ZhiSijie.jpg` | `/images/people/ZhiSijie.jpg` |
| `public/files/cv.pdf` | `/files/cv.pdf` |

两种图片目录都支持，选一种并保持一致。现有照片放在 `public/images/`，可以继续沿用。文件名必须完全一致：`ZhiSijie.jpg`、`zhisijie.jpg`、`ZhiSijie.JPG` 是不同写法，部署到 GitHub 后区分大小写。

## 3. 一步一步添加成员（本地操作）

### 第一步：放照片

在项目里打开 `public/images/`，把照片复制进去。比如现在已有 `ZhiSijie.jpg`。

照片建议使用 JPG、PNG 或 WebP，尽量小于 1 MB。不要只把照片放在桌面、微信下载目录或 `src/content/` 中；这些位置不会自动成为网站公开图片。

如果暂时没有照片，可以删除资料中的整行 `photo: ...`。页面会自动显示姓名首字母，不会报缺图错误。

### 第二步：新建资料文件

打开 `src/content/people/`，新建一个 `.md` 文件。新文件建议使用小写英文和短横线，例如 `zhi-sijie.md`。

你现有的 `ZhiSijie.md` 也能读取，生成的个人主页是 `/people/zhisijie/`。发布后尽量不要改文件名，避免改变个人主页地址或论文关联。

下面是与你本次资料对应的完整内容：

```yaml
---
purpose: "Member profile and team directory entry."
maintain: "Edit role, portrait and biography when the member's status changes."
sample: false
draft: false
placeholder: false
name: "Zhi Sijie"
group: "masters"
order: 10
role: "MSc · Joined 2025"
interests: "Agent Security"
affiliation: "Zhejiang University"
photo: "/images/ZhiSijie.jpg"
email: "zsjcs@zju.edu.cn"
---

TBD
```

实际维护时按真实资料修改，不要把其他人的姓名、邮箱原样复制过去。

`TBD` 位于第二个 `---` 后，是个人主页的 Biography 正文。以后可以直接替换成英文介绍，例如研究兴趣、教育背景等。正文支持多段落，不需要写 HTML。

### 第三步：检查每个字段

| 字段 | 是什么 | 怎么填 |
| --- | --- | --- |
| `purpose`、`maintain` | 文件用途说明 | 可以保留复制来的说明 |
| `sample` | 是否虚构示例 | 真实资料填 `false` |
| `draft` | 是否暂不展示 | 展示填 `false`；先保存但不上站填 `true` |
| `placeholder` | 是否只是 TBD 占位 | 真实资料填 `false`；占位文件是 `true` |
| `name` | 页面上显示的姓名 | 填英文姓名 |
| `group` | 在成员页分到哪一栏 | 必须从下表的代码中选一个 |
| `order` | 栏目中的排序 | 数字越小越靠前，例如 10、20、30 |
| `role` | 姓名下显示的身份文字 | 与 group 保持一致，可包含入学年份 |
| `interests` | 研究兴趣 | 简短英文，如 `Agent Security` |
| `affiliation` | 所属学校或毕业去向 | 在读可填 `Zhejiang University` |
| `photo` | 照片地址 | 对照第 2 节的路径规则；没有就删这一行 |
| `email` | 联系邮箱 | 没有或不想公开就删这一行 |

成员分组只接受以下代码，不能直接写中文：

| 想显示在哪一栏 | group 的值 | role 的参考写法 |
| --- | --- | --- |
| 教师 | `faculty` | 按真实职称填写 |
| 博士生 | `phd` | `PhD · Joined 2026` |
| 硕士生 | `masters` | `MSc · Joined 2026` |
| 本科生 | `undergraduate` | `BSc · Class of 2027` |
| 校友 | `alumni` | 按真实学位、毕业年份填写 |

`group` 决定放在哪一栏，`role` 只是显示文字，系统不会自动把博士文字改成硕士。因此不要写成 `group: masters`、`role: PhD ...`。

`website`、`scholar`、`cv` 也是可选字段。没有真实链接就不写，不能填 `TBD`、`#` 或“真实邮箱”等说明文字代替合法地址。

### 第四步：在本地看效果

打开终端，依次运行（只复制命令，不要复制代码块的围栏）：

```sh
cd /Users/zanezhi/Desktop/Master/Project/rise
node --version
npm run verify
```

`node --version` 应为 22.23.4 或更高版本。你这次的报错显示已经是 22.23.4，版本没有问题。

如果换了电脑、还没有安装依赖，先运行一次 `npm ci`。日常改资料不需要每次重装依赖。

检查成功时，终端末尾会出现 `Verified ...`，并且没有红色错误。接着运行：

```sh
npm run dev
```

在浏览器打开终端打印的本地地址（通常是 `http://127.0.0.1:4321/`）：

1. 点击 **People**。
2. 在 **Master’s Students** 下检查姓名、照片、身份是否正确。
3. 点击姓名，检查个人主页和正文。
4. 浏览器缩窄后看照片和文字是否正常。

这时只有你电脑上的预览变了，线上还没有更新。结束预览可在运行命令的终端按 **Control + C**。

### 第五步：提交和上线

检查通过后，在项目目录运行：

```sh
git status
```

`??` 表示新文件还没被 Git 收录；`M` 表示已有文件改过。**图片前面出现 `??` 不代表已上传，它仍然只在本地。**

以这次成员为例，只提交相关文件：

```sh
git add public/images/ZhiSijie.jpg src/content/people/ZhiSijie.md
git commit -m "Add member profile and portrait"
git push origin HEAD:main
```

上面最后一条命令将“当前分支最新提交”推送到远程 `main`，适合你目前这份本地工作目录。若提示没有可提交内容，可能这些修改已提交；先看 `git status` 和 `git log -1`，不要反复创建空提交。若提示远程有新修改、无权限或冲突，先停止并把报错发给我，不要使用 `--force`。

这次如果已由 Codex 修复并发布，就不用再照抄上面命令重复提交。下次换成自己实际修改的文件名即可。

多人维护时更推荐：在开发分支提交 → 推送开发分支 → GitHub 创建 Pull Request（合并请求）→ 检查通过后合并 main。不要把别人的新修改覆盖掉。

最后打开：

- 构建记录：https://github.com/zju-rise/zju-rise.github.io/actions
- 网站：https://zju-rise.github.io/people/

找到你刚提交的记录，等 `verify`、`deploy` 都显示绿色成功，再刷新网站。**本地预览成功、git commit 成功，都不等于已经发布；还要推送并等自动部署完成。**

## 4. 不用终端：直接在 GitHub 网页维护

1. 打开仓库 https://github.com/zju-rise/zju-rise.github.io ，确认正在编辑 `main` 或自己的维护分支。
2. 先打开 `public/images/`，点 **Add file → Upload files**，上传照片并保存提交。记住完整文件名。
3. 再打开 `src/content/people/`，点 **Add file → Create new file**，填写文件名如 `another-member.md`。
4. 按第 3 节的成员模板填写，把 photo 改为刚上传照片的地址；保存提交。
5. 如果选择新建分支，创建 Pull Request，检查通过后合并到 main。
6. 到 Actions 等待最新部署成功，再打开网站查看。

先上传图片再提交资料，可以避免资料先上线、图片还没上传导致检查失败。即使中途某次检查失败，线上会继续保留上一次成功的版本；补齐文件后再提交即可。

## 5. 添加新闻

1. 在 `src/content/news/` 新建如 `2026-11-01-paper-accepted.md`。
2. 复制下面内容，填写真实日期、标题和正文。
3. 保存，运行 `npm run verify`，确认后按第 3 节提交、发布。

```yaml
---
purpose: "RISE news entry."
maintain: "Update the date and the English news body below."
sample: false
draft: false
placeholder: false
date: "2026-11-01"
title: "News title"
---

Write the actual news here in English.
```

- `date` 必须是 `YYYY-MM-DD`，例如 `2026-11-01`，不能写“11月1日”。网页会自动显示为 `Nov 1, 2026`。
- 新闻正文写在第二个 `---` 后面。`title` 是辅助标识，网页主要展示正文。
- 日期决定从新到旧排序；同一天有两条消息时使用不同文件名。
- Markdown 链接写法是 `[要显示的文字](https://实际地址)`；没有链接可以直接写普通文字。
- 不需要再去改首页代码，新文件会自动显示。

## 6. 添加论文

1. 在 `src/content/publications/` 新建如 `your-paper-name.md`。
2. 填写标题、作者、年份、会议等资料。英文标题包含冒号时必须放在引号里。
3. 给对应成员填好 `members`，确认链接真实有效。
4. 本地检查、预览，然后提交发布。

```yaml
---
purpose: "Publication record shared by the website pages."
maintain: "Edit authors, venue, year and resource links here."
sample: false
draft: false
placeholder: false
title: "Your Actual Paper Title"
authors:
  - "First Author"
  - "Second Author"
year: 2026
venue: "Full Conference Name"
venueShort: "Conference Abbreviation"
order: 1
featured: true
summary: "A short English description for the homepage card."
directions:
  - "agent-security"
members:
  - "zhisijie"
---
```

这只是格式模板，作者、会议等必须换成真实资料再发布。

| 字段 | 作用 |
| --- | --- |
| `authors` | 按论文原始顺序列出全部作者，每个作者单独一行 |
| `year` | 数字年份，控制年份分组 |
| `venue` | 会议或期刊全名 |
| `venueShort` | 筛选栏中的简称，同一会议统一拼写 |
| `order` | 同一年内数字越小越靠前 |
| `featured` | `true` 显示在首页精选，`false` 仅在论文页等位置显示 |
| `summary` | 首页论文卡片的简短说明 |
| `directions` | `agent-security` 或 `embodied-ai-security`，可以同时填两个 |
| `members` | 本实验室作者的资料 ID；不是显示姓名，不含 `.md` |

成员 ID 可从个人主页地址确认：`/people/zhisijie/` 对应 `zhisijie`。今后成员文件统一用小写文件名，则文件名去掉 `.md` 就是 ID。还没添加成员资料时，可以先用 `members: []`；不要引用一个不存在的成员。

如果有 PDF、代码或项目页，在第二个 `---` **之前**增加需要的字段：

```yaml
pdf: "https://实际论文地址"
code: "https://github.com/实际代码仓库"
project: "https://实际项目页"
```

没有哪项就省略哪一整行。请勿把上面的“实际地址”当作可用链接原样发布。BibTeX 下载由网站自动生成，不需要你自己写。

若使用本地 PDF，先放到例如 `public/files/papers/paper.pdf`，再写 `pdf: "/files/papers/paper.pdf"`。与照片一样，路径去掉 public，实际文件仍必须放在 public 里。

## 7. 哪些文字在哪里改

| 想修改什么 | 打开哪里 |
| --- | --- |
| 新闻内容和日期 | `src/content/news/` 的对应文件 |
| 论文、作者、会议、资源链接 | `src/content/publications/` 的对应文件 |
| 姓名、身份、照片、个人简介 | `src/content/people/` 的对应文件 |
| 两个方向的详细研究介绍 | `src/content/research/` |
| 首页介绍、组内活动、Join RISE 文字 | `src/config/editorial.ts` |
| 实验室名称、联系方式 | `src/config/site.ts` |
| 字体、间距、颜色、手机布局 | `src/styles/global.css` |

配置文件里的文字放在引号内；改文案时保留周围的引号、逗号和括号。不确定时可以先把想替换的文案发给 Codex，不必自己改代码结构。

## 8. TBD 占位文件怎么处理

- 占位文件有 `placeholder: true`，真实资料要改为 `false`。
- 占位新闻日期和论文年份可以为 `TBD`，真实内容必须填写合法日期和数字年份。
- 新增真实新闻/论文后，对应栏目的占位记录自动隐藏；新增真实硕士成员后，硕士栏的 TBD 自动隐藏，其他栏不受影响。
- 可以继续保留占位文件，也可以在已有真实资料后删除它。
- `draft: true` 表示先保存但不展示。删除成员前，先检查论文里是否引用了该成员 ID。
- 导师的研究方向说明 `researchNotes`、教学/服务 `activities` 见 `tbd-faculty.md`。填写真实导师时按相同结构编辑。

全站资料准备好后，再把 `src/config/site.ts` 的 `contentPending` 改为 `false`，移除“内容待维护”提示并允许搜索引擎索引。在此之前保持 true。`sampleContent` 继续保持 false。

## 9. 遇到报错怎么判断

| 看到什么 | 是什么意思 | 下一步 |
| --- | --- | --- |
| 找不到图片、`ENOENT` | 引用地址没有对应文件 | 对照第 2 节检查目录、文件名、大小写 |
| `InvalidContentEntryDataError` | 资料字段格式不符合要求 | 找报错中的文件名，检查日期、year、group、邮箱等字段 |
| `missing member` | 论文引用的成员 ID 不存在 | 改为已有成员 ID，或先填 `members: []` |
| 页面仍显示 TBD | 新资料仍被当作占位或草稿 | 检查 placeholder 和 draft 是否都为 false |
| 本地有照片，线上没有 | 图片可能没提交或没部署 | 看 git status，再检查 Actions 是否成功 |
| `Nothing to commit` | 没有新的可提交修改 | 看 git status 和最近提交，不是网站构建报错 |
| 推送提示 `rejected` | 远程比本地新，或权限/分支限制 | 不要 force push，先把完整提示发给维护者或 Codex |

错误中出现 `dist/...` 只是告诉你“生成的哪个页面发现问题”，不是让你修改 dist 文件。

## 10. 改布局与改内容的流程有什么区别

发布流程相同：**修改 → 本地预览 → 检查 → 提交 → 推送/合并 main → 自动部署**。

内容修改主要编辑 Markdown；布局和功能需要编辑组件、页面或 CSS，并多检查桌面、手机和相关交互。无需手动上传生成网页，也不必每次先改 Figma。
