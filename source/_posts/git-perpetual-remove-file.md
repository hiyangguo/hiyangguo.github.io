---
title: git永久删除文件
date: 2017-07-13 06:47:00
categories: git
tags:
  -  git操作
---


# git删除文件后恢复和永久删除文件

Git 是一个开源的分布式版本控制系统，可以有效、高速的处理从很小到非常大的项目版本管理。Git 是 Linus Torvalds 为了帮助管理 Linux 内核开发而开发的一个开放源码的版本控制软件。

当我们在日常使用中删除了文件，如果这个文件提交过就可以进行恢复。这篇文建，将告诉你如何对删除的文件进行恢复，以及如何彻底的删除某个文件。

<!--more-->

假设我们新建了一个文件`test.txt`,并录入任意内容。然后进行提交。
```bash
#新建一个 文件 并追加内容
touch test.txt
echo 'test' > test.txt 
# 将此文件的更改添加到缓存区
git add test.txt
# 提交缓存区中的内容
git commit -m "update:添加了一个测试文件"
```
之后我们删除这个文件并提交
```bash
# 删除文件
rm -rf test.txt 
# 将此文件的更改添加到缓存区
git add test.txt
# 提交缓存区中的内容
git commit -m "update:删除测试文件"
```
此时查看日志
```bash
# 以一行的方式显示最后的两次提交
git log --online -2
```
得到以下输出
```bash
5be7df0 update:删除测试文件
ac69d69 update:添加了一个测试文件
```
这就意味着虽然你删除了文件，但是这个文件依然在 git 的日志中，可以进行恢复。
```bash
# 检出 ac69d69 版本时的 test.txt 文件
git checkout ac69d69 -- test.txt
```
但是有的时候我们可能并不希望删除的文件被恢复，比如说一不小心提交了一些没用的测试文件，显然是不希望永远的放在 git 记录中的。
```bash
git filter-branch --index-filter "git rm -rf --cached --ignore-unmatch test.txt" HEAD
```

运行 filter-branch 时 Git 往 .git/refs/original 添加的一些 refs 中仍有对它的引用，因此需要将这些引用删除。
```bash
rm -rf .git/refs/original/
```
删除没必要的 `reflog` 信息，然后清理不必要的文件并优化本地存储库
```bash
git reflog expire --all
git gc --aggressive --prune
```
最后删除空的提交日志
```bash
git filter-branch --prune-empty
```

**注意**：这样操作会改写 `commit` 记录，所以如果已提交到服务端，请务必谨慎操作！如果确定没有问题可以使用下面的命令强制提交。
```bash
git push --force
```
如果当前为`master`分支或者被设为`proteced`则需要首先取消`proteced`。