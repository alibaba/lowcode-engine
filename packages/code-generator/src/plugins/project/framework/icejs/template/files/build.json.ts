import { ResultFile } from '@ali/lowcode-types';

export default function getFile(): [string[], ResultFile] {
  return [
    [],
    {
      name: 'build',
      ext: 'json',
      content: `
{
  "entry": "src/app.js",
  "plugins": [
    [
      "build-plugin-fusion",
      {
        "themePackage": "@alifd/theme-design-pro"
      }
    ],
    [
      "build-plugin-moment-locales",
      {
        "locales": [
          "zh-cn"
        ]
      }
    ],
    "@ali/build-plugin-ice-def"
  ]
}
      `,
    },
  ];
}
