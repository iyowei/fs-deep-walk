import scanDirEachSync from '@iyowei/scan-dir-each-sync';
import scanDirEach from '@iyowei/scan-dir-each';
import isTrue from '@iyowei/is-true';
import notEmptyPlainObject from '@iyowei/not-empty-plain-object';

function registerFactory() {
  return {
    files: new Set(),
    dirs: new Set(),
  };
}

function syncCrawler({ from, worker, register }) {
  scanDirEachSync(from, (cur, index) => {
    const MAPPED = worker(cur, index);

    // 保留
    if (notEmptyPlainObject(MAPPED) || isTrue(MAPPED)) {
      // 保留：寄存需要保留的文件夹
      if (cur.dirent.isDirectory()) {
        register.dirs.add(cur);

        // 继续穷举需要保留的文件夹
        syncCrawler({ from: cur.path, worker, register });

        // 阅后即焚
        return false;
      }

      // 保留：寄存需要保留的文件
      register.files.add(cur);

      // 阅后即焚
      return false;
    }

    // 阅后即焚
    return false;
  });
}

function asyncCrawler({ from, worker, register }) {
  let currentDepthFoundDirs = [];
  return new Promise((resolveParent, rejectParent) => {
    scanDirEach(from, (cur, index) => {
      const MAPPED = worker(cur, index);

      // 保留
      if (notEmptyPlainObject(MAPPED) || isTrue(MAPPED)) {
        // 保留：寄存需要保留的文件夹
        if (cur.dirent.isDirectory()) {
          register.dirs.add(cur);

          currentDepthFoundDirs.push(cur);

          // 阅后即焚
          return false;
        }

        // 保留：寄存需要保留的文件
        register.files.add(cur);

        // 阅后即焚
        return false;
      }

      // 阅后即焚
      return false;
    }).then(
      () => {
        // 继续穷举需要保留的文件夹
        if (currentDepthFoundDirs.length !== 0) {
          if (currentDepthFoundDirs.length === 1) {
            asyncCrawler({
              from: currentDepthFoundDirs[0].path,
              worker,
              register,
            }).then(
              () => {
                resolveParent();
              },
              (err) => {
                rejectParent(err);
              },
            );

            return;
          }

          Promise.all(
            currentDepthFoundDirs.map(
              (cur) =>
                new Promise((resolveChild, rejectChild) => {
                  asyncCrawler({ from: cur.path, worker, register }).then(
                    () => {
                      resolveChild();
                    },
                    (err) => {
                      rejectChild(err);
                    },
                  );
                }),
            ),
          ).then(
            () => {
              currentDepthFoundDirs = [];
              resolveParent();
            },
            (err) => {
              currentDepthFoundDirs = [];
              rejectParent(err);
            },
          );

          currentDepthFoundDirs = [];
          return;
        }

        resolveParent();
      },
      (err) => {
        rejectParent(err);
      },
    );
  });
}

export function fsDeepWalkSync({ from, worker = () => true }) {
  const REGISTER = registerFactory();
  syncCrawler({ from, worker, register: REGISTER });

  return REGISTER;
}

export function fsDeepWalk({ from, worker = () => true }) {
  const REGISTER = registerFactory();
  return new Promise((resolve, reject) => {
    asyncCrawler({ from, worker, register: REGISTER }).then(
      () => {
        resolve(REGISTER);
      },
      (err) => {
        reject(err);
      },
    );
  });
}
