
import ResultFile from '../../../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    'app',
    'ts',
    `
export default {
  "sdkVersion": "1.0.3",
  "history": "hash", // 浏览器路由：brower  哈希路由：hash
  "containerId": "app",
  "layout": {
    "componentName": "BasicLayout",
    "props": {
      "navConfig": {
        "showLanguageChange": true,
        "data": [
          {
            "hidden": false,
            "navUuid": "FORM-CP5669B1-3AW9DCLHZAY8EIY6WE6X1-GFZM3V1K-6",
            "children": [],
            "icon": "",
            "targetNew": false,
            "title": "测试基础表格",
            "inner": true,
            "relateUuid": "FORM-CP5669B1-3AW9DCLHZAY8EIY6WE6X1-GFZM3V1K-6",
            "slug": "qihfg"
          },
          {
            "hidden": false,
            "navUuid": "FORM-CP5669B1-8AW9XCUT4PCH15SMDWUM3-ZPQP3V1K-1",
            "children": [],
            "icon": "",
            "targetNew": false,
            "title": "测试查询表格",
            "inner": true,
            "relateUuid": "zqhej",
            "slug": "zqhej"
          }
        ],
        "systemLink": "/my_dev_center_code/0.1.0",
        "appName": "乐高转码demo",
        "isFoldHorizontal": "n",
        "showAppTitle": true,
        "isFold": "n",
        "searchBarType": "icon",
        "singletons": {},
        "navTheme": "default",
        "type": "top_side_fold",
        "navStyle": "orange",
        "layout": "auto",
        "bgColor": "white",
        "languageChangeUrl": "/common/account/changeAccountLanguage.json",
        "showSearch": "n",
        "openSubMode": false,
        "showCrumb": true,
        "isFixed": "y",
        "showIcon": false,
        "showNav": true
      }
    },
  },
  "theme": {
    "package": "@alife/theme-fusion",
    "version": "^0.1.0"
  },
  "compDependencies": []
}

    `,
  );

  return [['src','config'], file];
}
  