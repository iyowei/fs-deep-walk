# @iyowei/fs-deep-walk

专注于深度扫描指定磁盘位置。

- [x] 复用整个穷举，程序执行完成只发生一次穷举
- [x] 内嵌仅搜索
- [x] 编程式匹配方式，甚至可以请求远程接口，或者有需要的话可以自己实现功能最匹配需求但代码量最少的模块，类似 “fast-glob”

## 目录

- [fsDeepWalk({ from, worker })](#fsdeepwalk-from-worker-)
- [fsDeepWalkSync({ from, worker })](#fsdeepwalksync-from-worker-)
- [安装](#安装)
  - [NPM](#npm)
  - [PNPM](#pnpm)
  - [Yarn](#yarn)
- [为什么不使用 glob？](#为什么不使用-glob)
- [参与贡献](#参与贡献)
- [其它](#其它)

## fsDeepWalk({ from, worker })

- `from` { String } 指定磁盘位置，**必填**
- `worker` 处理器，如果扫描的同时需要更新、过滤操作可提供，一定程度复用穷举，**可选**，{ Function }
  - 返回 { Object | Boolean | Promise }
    - `false` 过滤掉当前扫描结果
    - `true` 保留当前扫描结果
    - 对象字面量，保留 / 更新当前扫描结果
    - 如果需要在处理器中需要安放些异步操作，如远程数据请求，可在处理器中返回一个 Promise，该 Promise 可返回，
      - `false` 过滤掉当前扫描结果
      - `true` 保留当前扫描结果
      - 对象字面量，保留 / 更新当前扫描结果
      - 其它类型则默认为没有任何处理
    - 其它类型则默认为没有任何处理
- 返回: {Promise} 扫描到的文件夹、文件
  - `files` 文件扫描结果
  - `dirs` 文件夹扫描结果

```js
import { log, time, timeEnd } from 'console';
import { fsDeepWalk } from @iyowei/fs-deep-walk;

(async () => {
  time('fsDeepWalk');

  const asyncrslt = await fsDeepWalk({
    from: process.cwd(),
    worker: (cur) => {
      const excludes = ['.git', 'node_modules'];

      if (cur.dirent.isDirectory() && excludes.includes(cur.dirent.name)) {
        return false;
      }

      return true;
    },
  });

  timeEnd('fsDeepWalk');

  log(asyncrslt);
})();
```

## fsDeepWalkSync({ from, worker })

- `from` { String } 指定磁盘位置，**必填**
- `worker` 处理器，如果扫描的同时需要更新、过滤操作可提供，一定程度复用穷举，**可选**，{ Function }
  - 返回 { Object | Boolean | Promise }
    - `false` 过滤掉当前扫描结果
    - `true` 保留当前扫描结果
    - 对象字面量，保留 / 更新当前扫描结果
    - 如果需要在处理器中需要安放些异步操作，如远程数据请求，可在处理器中返回一个 Promise，该 Promise 可返回，
      - `false` 过滤掉当前扫描结果
      - `true` 保留当前扫描结果
      - 对象字面量，保留 / 更新当前扫描结果
      - 其它类型则默认为没有任何处理
    - 其它类型则默认为没有任何处理
- 返回: {Promise} 扫描到的文件夹、文件
  - `files` 文件扫描结果
  - `dirs` 文件夹扫描结果

```js
import { log, time, timeEnd } from 'console';
import { fsDeepWalkSync } from @iyowei/fs-deep-walk;

time('fsDeepWalkSync');

const syncrslt = fsDeepWalkSync({
  from: process.cwd(),
  worker: (cur) => {
    const excludeDirs = ['.git', 'node_modules'];

    if (cur.dirent.isDirectory() && excludeDirs.includes(cur.dirent.name)) {
      return false;
    }

    return true;
  },
});

timeEnd('fsDeepWalkSync');

log(syncrslt);
```

## 安装

<!-- 标明支持的宿主、宿主版本，模块类型 -->

[![Node Version Badge][node version badge]][download node.js] ![esm][esm]

### NPM

```shell
npm add @iyowei/fs-deep-walk
```

### PNPM

```shell
pnpm add @iyowei/fs-deep-walk
```

### Yarn

```shell
yarn add @iyowei/fs-deep-walk
```

## 为什么不使用 glob？

"@iyowei/fs-deep-walk" 面对的场景与 "[fast-glob][fast-glob]" 一类非常相似。后者非常棒，只是各自适应不同的场景，对比 "@iyowei/fs-deep-walk" 的设定就会产生如下差异，

- 无法复用穷举
- 内嵌 “搜索 + 匹配”，复杂的实现势必增加体积、性能损耗
- 配置式，（glob）匹配规则等

总的来说，"[fast-glob][fast-glob]" 一类与 "@iyowei/fs-deep-walk" 的区别类似 Grunt 与 Gulp 的区别。

## 参与贡献

![PRs Welcome][prs welcome badge]

## 其它

"@iyowei/fs-deep-walk" 使用 [@iyowei/create-esm][create-esm] 脚手架生成。

[fast-glob]: https://github.com/mrmlnc/fast-glob
[node version badge]: https://img.shields.io/badge/node.js-%3E%3D12.20.0-brightgreen?style=flat&logo=Node.js
[download node.js]: https://nodejs.org/en/download/
[esm]: https://img.shields.io/badge/ESM-brightgreen?style=flat
[prs welcome badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat
[create-esm]: https://github.com/iyowei/create-esm
