/**
 * 扩展点名称
 */
enum ExtensionName {
  /** 加载物料 */
  LOADMATERIALS = 'mat:load:materials',
  /** 配置 manifest */
  CONFIGMANIFEST = 'mat:config:manifest',
  /** 获取打包后的 bundle */
  BUILDBUNDLE = 'mat:build:bundle',
  /** 配置 containerJS */
  CONFIGCONTAINER = 'mat:config:container',
  /** 生成 buildJS */
  GENERATEBUILDJS = 'mat:generate:buildjs',
}

export default ExtensionName;
