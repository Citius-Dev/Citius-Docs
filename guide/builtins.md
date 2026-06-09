# 内置功能

## 输出：print / printi

`print` 和 `printi` 是 Citius 内置的输出语句，编译时直接转换为 C 的 `printf` 调用。**无需包含任何头文件**——编译器会自动在生成的 C 代码顶部添加 `#include <stdio.h>`。

### print —— 通用输出（自动换行）

`print` 可以接收**整数、浮点数、字符串、布尔值**四种类型的参数，编译后根据参数类型选择正确的 `printf` 格式符：

```c
print("Hello, World!\n")    // 字符串 → printf("%s\n", "Hello, World!\n")
print(42)                    // 整数 i64 → printf("%lld\n", 42)
print(3.14)                  // 浮点数 f64 → printf("%f\n", 3.14)
print(true)                  // 布尔值 bool → printf("%s\n", "true")
print(false)                 // 布尔值 false → printf("%s\n", "false")
```

**关键行为：** `print` 在调用末尾自动添加换行符 `\n`。如果传入的字符串本身已经带有 `\n`，输出中会有两个换行，一个来自字符串本身，一个来自 `print` 的自动追加。

编译后的 C 代码等价于：

```c
#include <stdio.h>
// print("Hello") → printf("%s\n", "Hello");
// print(42)     → printf("%lld\n", 42);
// print(3.14)   → printf("%f\n", 3.14);
// print(true)   → printf("true\n");
```

### printi —— 整数输出（不换行）

`printi` 专门用于输出整数值，**不会在末尾添加换行符**，适用于需要精细控制输出格式的场景：

```c
printi(42)                   // → printf("%lld", 42) （无换行）
printi(result)               // → printf("%lld", result)

// 典型用法：手动控制换行
printi(1)
printi(2)                    // 输出 "12" 在同一行
print("\n")                  // 手动输出换行
```

**`print` vs `printi` 对比：**

| 特性 | `print` | `printi` |
|------|---------|----------|
| 参数类型 | 字符串/整数/浮点/布尔 | **仅整数** |
| 自动换行 | ✅ 是 | ❌ 否 |
| 典型编译结果 | `printf("%s\n", ...)` / `printf("%lld\n", ...)` | `printf("%lld", ...)` |

---

## 延时控制：sleep / wait

`sleep` 和 `wait` 是**完全等价**的同义词，用于在程序执行中插入暂停。编译为 `citius_sleep()` 函数调用。

### 语法

```c
// sleep/wait 后跟数值和时间单位
sleep 1 s       // 暂停 1000 毫秒（1 秒）
wait 500 ms     // 暂停 500 毫秒
sleep 2 min     // 暂停 120000 毫秒（2 分钟）
sleep 1 h       // 暂停 3600000 毫秒（1 小时）
```

### 编译后的行为

`sleep 1 s` 在代码生成时会被转换为：

```c
// CodeGen 在生成的 C 文件中自动生成此辅助函数
static void citius_sleep(int64_t ms) {
    #ifdef _WIN32
        Sleep((DWORD)ms);           // Windows API，单位毫秒
    #else
        struct timespec ts;
        ts.tv_sec = ms / 1000;
        ts.tv_nsec = (ms % 1000) * 1000000;
        nanosleep(&ts, NULL);       // POSIX API
    #endif
}

// sleep 1 s 被替换为：
citius_sleep(1000);
```

### 时间单位对照表

| 单位 | 全称 | 换算关系 | 示例 | 实际毫秒值 |
|------|------|----------|------|-------------|
| `ms` | 毫秒 | 1 ms = 1 ms | `sleep 500 ms` | 500 ms |
| `s` | 秒 | 1 s = 1000 ms | `sleep 1 s` | 1000 ms |
| `min` | 分钟 | 1 min = 60 s | `sleep 2 min` | 120000 ms |
| `h` | 小时 | 1 h = 60 min | `sleep 1 h` | 3600000 ms |
| `d` | 天 | 1 d = 24 h | `sleep 1 d` | 86400000 ms |
| `m` | 月 | 1 m = 30 d | `sleep 1 m` | 2592000000 ms |
| `y` | 年 | 1 y = 365 d | `sleep 1 y` | 31536000000 ms |

**注意：** `sleep` 和 `wait` 在编译生成的 C 代码中完全一致，`wait` 只是 `sleep` 的语法糖别名。

---

## 网络请求：sent

`sent`（拉丁语 "send" 的变体）是 Citius 最具独创性的特性之一——在**语言层面**直接支持网络请求，无需引入任何外部库。

### 核心机制

当编译器遇到 `sent` 语句时，CodeGen 会在生成的 C 文件中自动生成：

1. **`citius_net_init()`** —— 网络库初始化（Windows 上调用 `WSAStartup`，POSIX 上无操作）
2. **`citius_http_request()`** —— 完整的 HTTP 请求函数，使用原生 Socket API
3. 编译时自动链接系统网络库（Windows 的 `ws2_32.lib`，POSIX 的 `-lm`）

### HTTP 自动模式

