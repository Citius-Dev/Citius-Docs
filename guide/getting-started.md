# 快速开始

## 环境要求

要使用 Citius，你需要两套编译工具链：

| 用途 | 要求 | 说明 |
|------|------|------|
| **编译 Citius 编译器本身** | C++17 编译器 + CMake 3.10+ | 编译器源码是 C++17 项目，需要你能编译 C++ 代码 |
| **编译 Citius 程序** | C99 编译器（Clang / GCC / MSVC） | Citius 生成 C99 代码，需要系统 C 编译器将其转为可执行文件 |

Citius 编译器会自动检测系统上可用的 C 编译器，优先顺序：**Clang → GCC → MSVC**。

---

## 编译 Citius 编译器

### 方式一：CMake（推荐，跨平台）

```bash
# 第 1 步：从 GitHub 克隆 Citius 编译器源码
git clone https://github.com/zhouyi/citius.git

# 第 2 步：进入项目目录
cd citius

# 第 3 步：用 CMake 配置构建系统
# -B build 表示在 build 目录下生成构建文件
cmake -B build

# 第 4 步：执行编译
# --build build 表示编译 build 目录中的项目
cmake --build build
```

**每一步的作用：**
- `git clone` 下载编译器源码到本地
- `cmake -B build` 读取 `CMakeLists.txt`，检测系统环境，生成构建配置
- `cmake --build build` 调用系统编译器（MSVC/GCC/Clang）编译所有 `.cpp` 源文件，生成 `citius` 可执行文件

### 方式二：Windows 构建脚本

如果使用 Windows + Visual Studio，可以使用项目自带的构建脚本：

```bash
# PowerShell 方式
# 自动检测 VsDevCmd.bat 路径，设置环境变量后编译
.\build.ps1

# 传统 CMD 方式（需先手动运行 VsDevCmd.bat 设置环境）
# 打开 "Developer Command Prompt for VS"，然后运行：
build.bat
```

### 编译产物

编译完成后，可执行文件位于：
- **CMake 构建：** `build/bin/citius`（或 `build\bin\citius.exe`）
- **MSVC 脚本构建：** `build_msvc\citius.exe`

建议将可执行文件所在目录加入系统 `PATH` 环境变量，方便全局使用。

---

## 编写第一个程序

创建一个名为 `hello.ct` 的文件（`.ct` 是 Citius 源码的标准扩展名），写入以下代码：

```c
// 这是 Citius 的 Hello World 程序
// func 关键字声明函数，main 是程序入口
// 程序启动时自动执行 main 函数中的代码
func main() {
    // print 是内置输出语句
    // 参数 "Hello, Citius!\n" 是字符串字面量
    // 编译后等价于 C 的: printf("%s\n", "Hello, Citius!\n");
    print("Hello, Citius!\n")
}
```

**代码逐行说明：**

| 行 | 代码 | 作用 |
|----|------|------|
| 1 | `func main() {` | 定义程序入口函数 `main`，`func` 是函数定义关键字 |
| 2 | `print("Hello, Citius!\n")` | 调用内置输出函数，字符串参数用双引号包裹，`\n` 是换行转义符 |
| 3 | `}` | 结束函数体 |

---

## 编译并运行

### 方式一：编译后运行

```bash
# -o hello 指定输出文件名为 hello（Windows 上自动生成 hello.exe）
citius hello.ct -o hello

# 运行生成的程序
./hello          # Linux/macOS
.\hello.exe      # Windows
```

**编译过程分解（使用 -S 查看中间产物）：**

```
citius.exe hello.ct     → hello.c（生成的 C 代码）
clang hello.c -o hello  → hello（可执行文件）
```

### 方式二：一步编译运行

```bash
# -run 标志：编译到临时文件 → 立即执行 → 自动清理
# 适合快速测试代码片段
citius hello.ct -run
```

**内部流程：** Citius 编译器会：
1. 编译 `hello.ct` 生成临时的 C 文件
2. 调用系统 C 编译器生成临时可执行文件
3. 运行可执行文件
4. 程序退出后删除临时文件

---

## 仅查看生成的 C 代码

```bash
# -S 标志：仅执行"编译到 C"阶段，输出到标准输出（终端）
# 不生成可执行文件，不调用系统 C 编译器
citius hello.ct -S
```

终端会显示类似如下的 C 代码：

```c
#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>

static int main(void) {
    printf("%s\n", "Hello, Citius!\n");
    return 0;
}
```

**使用场景：**
- **学习调试：** 查看你的 Citius 源码是如何被翻译成 C 代码的，理解编译器的工作原理
- **交叉检查：** 确认编译器生成的代码是否符合预期
- **手动优化：** 导出 C 代码后手动调优再编译

可以将输出重定向到文件方便查看：

```bash
citius hello.ct -S > output.c
```

---

## 下一步

| 学习路径 | 文档链接 | 适合人群 |
|----------|----------|----------|
| 了解语言设计哲学 | [语言简介](/guide/introduction) | 所有读者 |
| 学习完整语法 | [语法参考](/guide/language-syntax) | 想要深入学习的开发者 |
| 掌握内置功能 | [内置功能](/guide/builtins) | 需要网络/IO 功能的开发者 |
| 看完整代码示例 | [代码示例](/guide/examples) | 喜欢从例子里学习的开发者 |
