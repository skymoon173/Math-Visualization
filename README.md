# 数学可视化 Math-Visualization

把抽象的高等数学概念变成**可交互的网页图形**。纯前端实现，无需安装、无需后端，浏览器打开即用。

## ✨ 项目内容

| 模块 | 主题 | 说明 |
|------|------|------|
| 📐 [Math1](Math1-Riemannian%20Metric%20Calculation%20for%20Smooth%20Manifolds/index.html) | 黎曼度量可视化计算系统 | 在 13 种流形（球面、环面、双曲面、莫比乌斯带、克莱因瓶等）上计算度量张量、基向量、克里斯托弗符号、高斯/平均曲率，附 3D 交互可视化与完整推导步骤 |
| 🔄 [Math2](Math2-Legendre%20transformation%20formula/index.html) | 勒让德变换可视化 | 切线簇动画演示 g(p) = xp − f(x) 的生成；另含几何原理、上确界定义、多元函数推广共 4 个专题页面 |
| 🌀 [Math3](Math3-Lie%20Groups%20and%20Lie%20Algebras/index.html) | 李群与李代数可视化 | 基于 Three.js 的 SO(2) / SO(3) 三维交互：旋转滑块、指数映射、流形与李代数视图，从第一性原理讲解群结构 |

也可以直接打开仓库根目录的 [index.html](index.html) 查看项目导航页（部署后即为站点首页）。

## 🚀 本地运行

由于使用了 ES Module（Three.js），请通过本地 HTTP 服务器访问：

```bash
# Python 3
python -m http.server 8000

# 或 Node.js
npx serve .
```

然后访问 <http://localhost:8000/> 。

## 🧰 技术栈

- 原生 HTML / CSS / JavaScript（无构建步骤）
- [MathJax 3.2.2](https://www.mathjax.org/)（CDN）—— 数学公式渲染
- [Three.js 0.150.1](https://threejs.org/)（CDN）—— WebGL 3D 可视化
- Canvas 2D —— 二维动画与曲面绘制

> MathJax 与 Three.js 均通过 jsDelivr CDN 引入，首次打开需要联网。

## 📁 目录结构

```
Math-Visualization/
├── index.html                  # 项目导航落地页
├── LICENSE                     # MIT
├── Math1-Riemannian Metric Calculation for Smooth Manifolds/
│   ├── index.html
│   ├── riemann-calculator-full.js   # 计算器与 3D 引擎主逻辑
│   ├── detailed-steps.js
│   ├── getPartialDerivativeDetails.js
│   └── styles-final.css
├── Math2-Legendre transformation formula/
│   ├── index.html              # 变换过程动画
│   ├── principle.html          # 几何原理：切线截距
│   ├── supremum.html           # 为什么需要上确界
│   ├── multivariate.html       # 多元函数推广
│   ├── script.js / style.css
│   └── favicon.svg
└── Math3-Lie Groups and Lie Algebras/
    ├── index.html              # 界面、讲解与样式
    ├── lie-algebra.js          # 李群/李代数计算模块
    ├── app.js                  # Three.js 场景与交互
    └── README.md
```

## 📄 许可证

[MIT License](LICENSE)
