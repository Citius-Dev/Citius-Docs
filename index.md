---
layout: home

hero:
  name: "Citius"
  text: "迅疾不止，性能为先"
  tagline: Citius 是一门编译到 C 的高性能系统级编程语言，兼具 Python 的简洁语法与 C 的原生性能。
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 语言简介
      link: /guide/introduction
  image:
    src: /citius-logo.svg
    alt: Citius

features:
  - title: "Python 式语法"
    details: 简洁直观的语法设计 —— 无需分号，类型可选，变量自动声明。写起来像 Python，跑起来像 C。
    icon: "⚡"
  - title: "编译到 C"
    details: 编译器将 Citius 源码转译为标准 C99 代码，借助 GCC/Clang/MSVC 生成本地可执行文件，性能无损耗。
    icon: "🔄"
  - title: "内置网络与 I/O"
    details: sleep/wait 延时语句、sent 网络请求语句均为语言内建特性，无需额外库即可完成 HTTP 请求与延时控制。
    icon: "🌐"
  - title: "可选类型系统"
    details: 变量和函数参数的类型注解是可选的，编译器通过类型推断自动补全，兼顾灵活性与安全性。
    icon: "📐"
  - title: "默认不可变"
    details: 变量默认不可变，使用 <code>mut</code> 关键字显式声明可变性，鼓励编写更安全、更可预测的代码。
    icon: "🔒"
  - title: "跨平台支持"
    details: 生成的 C 代码内含平台自适应逻辑（<code>#ifdef _WIN32</code>），一套源码，全平台编译运行。
    icon: "🖥️"
---
