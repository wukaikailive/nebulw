# Nebulw

[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)

A library for safe get/set nested attributes of JavaScript.

这是一个用于安全获取/设置javascrpt对象/数组中深层次的属性/元素的库。

这个库的特色就是将表达式解析成抽象语法树，再进行求值或赋值。
主要是为了学习和好玩，性能待测试。

## 使用方式

```
npm install --save nebulw
```

```

import nebulw from 'nebulw'

// 或单独导出
import {safeGet,safeGets,compile,safeSet,safeSets} from 'nebulw'

let obj = {
        a: 2,
        b: {
          c: 1,
          d: [
            {
              f: [1, [2, 3]],
              g: {
                h: 2
              }
            }
          ]
        }
      }

// get

nebulw.safeGet(obj,"b.d[0]f[1][0]") // 2

// 预编译表达式
nebulw.safeGet(obj,nebulw.compile("b.d[0]f[1][0]")) //2

// 一次计算多个表达式
nebulw.safeGets(obj,"b.c","b.d[0]f[1][0]","b.d[0].g.h") // [1,2,2]

// set

nebulw.safeSet(obj,"b.c",4) // obj.b.c will be set to 4

nebulw.safeSet({},"b.c",4) // {b:{c:4}}

nebulw.safeSet({},"b.c[0]",4)) // {b:{c:[4]}}

nebulw.safeSets({},["b.c",1],["b.d[1]",2],["b.d[0][0]",3]) // {b:{c:1,d:[[3],2]}}

// more test see test.js

```

## 测试

```

npm run test

```

## 功能列表

- [X] safeGet
- [X] safeSet

## 特性

1. 支持d[0]f[1]这种情形，即两个连续调用在不影响语义的情况下可以省略"."。
2. 多个连续的"."会被当作一个，如 b..c 等价于 b.c 。

## 性能对比

使用表格中的库对每个表达式/路径执行100000次的结果,结果仅表示相对大小，在不同环境下运行结果会不一样。

Get:

|表达式|nebulw|nebulw with precompile|[shvl](https://github.com/robinvdvleuten/shvl)|[l-safeget](https://github.com/julyL/safeGethttps://github.com/julyL/safeGet)|
|-|-|-|-|-|
|b.c|95ms|13ms|16ms|227ms|
|b.d[0]f[1][0]|166ms|11ms|Not Support|328ms|
|b.d[0].g.h|134ms|9ms|Not Support|259ms|

Set:

|表达式|nebulw|nebulw with precompile|[shvl](https://github.com/robinvdvleuten/shvl)
|-|-|-|-|
|b.c|201ms|51ms|78ms|
|b.d[0]f[1][0]|705ms|257ms|Not Support|
|b.d[0].g.h|541ms|145ms|Not Support|
