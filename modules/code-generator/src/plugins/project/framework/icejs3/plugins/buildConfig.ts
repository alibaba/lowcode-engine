import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
} from '../../../../../types';
import { COMMON_CHUNK_NAME } from '../../../../../const/generator';
import { format } from '../../../../../utils/format';
import { getThemeInfo } from '../../../../../utils/theme';

export interface BuildConfigPluginConfig {

  /** 包名 */
  themePackage?: string;
}

function getContent(cfg?: BuildConfigPluginConfig, routesContent?: string) {
  return `
import { join } from 'path';
import { defineConfig } from '@ice/app';
import _ from 'lodash';
import fusion from '@ice/plugin-fusion';
import locales from '@ice/plugin-moment-locales';
import type { Plugin } from '@ice/app/esm/types';

interface PluginOptions {
  id: string;
}

const plugin: Plugin<PluginOptions> = (options) => ({
  // name 可选，插件名称
  name: 'plugin-name',
  // setup 必选，用于定制工程构建配置
  setup: ({ onGetConfig, modifyUserConfig }) => {
    modifyUserConfig('codeSplitting', 'page');

    onGetConfig((config) => {
      config.entry = {
        web: join(process.cwd(), '.ice/entry.client.tsx'),
      };

      config.cssFilename = '[name].css';

      config.configureWebpack = config.configureWebpack || [];
      config.configureWebpack?.push((webpackConfig) => {
        if (webpackConfig.output) {
          webpackConfig.output.filename = '[name].js';
          webpackConfig.output.chunkFilename = '[name].js';
        }
        return webpackConfig;
      });

      config.swcOptions = _.merge(config.swcOptions, {
        compilationConfig: {
          jsc: {
            transform: {
              react: {
                runtime: 'classic',
              },
            },
          },
        }
      });

      // 解决 webpack publicPath 问题
      config.transforms = config.transforms || [];
      config.transforms.push((source: string, id: string) => {
        if (id.includes('.ice/entry.client.tsx')) {
          let code = \`
          if (!__webpack_public_path__?.startsWith('http') && document.currentScript) {
            // @ts-ignore
            __webpack_public_path__ = document.currentScript.src.replace(/^(.*\\\\/)[^/]+$/, '$1');
            window.__ICE_ASSETS_MANIFEST__ = window.__ICE_ASSETS_MANIFEST__ || {};
            window.__ICE_ASSETS_MANIFEST__.publicPath = __webpack_public_path__;
          }
          \`;
          code += source;
          return { code };
        }
      });
    });
  },
});

// The project config, see https://v3.ice.work/docs/guide/basic/config
const minify = process.env.NODE_ENV === 'production' ? 'swc' : false;
export default defineConfig(() => ({
  ssr: false,
  ssg: false,
  minify,
  ${routesContent}
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-dom/client': 'ReactDOM',
    '@alifd/next': 'Next',
    lodash: 'var window._',
    '@alilc/lowcode-engine': 'var window.AliLowCodeEngine',
  },
  plugins: [
    fusion(${cfg?.themePackage ? `{
      importStyle: 'sass',
      themePackage: '${getThemeInfo(cfg.themePackage).name}',
    }` : `{
      importStyle: 'sass',
    }`}),
    locales(),
    plugin(),
  ]
}));
  `;
}

function getRoutesContent(navData: any, needShell = true) {
  const routes = [
    'routes: {',
    '  defineRoutes: route => {',
  ];
  function _getRoutes(nav: any, _routes: string[] = []) {
    const { slug, children } = nav;
    if (children && children.length > 0) {
      children.forEach((_nav: any) => _getRoutes(_nav, _routes));
    } else if (slug) {
      _routes.push(`route('/${slug}', '${slug}/index.jsx');`);
    }
  }
  if (needShell) {
    routes.push("    route('/', 'layout.jsx', () => {");
  }
  navData?.forEach((nav: any) => {
    _getRoutes(nav, routes);
  });
  if (needShell) {
    routes.push('    });');
  }
  routes.push('  }'); // end of defineRoutes
  routes.push('  },'); // end of routes
  return routes.join('\n');
}

const pluginFactory: BuilderComponentPluginFactory<BuildConfigPluginConfig> = (cfg?) => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const { navConfig } = next.contextData;
    const routesContent = navConfig?.data ? getRoutesContent(navConfig.data, true) : '';

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.MTS,
      name: COMMON_CHUNK_NAME.FileMainContent,
      content: format(getContent(cfg, routesContent)),
      linkAfter: [],
    });

    return next;
  };

  return plugin;
};

export default pluginFactory;