```c
// === 基本用法：发送 HTTP GET 请求 ===
// "GET /"        —— HTTP 请求行，表示请求根路径
// [example.com:80] —— 目标主机和端口，端口 80 可省略
// 编译后：创建 socket → DNS 解析 → 建立 TCP 连接 → 发送 HTTP 请求 → 接收响应 → 打印到 stdout
sent http auto "GET /" [example.com:80]

// === 带自定义 HTTP 请求头 ===
// headers { } 内的键值对会被添加到 HTTP 请求头中
// 编译后：在生成的请求中包含 Authorization 头
sent http auto "GET /api/data" [api.example.com]
    headers {
        "Authorization": "Bearer token123"
        "User-Agent": "Citius/1.0"
    }

// === 带请求体（POST 请求）===
// payload 关键字后跟字符串或表达式，作为 HTTP 请求体
// 适用于 POST、PUT 等需要请求体的方法
sent http auto "POST /api/data" [api.example.com:443]
    headers {
        "Content-Type": "application/json"
    }
    payload "{ \"key\": \"value\" }"

// === 原始模式 ===
// raw 标记表示不添加任何默认 HTTP 头（如 Host、User-Agent 等）
// 适用于需要完全控制请求内容的场景
sent http auto "GET /path" [example.com] raw
```

**自动模式下生成的 HTTP 请求示例（无 raw 标记时）：**

```
GET /path HTTP/1.1
Host: example.com:80
User-Agent: Citius/1.0
Connection: close

```

### 参数详解

| 参数 | 位置 | 类型 | 说明 |
|------|------|------|------|
| 协议 | 第 2 字段 | `http` / `https` / `tcp` / `udp` | 使用的网络协议 |
| 模式 | 第 3 字段 | `auto` / `manual` | auto 自动构建 HTTP 请求，manual 手动发送原始数据 |
| 请求内容 | 字符串 | `"GET /path"` | HTTP 请求行，或原始数据 |
| 目标地址 | `[host:port]` | 主机名 + 可选端口 | 端口默认值：HTTP 80，HTTPS 443 |
| headers | 可选 | `{}` 键值对块 | 自定义 HTTP 请求头 |
| payload | 可选 | 表达式 | HTTP 请求体 |
| raw | 可选 | 标记 | 禁止添加默认 HTTP 头 |

### TCP/UDP 手动模式

手动模式允许直接发送原始字节数据，不经过 HTTP 协议封装：

```c
// TCP 手动发送十六进制数据
// hex "AABBCCDD" 表示发送 4 个字节：0xAA, 0xBB, 0xCC, 0xDD
sent tcp manual hex "AABBCCDD" [hostname:port]

// UDP 手动发送文本数据
// text "hello" 表示以 UTF-8 编码发送 "hello" 字符串
sent udp manual text "hello" [hostname:port]
```

| 手动模式数据类型 | 说明 |
|-----------------|------|
| `hex` | 十六进制字符串 `"AABB"` → 原始字节 `[0xAA, 0xBB]` |
| `binary` | 二进制数据 |
| `text` | 文本字符串，UTF-8 编码 |

> ⚠️ **当前实现状态：** 手动发送模式 (`manual`) 的代码生成器目前标记为 `#error "not implemented"`，尚未完全实现。HTTP 自动模式 (`auto`) 已完整可用。

### 支持的网络协议

| 协议 | 自动模式 (auto) | 手动模式 (manual) |
|------|----------------|-------------------|
| `http` | ✅ 完整实现 | ✅ 代码生成器预留 |
| `https` | 支持（语法层面） | 支持（语法层面） |
| `tcp` | — | ⏳ 代码生成中 (`#error`) |
| `udp` | — | ⏳ 代码生成中 (`#error`) |

### 编译后的网络代码生成流程

当 CodeGen 遇到 `sent` 语句时，执行以下步骤：

1. **设置标志位** `hasNetworking = true`
2. **在生成的 C 文件末尾**追加网络辅助函数：
   - `citius_net_init()` —— 首次调用时初始化，使用 `static` 标志确保只初始化一次
   - `citius_http_request(host, port, request, has_headers, has_payload, is_raw)` —— 执行 HTTP 请求
3. **在 `main` 函数开头**插入 `citius_net_init()` 调用
4. **将 `sent` 语句替换为** `citius_http_request(...)` 调用
5. **链接系统网络库** —— 编译时自动添加 `-lws2_32`（Windows）或 `-lm`（POSIX）

**生成的 C 代码结构大致如下：**

```c
#include <stdio.h>
#include <string.h>
#ifdef _WIN32
    #include <winsock2.h>
    #include <ws2tcpip.h>
#else
    #include <sys/socket.h>
    #include <netinet/in.h>
    #include <netdb.h>
    #include <unistd.h>
#endif

static int citius_net_initialized = 0;
static void citius_net_init() { /* WSAStartup 等 */ }
static void citius_http_request(/* ... */) { /* socket, connect, send, recv */ }

int main(void) {
    citius_net_init();
    citius_http_request("example.com", 80, "GET /", 0, 0, 0);
    return 0;
}
```
