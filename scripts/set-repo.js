#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');

(async () => {
    const root = path.join(__dirname, '../');
    const workspaces = ['modules', 'packages'];
    for (const workspace of workspaces) {
        const pkgDir = path.join(root, workspace);
        const pkgs = await fs.readdir(pkgDir);
        for (const pkg of pkgs) {
            if (pkg.charAt(0) === '.') continue;
            if (!(await fs.statSync(path.join(pkgDir, pkg))).isDirectory()) continue;
            await setRepo({
                workspace,
                pkgDir,
                pkg,
            });
        }
    }

    async function setRepo(opts) {
        const pkgDir = path.join(opts.pkgDir, opts.pkg);
        if (!fs.existsSync(path.join(pkgDir, 'package.json'))) {
            console.log(`${opts.pkg} exists`);
        } else {
            const pkgPkgJSONPath = path.join(pkgDir, 'package.json');
            const hasPkgJSON = fs.existsSync(pkgPkgJSONPath);
            const pkgPkgJSON = hasPkgJSON ? require(pkgPkgJSONPath) : {};
            fs.writeJSONSync(
                pkgPkgJSONPath,
                Object.assign(pkgPkgJSON, {
                    repository: {
                        type: 'http',
                        url: `https://github.com/alibaba/lowcode-engine/tree/main/${opts.workspace}/${opts.pkg}`,
                    },
                    bugs: 'https://github.com/alibaba/lowcode-engine/issues',
                    homepage: `https://github.com/alibaba/lowcode-engine/tree/main/${opts.workspace}/${opts.pkg}#readme`,
                }),
                { spaces: '  ' },
            );
        }
    }
})();
