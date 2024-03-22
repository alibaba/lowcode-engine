import * as fs from 'node:fs';
import * as path from 'node:path';
import * as glob from 'fast-glob';
import matter from 'gray-matter';

export default function getDocsFromDir(dir: string, cateList: any[] = []) {
  // docs/
  const baseDir = path.join(__dirname, '../docs/');
  const docsDir = path.join(baseDir, dir);

  function isNil(value) {
    return value === undefined || value === null;
  }

  function getMarkdownOrder(filepath) {
    const { data } = matter(fs.readFileSync(filepath, 'utf-8'));
    const { sidebar_position } = data || {};
    return isNil(sidebar_position) ? 100 : sidebar_position;
  }

  const docs = glob.sync('*.md?(x)', {
    cwd: docsDir,
    // ignore: 'README.md',
  });

  const result = docs
    .filter((doc) => !/^index.md(x)?$/.test(doc))
    .map((doc) => {
      return path.join(docsDir, doc);
    })
    .sort((a, b) => {
      const orderA = getMarkdownOrder(a);
      const orderB = getMarkdownOrder(b);

      return orderA - orderB;
    })
    .map((filepath) => {
      // /Users/xxx/site/docs/guide/basic/router.md => guide/basic/router
      const id = path
        .relative(baseDir, filepath)
        .replace(/\\/g, '/')
        .replace(/\.mdx?/, '');
      return id;
    });

  cateList.forEach((item) => {
    const { dir, subCategory, ...otherConfig } = item;
    const indexList = glob.sync('index.md?(x)', {
      cwd: path.join(baseDir, dir),
    });
    if (indexList.length > 0) {
      otherConfig.link = {
        type: 'doc',
        id: `${dir}/index`,
      };
    }
    result.push({
      type: 'category',
      collapsed: false,
      ...otherConfig,
      items: getDocsFromDir(dir, subCategory),
    });
  });

  return result;
}
