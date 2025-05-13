# 扫雷

## 项目介绍

这是一个基于Web的扫雷游戏实现，使用HTML、CSS和JavaScript开发。

## 功能特点

- 多种难度级别（初级、中级、高级）
- 计时器和炸弹计数器
- 右键标记功能
- 快速清除周围功能
- 游戏胜利和失败检测

## 如何玩

1. 点击任意格子开始游戏
2. 左键点击格子揭示内容
3. 右键点击格子标记为可能的炸弹位置
4. 数字表示周围八个格子中有多少炸弹
5. 标记出所有炸弹并揭示所有安全格子即可获胜

## 项目开发

### 技术栈

- React + Vite + TS
- CSS3 (使用Tailwind CSS和daisyUI)

### 开发指南

#### 本地运行

1. 克隆项目
  ```bash
  git clone https://github.com/cjiao100/mine-clearance.git
  cd mine-clearance
  ```

2. 安装&运行
  ```bash
  # 安装依赖
  pnpm install

  # 运行
  pnpm run dev
  ```

3. 在浏览器中访问 `http://localhost:5173`
