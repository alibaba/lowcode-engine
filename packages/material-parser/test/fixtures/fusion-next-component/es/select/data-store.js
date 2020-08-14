import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import { filter, parseDataSourceFromChildren, normalizeDataSource, flattingDataSource, filterDataSource } from './util';

/**
 * manage dataSource for menu list
 */

var DataStore = function () {
    function DataStore(options) {
        _classCallCheck(this, DataStore);

        this.options = _extends({
            filter: filter,
            key: undefined,
            addonKey: false,
            filterLocal: true
        }, options);

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

    DataStore.prototype.setOptions = function setOptions(options) {
        _extends(this.options, options);
    };

    DataStore.prototype.updateByDS = function updateByDS(dataSource) {
        var isChildren = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        this.dataSource = isChildren ? parseDataSourceFromChildren(dataSource) : normalizeDataSource(dataSource);
        return this.updateAll();
    };

    DataStore.prototype.updateByKey = function updateByKey(key) {
        if (key === this.options.key) {
            return this.getMenuDS();
        }

        this.options.key = key;
        return this.updateAll();
    };

    DataStore.prototype.getOriginDS = function getOriginDS() {
        return this.dataSource;
    };

    DataStore.prototype.getMenuDS = function getMenuDS() {
        return this.menuDataSource;
    };

    DataStore.prototype.getFlattenDS = function getFlattenDS() {
        return this.flattenDataSource;
    };

    DataStore.prototype.getEnableDS = function getEnableDS() {
        return this.enabledDataSource;
    };

    DataStore.prototype.getMapDS = function getMapDS() {
        return this.mapDataSource;
    };

    DataStore.prototype.updateAll = function updateAll() {
        var _this = this;

        var _options = this.options,
            key = _options.key,
            filter = _options.filter,
            filterLocal = _options.filterLocal;

        this.menuDataSource = filterDataSource(this.dataSource, filterLocal ? key : '', filter, this.options.addonKey);

        this.flattenDataSource = flattingDataSource(this.menuDataSource);

        this.mapDataSource = {};
        this.flattenDataSource.forEach(function (item) {
            _this.mapDataSource['' + item.value] = item;
        });

        this.enabledDataSource = this.flattenDataSource.filter(function (item) {
            return !item.disabled;
        });

        return this.menuDataSource;
    };

    return DataStore;
}();

export default DataStore;