import { log, time, timeEnd } from 'console';
import { fsDeepWalkSync, fsDeepWalk } from './index.js';

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

(async () => {
  time('fsDeepWalk');

  const asyncrslt = await fsDeepWalk({
    from: process.cwd(),
    worker: (cur) => {
      const excludeDirs = ['.git', 'node_modules'];

      if (cur.dirent.isDirectory() && excludeDirs.includes(cur.dirent.name)) {
        return false;
      }

      return true;
    },
  });

  timeEnd('fsDeepWalk');

  log(asyncrslt);
})();
