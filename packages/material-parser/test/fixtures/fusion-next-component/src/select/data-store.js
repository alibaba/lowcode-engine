import {
    filter,
    parseDataSourceFromChildren,
    normalizeDataSource,
    flattingDataSource,
    filterDataSource,
} from './util';

/**
 * manage dataSource for menu list
 */
class DataStore {
    constructor(options) {
        this.options = {
            filter,
            key: undefined,
            addonKey: false,
            filterLocal: true,
            ...options,
        };

        // origin data
        this.dataSource = [];
        // current data for menu display
        this.menuDataSource = [];
        // key=>value map for menuDataSource
        this.mapDataSource = {};
        // current data can be select (not disabled) on menu
        this.enabledDataSource = [];
        this.flattenDataSource = [];
    }

    setOptions(options) {
        Object.assign(this.options, options);
    }

    updateByDS(dataSource, isChildren = false) {
        this.dataSource = isChildren
            ? parseDataSourceFromChildren(dataSource)
            : normalizeDataSource(dataSource);
        return this.updateAll();
    }

    updateByKey(key) {
        if (key === this.options.key) {
            return this.getMenuDS();
        }

        this.options.key = key;
        return this.updateAll();
    }

    getOriginDS() {
        return this.dataSource;
    }

    getMenuDS() {
        return this.menuDataSource;
    }

    getFlattenDS() {
        return this.flattenDataSource;
    }

    getEnableDS() {
        return this.enabledDataSource;
    }

    getMapDS() {
        return this.mapDataSource;
    }

    updateAll() {
        const { key, filter, filterLocal } = this.options;
        this.menuDataSource = filterDataSource(
            this.dataSource,
            filterLocal ? key : '',
            filter,
            this.options.addonKey
        );

        this.flattenDataSource = flattingDataSource(this.menuDataSource);

        this.mapDataSource = {};
        this.flattenDataSource.forEach(item => {
            this.mapDataSource[`${item.value}`] = item;
        });

        this.enabledDataSource = this.flattenDataSource.filter(
            item => !item.disabled
        );

        return this.menuDataSource;
    }
}

export default DataStore;
