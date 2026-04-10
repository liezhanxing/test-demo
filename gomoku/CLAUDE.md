# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

快乐五子棋 (Happy Gomoku) - 适合小朋友的卡通风格五子棋游戏

## 运行命令

### Web 版（推荐）
```bash
# Mac/Linux
open index.html

# Windows
start index.html
```

### Python 原版
```bash
python3 gomoku.py
```

## 代码架构

### Web 版架构
```
index.html      # 页面结构 + 云朵动画元素
css/style.css   # 卡通样式（天空背景、3D 棋子、纸屑动画）
js/app.js       # GomokuGame 类 - 游戏核心逻辑
```

**GomokuGame 类 (js/app.js)**
- `initBoard()` - 初始化 15x15 棋盘数据
- `renderBoard()` - 渲染棋盘网格
- `placeStone(row, col)` - 落子 + 音效 + 胜负检查
- `checkWin(row, col)` - 四方向五子连珠检测
- `undo()` - 悔棋功能
- `playSound(type)` - Web Audio API 合成音效（place/win/invalid）
- `createConfetti()` - 获胜纸屑动画

### Python 版架构
```
gomoku.py       # Gomoku 类 + main() 入口
```

**Gomoku 类核心方法**
- `check_win(row, col)` - 四方向胜负判断
- `is_draw()` - 平局检测
- `play()` - 游戏主循环

## 技术栈
- Web 版：HTML5 + CSS3 + 原生 JavaScript（无依赖）
- Python 版：纯 Python 3 标准库（无依赖）
- 音效：Web Audio API 振荡器合成（无需外部音频文件）

## 游戏规则
- 15x15 标准棋盘
- 黑棋 (X) 先手，白棋 (O) 后手
- 横/竖/斜四方向，先连成五子一线获胜
- 支持悔棋、重新开始、音效开关
