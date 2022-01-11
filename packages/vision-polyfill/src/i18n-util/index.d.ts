import { Node } from '@ali/lowcode-designer';

declare enum LANGUAGES {
  zh_CN = 'zh_CN',
  en_US = 'en_US'
}

export interface I18nRecord {
  type?: 'i18n';
  [key: string]: string;
  /**
   * i18n unique key
   */
  key?: string;
}

export interface I18nRecordData {
  gmtCreate: Date;
  gmtModified: Date;
  i18nKey: string;
  i18nText: I18nRecord;
  id: number;
}

export interface II18nUtilConfigs {
  items?: {};
  /**
   * 是否禁用初始化加载
   */
  disableInstantLoad?: boolean;
  /**
   * 初始化的时候是否全量加载
   */
  disableFullLoad?: boolean;
  loader?: (configs: ILoaderConfigs) => Promise<I18nRecordData[]>;
  remover?: (key: string, dic: I18nRecord) => Promise<void>;
  saver?: (key: string, dic: I18nRecord) => Promise<void>;
}

export interface ILoaderConfigs {
  /**
   * search keywords
   */
  keyword?: string;
  /**
   * should load all i18n items
   */
  isFull?: boolean;
  /**
   * search i18n item based on uniqueKey
   */
  key?: string;
}

export interface II18nUtil {
  init(config: II18nUtilConfigs): void;
  isInitialized(): boolean;
  isReady(): boolean;
  attach(prop: object, value: I18nRecord, updator: () => any);
  search(keyword: string, silent?: boolean);
  load(configs: ILoaderConfigs): Promise<I18nRecord[]>;
  /**
   * Get local i18n Record
   * @param key
   * @param lang
   */
  get(key: string, lang: string, info?: {
    node?: Node,
    path?: string,
  }): string | I18nRecord;
  getFromRemote(key: string): Promise<I18nRecord>;
  getItem(key: string, forceData?: boolean): any;
  getItems(): I18nRecord[];
  update(key: string, doc: I18nRecord, lang: LANGUAGES);
  create(doc: I18nRecord, lang: LANGUAGES): string;
  remove(key: string): Promise<void>;

  onReady(func: () => any);
  onRowsChange(func: () => any);
  onChange(func: (dic: I18nRecord) => any);
}

declare const i18nUtil: II18nUtil;
export default i18nUtil;
