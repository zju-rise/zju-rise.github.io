<!--
@file docs/deployment.md
@purpose GitHub Pages 首次配置、自动发布、权限与故障排查。
@maintain 更换仓库、域名、Node 版本或发布分支时更新本页。
-->
# GitHub Pages 部署

目标仓库：`zju-rise/zju-rise.github.io`。目标地址：`https://zju-rise.github.io/`，不是带仓库子路径的项目站。配置已设置根路径，因此不要额外添加 `/zju-rise.github.io/` base。

## 管理员首次操作

1. 将项目提交并推送到仓库的 `main` 分支；设置其为默认分支。
2. 打开仓库 **Settings → Pages → Build and deployment → Source → GitHub Actions**。
3. 如组织禁用了 Actions，在 **Settings → Actions → General** 允许工作流及所用的 GitHub 官方 Actions。无需开放全部第三方动作。
4. 在 Actions 中找到 **Verify and deploy website**，可从 main 手动点击 Run workflow；以后推送 main 自动执行。
5. 两个 job `verify`、`deploy` 均成功后访问网站。首次可能需要短暂等待 CDN 更新。

不需要购买服务器、配置数据库或添加 Personal Access Token。部署使用工作流运行时提供的短期 GitHub 身份。PR 仅有读取仓库权限，不会运行部署。

本地 Node.js 版本至少为 22.23.4。Actions 固定同一版本，npm ci 使用已提交的 package-lock.json，确保接手者和 CI 安装一致。

## 推荐维护方式

成员在开发分支编辑 → 创建 PR → 等待 verify 通过 → 合并 main → 自动部署。建议组织长期维护者有两个 Owner，其他成员使用各自账号，不共享密码。可为 main 启用 PR 审核及 verify 检查要求。

日常编辑、同步、提交和发布的完整步骤见[维护手册](maintenance.md#9-本地维护)。有直接写入 main 权限时，已提交的当前分支可通过以下命令发布：

```sh
git push origin HEAD:main
```

执行前先同步远程 main、确认当前分支的所有待推送提交都属于要发布的内容，并完成验证。该命令不会将本地分支改名。若 main 要求 PR 审核，则推送维护分支并创建 PR，不要强制推送覆盖其他人的修改。

## 检查内容

`npm run verify` 依次完成：TypeScript/Astro 检查、筛选与 BibTeX 测试、静态构建、所有内部页面/图片/下载链接和锚点检查、手写源码文件头检查。任何一步失败都会阻止部署。

该流程不批量请求外部论文网站，避免外网短暂故障阻塞更新；新增外链请维护者自行确认。

## 常见问题

- **deploy 提示 Pages 未启用或权限错误**：核对 Source 是否 GitHub Actions，以及组织策略是否允许 Pages。不要把 token 写进代码。
- **安装时报 Node 版本错误**：运行 `node --version`；使用 README 指定版本，不用 --force 跳过 engines。
- **样例内容检查失败**：替换真实内容或标成草稿，见维护指南。
- **找不到成员或研究方向**：论文 frontmatter 引用了不存在的文件 ID，按报错修正。
- **链接检查失败**：检查 public 下是否上传文件，注意 Linux 文件名大小写敏感。
- **线上仍是旧版本**：确认 main 的 Actions 是成功状态，强制刷新。不要手工上传 dist 文件。
- **需要回退**：在 GitHub revert 有问题的内容提交，合并回 main 重新发布；保留历史，不使用 force push。

## 换域名

先获得域名/DNS 管理权限，再修改 `astro.config.mjs` 的 site、BaseLayout 的 canonical 来源（已自动读取 site），并按 GitHub 官方文档配置 Pages 自定义域名。自定义域名时新增的 CNAME 是机器读取的纯文本配置，不能加文件头注释；请在资产/部署文档记录用途。
