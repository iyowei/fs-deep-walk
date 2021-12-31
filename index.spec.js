import assert from 'assert';
import { fsDeepWalkSync, fsDeepWalk } from './index.js';

describe('@iyowei/fs-deep-walk', () => {
  it('同步', () => {
    const { files } = fsDeepWalkSync({
      from: process.cwd(),
      worker: (cur) => {
        const excludeDirs = ['.git', 'node_modules'];

        if (cur.dirent.isDirectory() && excludeDirs.includes(cur.dirent.name)) {
          return false;
        }

        return true;
      },
    });

    assert.equal(Array.from(files).length > 0, true);
  });

  it('异步', async () => {
    const { files } = await fsDeepWalk({
      from: process.cwd(),
      worker: (cur) => {
        const excludeDirs = ['.git', 'node_modules'];

        if (cur.dirent.isDirectory() && excludeDirs.includes(cur.dirent.name)) {
          return false;
        }

        return true;
      },
    });

    assert.equal(Array.from(files).length > 0, true);
  });
});
