import { dirname, join } from 'path';
import defaultExtension from '../extensions';
import {
  debug,
  IComponentMaterial,
  PropsSection,
  PropType,
} from '../otter-core';
import {
  IGenerator,
  IMaterializeOptions,
  IMaterialParsedModel,
  IMaterialScanModel,
} from '../types';

const log = debug.extend('mat');

/**
 * 用于物料工作台
 */
class Generator implements IGenerator {
  /**
   * 物料化配置项
   * @protected
   * @type {IMaterializeOptions}
   * @memberof BaseGenerator
   */
  /**
   * 物料化配置项
   * @protected
   * @type {IMaterializeOptions}
   * @memberof BaseGenerator
   */
  protected options!: IMaterializeOptions;

  constructor(options: IMaterializeOptions) {
    this.options = options;
  }

  public async generate(
    matScanModel: IMaterialScanModel,
    matParsedModels: IMaterialParsedModel[],
  ): Promise<any> {
    // const model: IMaterialinSchema = {} as any;
    // 标记协议版本号
    // model.version = '1.0.0';
    // 组装 pkgInfo
    // model.pkgInfo = pkgInfo;
    const containerList = [];
    for (const matParsedModel of matParsedModels) {
      // TODO 可以开放扩展点让上层使用者指定导出哪些组件或者不导出哪些组件
      // 默认排除掉 defaultExportName 为空的组件
      if (
        !matParsedModel.defaultExportName ||
        !matParsedModel.defaultExportName.length
      ) {
        log('skip', matParsedModel.filePath);
        continue;
      }
      // 组装 manifest
      const manifest: any = await this.genManifest(
        matScanModel,
        matParsedModel,
      );

      containerList.push(manifest);
    }

    // const components: IMaterialinComponent[] = bundle.bundleObj.components;
    // Object.keys(bundle.bundleObj.Modules).forEach(key => {
    //   const { origin, manifest } = bundle.bundleObj.Modules[key];
    //   const component: IMaterialinComponent = {
    //     componentName: key,
    //     origin,
    //     manifest,
    //   };
    //   components.push(component);
    // });
    // model.components = components;
    // log('materialsModel', JSON.stringify(bundle.bundleObj));

    return containerList;
  }

  /**
   * 生成 manifest
   *
   * @param {IMaterialParsedModel} matParsedModel
   * @returns {Promise<{
   *     manifestFilePath: string, // manifest 文件路径
   *     manifestJS: string, // manifest 文件内容
   *     manifestObj: IMaterialinManifest, // manifest 文件对象
   *   }>}
   * @memberof LocalGenerator
   */
  public async genManifest(
    matScanModel: IMaterialScanModel,
    matParsedModel: IMaterialParsedModel,
  ): Promise<{
    manifestFilePath: string; // manifest 文件路径
    manifestJS: string; // manifest 文件内容
    manifestObj: IComponentMaterial; // manifest 文件对象
  }> {
    const manifestObj: Partial<IComponentMaterial> = {
      componentName: matParsedModel.defaultExportName,
      title: '',
      docUrl: '',
      screenshot: '',
      npm: {
        package: matScanModel.pkgName,
        version: matScanModel.pkgVersion,
        exportName: matParsedModel.defaultExportName,
        main: matScanModel.mainEntry,
        destructuring: false,
        subName: '',
      },
    };

    const defaultManifestFilePath = join(
      dirname(matParsedModel.filePath),
      './manifest.js',
    );

    // 填充 props
    manifestObj.props = this.populateProps(matParsedModel);
    // 执行扩展点
    const manifest: any = await this.executeExtensionPoint(
      'mat:config:manifest',
      {
        manifestObj,
        manifestFilePath: defaultManifestFilePath,
      },
    );
    return {
      manifestJS: manifest.manifestJS,
      manifestObj: manifest.manifestObj,
      manifestFilePath: manifest.manifestFilePath,
    };
  }

  /**
   * 填充 props
   *
   * @public
   * @param {IMaterialParsedModel} matParsedModel
   * @returns {IMaterialinProp[]}
   * @memberof BaseGenerator
   */
  public populateProps(
    matParsedModel: IMaterialParsedModel,
  ): PropsSection['props'] {
    // 填充 props
    const props: PropsSection['props'] = [];
    matParsedModel.propsTypes.forEach(item => {
      const defaultValueItem = matParsedModel.propsDefaults.find(
        inner => inner.name === item.name,
      );
      props.push({
        name: item.name,
        propType: item.type as PropType,
        description: '',
        defaultValue: defaultValueItem
          ? defaultValueItem.defaultValue
          : undefined,
      });
    });

    return props;
  }

  /**
   * 执行扩展点
   * @param {string} extName 扩展点名称
   * @param {...any[]} args 参数
   * @returns {Promise<any>}
   * @memberof BaseGenerator
   */
  public async executeExtensionPoint(
    extName: string,
    ...args: any[]
  ): Promise<any> {
    const options = this.options;
    const optionsExtensions: any = options.extensions;
    const defaultExtensions: any = defaultExtension;

    const ext: any =
      optionsExtensions && optionsExtensions[extName]
        ? optionsExtensions[extName]
        : defaultExtensions[extName];
    if (!ext) {
      throw new Error(`Unsupported extension point: ${extName}`);
    }
    return ext(...args);
  }
}

export default Generator;
