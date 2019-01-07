# Nebulw

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
import {safeGet,safeGets,compile} from 'nebulw'

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

nebulw.safeGet(obj,"b.d[0]f[1][0]") // 2

// 预编译表达式
nebulw.safeGet(obj,nebulw.compile("b.d[0]f[1][0]")) //2

// 一次计算多个表达式
nebulw.safeGets(obj,"b.c","b.d[0]f[1][0]","b.d[0].g.h") // [1,2,2]

```

## 测试

```

npm run test

```

## 功能列表

- [X] safeGet
- [ ] safeSet

## 特性

1. 支持d[0]f[1]这种情形，即两个连续调用在不影响语义的情况下可以省略"."。
2. 多个连续的"."会被当作一个，如 b..c 等价于 b.c 。

## 性能对比
