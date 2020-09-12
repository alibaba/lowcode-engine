import { ResultFile } from '@ali/lowcode-types';
import { createResultFile } from '../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    '.gitignore',
    '',
    `
node_modules/
coverage/
build/
dist/
.idea/
.vscode/
.theia/
.recore/
.Trash-*/
~*
package-lock.json

# Packages #
############
# it's better to unpack these files and commit the raw source
# git has its own built in compression methods
*.7z
*.dmg
*.gz
*.iso
*.jar
*.rar
*.tar
*.zip

# Logs and databases #
######################
*.log
*.sql
*.sqlite

# OS generated files #
######################
.DS_Store
 *.swp
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

    `,
  );

  return [[], file];
}
