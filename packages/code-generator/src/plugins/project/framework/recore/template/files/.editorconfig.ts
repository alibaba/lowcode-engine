
import ResultFile from '../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    '.editorconfig',
    '',
    `
# EditorConfig is awesome: http://EditorConfig.org

# top-most EditorConfig file
root = true

# Tab indentation
[*]
charset = utf-8
end_of_line = lf
indent_size = 2
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

    `,
  );

  return [[], file];
}
  