<!--
@file docs/assets.md
@purpose 图片来源、设计依据和无法内嵌文件头的生成/二进制文件说明。
@maintain 新增第三方图片时补充来源和使用权限；不要上传临时 Figma URL。
-->
# 资产及文件说明

## 浙大校徽

`public/images/zju-official.png` 与现有 `design-assets/branding/zju-official.png` 相同。

官方来源：https://www.zju.edu.cn/572/main.htm

图片来源：https://www.zju.edu.cn/_upload/article/images/c3/98/1fb1d281492eb477a098ef7a2901/05966b26-ab45-470d-94c1-99b1e02d12f4.png

与最终 Figma 导出校徽进行 SHA-256 核对，一致：`dc914cc634bdcd9b871c84686817c12287c6bafd309f083a1054040aee806fca`。

原始尺寸 318 × 253；不改图像内容。页头在 66 × 66 容器中按 Figma 的 119.3 × 95 图像及 (-25.5, -16.1) 位置展示，不重绘、不变色。

求是蓝：`#003F88`。来源：https://www.zju.edu.cn/english/2023/0323/c74903a2732011/page.htm

## 人像

未提供真实人像，使用最终设计中的首字母占位。没有从网络下载他人照片，也没有生成虚构人像冒充团队成员。填写成员 photo 字段后自动替换。

## 其他文件

- `package-lock.json`：npm 自动生成的完整依赖树；不要手工加注释，提交它以确保 npm ci 可复现。
- `.astro/`：Astro 生成的内容类型和缓存，忽略。
- `dist/`：构建输出，不提交。GitHub Actions 上传部署产物。
- `node_modules/`：安装依赖，忽略。
- `design-assets/illustrations/`：历史方案插画，保留来源文本，不被当前页面引用。
- Markdown 元数据 `purpose` / `maintain` 用于内容文件自说明；其余手写文件使用注释或 `_file` 对象。
