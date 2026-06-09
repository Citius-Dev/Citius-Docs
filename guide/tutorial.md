# 教程：从零开始写一个 Citius 程序

本教程带你从安装环境开始，一步步写一个完整的 Citius 程序 —— 一个**命令行待办事项管理器**（Todo CLI）。通过这个项目，你会学到：

- 变量声明与赋值
- 函数定义与调用
- `if`/`while` 控制流程
- 字符串操作与用户输入
- 结构体定义与使用
- 多文件组织
- 完整的编译与运行

---

## 第 1 步：确认环境

检查你是否有 C++17 编译器和 CMake（只需做一次）：

```bash
# 检查 CMake
cmake --version

# 检查 C++ 编译器（任一即可）
g++ --version
clang++ --version
```

如果没有，先安装：
- **Windows:** 安装 Visual Studio（选"使用 C++ 的桌面开发"）+ [CMake](https://cmake.org/download/)
- **macOS:** `xcode-select --install` + `brew install cmake`
- **Linux:** `sudo apt install build-essential cmake`

---

## 第 2 步：编译 Citius 编译器

```bash
git clone https://github.com/Citius-Dev/Citius-Dev.github.io.git citius
cd citius
cmake -B build
cmake --build build
```

确认编译器可用：

```bash
# Windows
build\bin\citius.exe -help

# macOS/Linux
build/bin/citius -help
```

看到帮助信息就说明成功了。把 `citius` 加到 PATH 方便使用：

```bash
# Windows PowerShell
$env:Path += ";$pwd\build\bin"

# macOS/Linux
export PATH="$PWD/build/bin:$PATH"
```

---

## 第 3 步：第一个程序 —— Hello World

新建一个目录用于你的项目：

```bash
mkdir my-todo
cd my-todo
```

创建一个 `hello.ct`：

```c
// 程序入口：main 函数
// 程序启动时自动执行 main 里的代码
func main() {
    // print 输出文本后自动换行
    // \n 是换行转义符
    print("Hello, Citius!\n")
}
```

编译运行：

```bash
citius hello.ct -run
```

终端输出：

```
Hello, Citius!
```

**你刚才完成了：** 函数定义 → 内置函数调用 → 编译 → 运行。

---

## 第 4 步：变量与循环 —— 计数器

现在我们写一个倒数计时器。创建一个 `countdown.ct`：

```c
func main() {
    // 变量声明：= 右侧的类型决定变量类型
    // 10 是整数，所以 count 是 i64（64 位整数）
    count = 10

    // while 循环：条件为 true 时重复执行
    // 条件不需要括号
    while count > 0 {
        // printi 输出整数，不自动换行
        printi(count)
        // 手动输出换行 + 提示文字
        print("...\n")
        // count 自动声明时默认可变，所以可以修改
        count = count - 1
    }

    print("Go!\n")
}
```

编译运行：

```bash
citius countdown.ct -run
```

输出：

```
10...
9...
8...
7...
6...
5...
4...
3...
2...
1...
Go!
```

**你学到了：** 自动变量声明、`while` 循环、变量自减、`printi` 与 `print` 的区别。

---

## 第 5 步：函数与条件判断 —— 判断奇偶

创建 `evenodd.ct`：

```c
// 自定义函数：判断一个数是否为偶数
// 参数 x 的类型省略，默认推断为 i64
// 返回类型省略，默认 i64（用 1 表示 true，0 表示 false）
func is_even(x) {
    // % 是取模运算符
    // == 是等于比较
    if x % 2 == 0 {
        return 1    // 返回 1 表示 true
    } else {
        return 0    // 返回 0 表示 false
    }
}

// 简写版本：表达式直接作为返回值
// 条件 x % 2 == 0 的值就是 1 或 0
func is_odd(x) {
    return x % 2 == 1
}

func main() {
    i = 1
    while i <= 10 {
        // if 的条件中，非 0 表示 true
        if is_even(i) {
            printi(i)
            print(" 是偶数\n")
        } else {
            printi(i)
            print(" 是奇数\n")
        }
        i = i + 1
    }
}
```

运行结果：

```
1 是奇数
2 是偶数
3 是奇数
4 是偶数
5 是奇数
6 是偶数
7 是奇数
8 是偶数
9 是奇数
10 是偶数
```

**你学到了：** 函数定义与返回值、`if/else` 分支、取模运算。

---

## 第 6 步：字符串拼接 —— 格式化输出

Citius 支持用 `+` 拼接字符串。创建 `greet.ct`：

```c
func main() {
    name = "小明"
    // 字符串拼接：+ 号连接多个字符串
    // 注意：print 的参数可以是拼接表达式
    print("你好，" + name + "！\n")

    // 拼接整数时需要先说明：print 自动处理
    age = 25
    print(name + " 今年 ")
    printi(age)
    print(" 岁\n")
}
```

---

## 第 7 步：项目实战 —— Todo CLI

现在我们把学到的综合起来，写一个真正的命令行待办事项管理器。

### 7.1 基础版本：内存中的 Todo

创建 `todo.ct`：

```c
// 定义 Todo 项的结构体
struct Todo {
    id: i32          // 编号
    title: str       // 标题
    done: bool       // 是否完成
}

// 全局变量：存储所有 Todo
mut todos: Todo[100]   // Todo 数组，最多 100 项
mut todo_count: i32 = 0

// 添加一条 Todo
func add_todo(title) {
    if todo_count >= 100 {
        print("抱歉，待办事项已满！\n")
        return
    }
    // 创建新的 Todo 项
    todos[todo_count].id = todo_count + 1
    todos[todo_count].title = title
    todos[todo_count].done = false
    todo_count = todo_count + 1
    print("已添加: ")
    print(title)
    print("\n")
}

// 列出所有 Todo
func list_todos() {
    if todo_count == 0 {
        print("当前没有待办事项。\n")
        return
    }

    print("\n===== 待办事项列表 =====\n")
    i = 0
    while i < todo_count {
        // 输出编号
        printi(todos[i].id)
        print(". ")

        // 根据完成状态显示不同的标记
        if todos[i].done {
            print("[✓] ")
        } else {
            print("[ ] ")
        }

        // 输出标题
        print(todos[i].title)
        print("\n")
        i = i + 1
    }
    print("========================\n")
}

// 标记某条 Todo 为已完成
func complete_todo(id) {
    i = 0
    while i < todo_count {
        if todos[i].id == id {
            todos[i].done = true
            print("已完成: ")
            print(todos[i].title)
            print("\n")
            return
        }
        i = i + 1
    }
    print("未找到编号为 ")
    printi(id)
    print(" 的待办事项。\n")
}

// 主函数：程序入口
func main() {
    print("===== Todo CLI =====\n")
    print("试试这些命令：\n")
    print("  add <标题>  - 添加待办\n")
    print("  list        - 列出所有待办\n")
    print("  done <编号> - 标记完成\n")
    print("  exit        - 退出\n")
    print("====================\n")

    // 先加几条示例
    add_todo("学习 Citius 语法")
    add_todo("写一个 Todo 程序")
    add_todo("编译运行试试")

    // 展示列表
    list_todos()

    // 标记第一条为已完成
    complete_todo(1)

    // 再展示一次
    list_todos()
}
```

编译运行：

```bash
citius todo.ct -run
```

输出：

```
===== Todo CLI =====
试试这些命令：
  add <标题>  - 添加待办
  list        - 列出所有待办
  done <编号> - 标记完成
  exit        - 退出
====================
已添加: 学习 Citius 语法
已添加: 写一个 Todo 程序
已添加: 编译运行试试

===== 待办事项列表 =====
1. [ ] 学习 Citius 语法
2. [ ] 写一个 Todo 程序
3. [ ] 编译运行试试
========================
已完成: 学习 Citius 语法

===== 待办事项列表 =====
1. [✓] 学习 Citius 语法
2. [ ] 写一个 Todo 程序
3. [ ] 编译运行试试
========================
```

**你学到了：** `struct` 定义复合类型、数组存取、`.` 成员访问、函数封装、循环遍历数组。

### 7.2 使用 for 范围循环重构

`for x in range` 语法可以让代码更简洁。把 `list_todos` 和 `complete_todo` 中的 `while` 循环替换：

```c
// 用 for 重写 list_todos
func list_todos() {
    if todo_count == 0 {
        print("当前没有待办事项。\n")
        return
    }

    print("\n===== 待办事项列表 =====\n")
    // for i in N 等价于 for i in 0..N
    // i 从 0 到 todo_count-1
    for i in todo_count {
        printi(todos[i].id)
        print(". ")
        if todos[i].done {
            print("[✓] ")
        } else {
            print("[ ] ")
        }
        print(todos[i].title)
        print("\n")
    }
    print("========================\n")
}

// 用 for 重写 complete_todo
func complete_todo(id) {
    for i in todo_count {
        if todos[i].id == id {
            todos[i].done = true
            print("已完成: ")
            print(todos[i].title)
            print("\n")
            return
        }
    }
    print("未找到编号为 ")
    printi(id)
    print(" 的待办事项。\n")
}
```

**for 循环的优势：**

| 特性 | `while` | `for x in range` |
|------|---------|------------------|
| 代码量 | 需要手动初始化/判断/自增 | 一行搞定 |
| 可读性 | 循环变量维护分散在三处 | 范围清晰集中 |
| 适用场景 | 条件复杂的循环 | 固定次数的遍历 |

---

## 第 8 步：编译与调试技巧

### 查看生成的 C 代码

把 Todo 程序编译成 C 看看：

```bash
citius todo.ct -S > todo.c
```

打开 `todo.c`，你会看到：
- `struct Todo` 变成了 C 的 `typedef struct { ... } Todo;`
- `for i in todo_count` 变成了 `for (int64_t i = 0; i < todo_count; i++)`
- `print(...)` 变成了 `printf(...)`
- 所有函数都加了 `static` 关键字

### 常见编译错误

```
Error: undefined variable 'xyz'
```
变量名拼写错误或未声明。检查变量名是否一致。

```
Error: cannot assign to immutable variable 'x'
```
变量默认不可变，给 `x` 赋值前需要加 `mut`。

```
Error: type mismatch: expected i64, got str
```
类型不匹配，检查你是否把字符串赋值给了整数变量。

---

## 第 9 步：发挥创意

你已经掌握了 Citius 的核心语法，可以尝试这些扩展练习：

| 练习 | 难度 | 用到的新知识 |
|------|------|-------------|
| 给 Todo 增加"优先级"字段 | ⭐ | `struct` 加字段 |
| 增加"删除"功能 | ⭐⭐ | 数组元素移除 |
| 用 `sent` 将 Todo 同步到远程 API | ⭐⭐⭐ | 内置网络请求 |
| 用 `sleep` 实现番茄钟定时器 | ⭐ | 延时控制 |
| 写一个猜数字游戏 | ⭐⭐ | 随机数、用户交互 |

---

## 总结：你学到的全部知识

| 概念 | 对应代码 | 章节 |
|------|----------|------|
| 程序入口 | `func main() { }` | 第 3 步 |
| 变量声明 | `x = 10` / `var y: i32 = 20` | 第 4 步 |
| 循环 | `while` / `for i in N` | 第 4、7.2 步 |
| 条件判断 | `if / else if / else` | 第 5 步 |
| 函数 | `func name(params) { }` | 第 5 步 |
| 运算符 | `+` `-` `*` `/` `%` `==` | 第 5 步 |
| 布尔逻辑 | `true` `false` `&&` `\|\|` `!` | 第 5 步 |
| 字符串拼接 | `"a" + "b"` | 第 6 步 |
| 结构体 | `struct { field: Type }` | 第 7 步 |
| 数组 | `arr[index]` | 第 7 步 |
| 成员访问 | `obj.field` | 第 7 步 |
| 输出 | `print()` / `printi()` | 第 3、4 步 |
| 编译器 | `citius file.ct -run` | 第 3 步 |
| 查看 C 代码 | `citius file.ct -S` | 第 8 步 |
