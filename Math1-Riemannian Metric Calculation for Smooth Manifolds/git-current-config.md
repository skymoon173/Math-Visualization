# 当前仓库的 Git 配置信息

## 已设置的用户信息

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **用户名** | `User Name` | 用于标识提交者身份 |
| **邮箱** | `user@example.com` | 用于标识提交者身份，GitHub 等平台会根据此邮箱关联用户账号 |

## 设置命令回顾

在创建 Git 仓库时，为了完成初始提交，我们运行了以下命令来设置当前仓库的用户信息：

```bash
# 设置用户名
git config user.name "User Name"

# 设置邮箱
git config user.email "user@example.com"
```

## 查看当前配置的命令

```bash
git config --list
```

## 如何修改用户信息

如果您需要修改当前仓库的用户信息，可以使用以下命令：

```bash
# 修改用户名
git config user.name "Your New Name"

# 修改邮箱
git config user.email "your.new.email@example.com"
```

## 关于 Git 密码

请注意，Git 并没有直接的命令来设置密码。Git 的身份验证通常通过以下方式进行：

1. **SSH 密钥**：使用 SSH 密钥对进行身份验证，无需输入密码
2. **凭据管理器**：Git 会自动保存您的密码到系统凭据管理器
3. **HTTPS**：在推送时输入用户名和密码

## 建议

如果您计划将仓库推送到 GitHub、GitLab 或 Gitee 等平台，建议使用与平台账号关联的真实邮箱地址，这样您的提交才能正确关联到您的平台账号。

## 下一步操作

现在您已经了解了当前仓库的 Git 配置信息，可以开始：

1. 开发新功能
2. 提交更改
3. 推送到远程仓库（如果需要）

如果您需要进一步的 Git 帮助，请参考 `git-usage.md` 文件。