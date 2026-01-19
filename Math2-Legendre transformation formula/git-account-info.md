# Git 账户信息

## 本地配置

### 用户名
```
eastw
```

### 邮箱
```
eastw@example.com
```

## 配置说明

这些信息用于Git提交时记录作者身份。配置存储在本地仓库的 `.git/config` 文件中。

### 查看配置
```bash
git config --list
```

### 修改配置
```bash
git config user.name "新用户名"
git config user.email "新邮箱@example.com"
```

## 注意事项

1. **邮箱**：建议使用与GitHub/GitLab等远程仓库关联的邮箱
2. **用户名**：建议使用与远程仓库一致的用户名
3. **全局配置**：如果需要为所有仓库设置默认配置，可以添加 `--global` 参数

```bash
git config --global user.name "全局用户名"
git config --global user.email "全局邮箱@example.com"
```

# Git 使用指南

## 基本工作流程

### 1. 查看文件状态
```bash
git status
```

### 2. 添加修改到暂存区
```bash
git add <文件名>  # 添加单个文件
git add .         # 添加所有修改
```

### 3. 提交修改
```bash
git commit -m "提交信息：描述修改内容"
```

### 4. 查看提交历史
```bash
git log
```

## 常用命令

### 查看修改
```bash
git diff  # 查看未暂存的修改
git diff --staged  # 查看已暂存的修改
```

### 撤销修改
```bash
git checkout -- <文件名>  # 撤销未暂存的修改
git reset HEAD <文件名>  # 撤销已暂存的修改（回到未暂存状态）
```

### 查看提交历史
```bash
git log --oneline  # 简洁查看提交历史
git log --graph  # 图形化查看分支和提交
```

## 分支管理

### 创建新分支
```bash
git branch <分支名>
git checkout <分支名>  # 切换到新分支
```

### 合并分支
```bash
git checkout master  # 切换到主分支
git merge <分支名>  # 合并指定分支到当前分支
```

## 远程仓库操作

### 添加远程仓库
```bash
git remote add origin <远程仓库URL>
```

### 推送到远程仓库
```bash
git push -u origin master  # 首次推送
```

### 拉取远程仓库
```bash
git pull  # 拉取并合并远程仓库的最新代码
```

## 常见问题

### 忘记提交信息
```bash
git commit --amend  # 修改最后一次提交的信息
```

### 撤销最后一次提交
```bash
git reset HEAD~1  # 撤销提交，保留修改
git reset --hard HEAD~1  # 撤销提交，丢弃修改
```
