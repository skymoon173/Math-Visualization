# Git 使用指南

## 1. Git 用户信息设置

在使用 Git 之前，需要设置您的用户名和邮箱地址。这些信息会被记录在您的每一次提交中。

### 1.1 全局设置（推荐）

如果您希望在所有 Git 仓库中使用相同的用户信息，可以使用 `--global` 选项：

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 1.2 单个仓库设置

如果您只想在当前仓库中使用特定的用户信息，可以不使用 `--global` 选项：

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### 1.3 查看当前设置

```bash
git config --list
```

## 2. Git 基本使用方法

### 2.1 初始化仓库

在现有项目目录中初始化 Git 仓库：

```bash
git init
```

### 2.2 克隆远程仓库

克隆一个远程仓库到本地：

```bash
git clone <远程仓库URL>
```

### 2.3 查看仓库状态

查看当前仓库的状态，包括已修改、已暂存和未跟踪的文件：

```bash
git status
```

### 2.4 添加文件到暂存区

添加指定文件到暂存区：

```bash
git add <文件名>
```

添加所有文件到暂存区：

```bash
git add .
```

### 2.5 提交更改

将暂存区的文件提交到本地仓库：

```bash
git commit -m "提交信息"
```

### 2.6 查看提交历史

查看提交历史：

```bash
git log
```

查看简化的提交历史：

```bash
git log --oneline
```

### 2.7 分支操作

#### 创建分支

```bash
git branch <分支名>
```

#### 切换分支

```bash
git checkout <分支名>
```

#### 创建并切换到新分支

```bash
git checkout -b <分支名>
```

#### 查看所有分支

```bash
git branch -a
```

#### 合并分支

将指定分支合并到当前分支：

```bash
git merge <分支名>
```

#### 删除分支

```bash
git branch -d <分支名>
```

### 2.8 远程仓库操作

#### 查看远程仓库

```bash
git remote -v
```

#### 添加远程仓库

```bash
git remote add origin <远程仓库URL>
```

#### 推送更改到远程仓库

```bash
git push -u origin <分支名>
```

#### 拉取远程仓库的更改

```bash
git pull origin <分支名>
```

#### 克隆远程仓库的特定分支

```bash
git clone -b <分支名> <远程仓库URL>
```

## 3. Git 常用命令速查表

| 命令 | 功能 |
|------|------|
| `git init` | 初始化 Git 仓库 |
| `git clone <URL>` | 克隆远程仓库 |
| `git status` | 查看仓库状态 |
| `git add <文件>` | 添加文件到暂存区 |
| `git commit -m "msg"` | 提交更改 |
| `git log` | 查看提交历史 |
| `git branch` | 查看分支 |
| `git checkout <分支>` | 切换分支 |
| `git merge <分支>` | 合并分支 |
| `git push` | 推送更改到远程 |
| `git pull` | 拉取远程更改 |
| `git remote -v` | 查看远程仓库 |

## 4. 提交规范

为了保持良好的提交历史，建议使用清晰、简洁的提交信息。一般格式为：

```
<类型>: <简短描述>

<详细描述> (可选)
```

常见的提交类型包括：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码风格调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

示例：

```
feat: 添加用户登录功能

- 实现了用户名密码登录
- 添加了登录状态管理
- 优化了登录界面样式
```

## 5. 本项目的 Git 使用建议

1. 每个新功能开发都创建一个新分支
2. 定期从主分支拉取最新更改
3. 提交信息要清晰描述更改内容
4. 完成功能后合并到主分支
5. 定期推送更改到远程仓库

## 6. 常见问题解决

### 6.1 撤销工作区更改

```bash
git checkout -- <文件名>
```

### 6.2 撤销暂存区更改

```bash
git reset HEAD <文件名>
```

### 6.3 撤销最后一次提交

```bash
git reset HEAD~1
```

### 6.4 查看差异

查看工作区与暂存区的差异：

```bash
git diff
```

查看暂存区与上次提交的差异：

```bash
git diff --cached
```

查看两个提交之间的差异：

```bash
git diff <提交1> <提交2>
```

## 7. 学习资源

- [Git 官方文档](https://git-scm.com/doc)
- [Pro Git 书籍](https://git-scm.com/book/zh/v2)
- [GitHub Git 教程](https://docs.github.com/cn/get-started/using-git)
- [Git Cheat Sheet](https://training.github.com/downloads/github-git-cheat-sheet/)

---

希望本指南能帮助您快速掌握 Git 的基本使用方法。如果您有任何问题，欢迎查阅官方文档或向其他开发者寻求帮助。