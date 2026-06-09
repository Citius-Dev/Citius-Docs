import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/',
  title: "Citius",
  description: "Citius 编程语言 — 一门编译到 C 的高性能系统级语言",
  lang: 'zh-CN',

  themeConfig: {
    logo: '/citius-logo.svg',

    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/introduction' },
      { text: '语言参考', link: '/guide/language-syntax' },
      { text: '示例', link: '/guide/examples' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '入门',
          items: [
            { text: '简介', link: '/guide/introduction' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '从零开始写程序', link: '/guide/tutorial' },
            { text: '编译器使用', link: '/guide/compiler-usage' },
          ]
        },
        {
          text: '语言参考',
          items: [
            { text: '语法基础', link: '/guide/language-syntax' },
            { text: '内置功能', link: '/guide/builtins' },
          ]
        },
        {
          text: '示例',
          items: [
            { text: '代码示例', link: '/guide/examples' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Citius-Dev/Citius-Dev.github.io' }
    ],

    footer: {
      message: '基于 MIT 许可协议发布',
      copyright: 'Copyright © 2026 Citius'
    },

    editLink: {
      pattern: 'https://github.com/Citius-Dev/Citius-Dev.github.io/edit/master/:path',
      text: '在 GitHub 上编辑此页'
    },

    lastUpdated: {
      text: '最后更新于'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      label: '页面导航'
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
  },

  markdown: {
    languageAlias: {
      ct: 'c',
      citius: 'c'
    }
  }
})
