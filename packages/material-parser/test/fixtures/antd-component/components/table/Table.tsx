import * as React from 'react';
import classNames from 'classnames';
import omit from 'omit.js';
import RcTable from 'rc-table';
import { TableProps as RcTableProps, INTERNAL_HOOKS } from 'rc-table/lib/Table';
import Spin, { SpinProps } from '../spin';
import Pagination, { PaginationConfig } from '../pagination';
import { ConfigContext } from '../config-provider/context';
import usePagination, { DEFAULT_PAGE_SIZE, getPaginationParam } from './hooks/usePagination';
import useLazyKVMap from './hooks/useLazyKVMap';
import {
  TableRowSelection,
  GetRowKey,
  ColumnsType,
  TableCurrentDataSource,
  SorterResult,
  Key,
  GetPopupContainer,
  ExpandableConfig,
  ExpandType,
  TablePaginationConfig,
  SortOrder,
  TableLocale,
} from './interface';
import useSelection, { SELECTION_ALL, SELECTION_INVERT } from './hooks/useSelection';
import useSorter, { getSortData, SortState } from './hooks/useSorter';
import useFilter, { getFilterData, FilterState } from './hooks/useFilter';
import useTitleColumns from './hooks/useTitleColumns';
import renderExpandIcon from './ExpandIcon';
import scrollTo from '../_util/scrollTo';
import defaultLocale from '../locale/en_US';
import SizeContext, { SizeType } from '../config-provider/SizeContext';
import Column from './Column';
import ColumnGroup from './ColumnGroup';
import warning from '../_util/warning';

export { ColumnsType, TablePaginationConfig };

const EMPTY_LIST: any[] = [];

interface ChangeEventInfo<RecordType> {
  pagination: {
    current?: number;
    pageSize?: number;
    total?: number;
  };
  filters: Record<string, Key[] | null>;
  sorter: SorterResult<RecordType> | SorterResult<RecordType>[];

  filterStates: FilterState<RecordType>[];
  sorterStates: SortState<RecordType>[];

  resetPagination: Function;
}

export interface TableProps<RecordType>
  extends Omit<
    RcTableProps<RecordType>,
    'transformColumns' | 'internalHooks' | 'internalRefs' | 'data' | 'columns' | 'scroll'
  > {
  dropdownPrefixCls?: string;
  dataSource?: RcTableProps<RecordType>['data'];
  columns?: ColumnsType<RecordType>;
  pagination?: false | TablePaginationConfig;
  loading?: boolean | SpinProps;
  size?: SizeType;
  bordered?: boolean;
  locale?: TableLocale;

  onChange?: (
    pagination: PaginationConfig,
    filters: Record<string, Key[] | null>,
    sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
    extra: TableCurrentDataSource<RecordType>,
  ) => void;
  rowSelection?: TableRowSelection<RecordType>;

  getPopupContainer?: GetPopupContainer;
  scroll?: RcTableProps<RecordType>['scroll'] & {
    scrollToFirstRowOnChange?: boolean;
  };
  sortDirections?: SortOrder[];
  showSorterTooltip?: boolean;
}

function Table<RecordType extends object = any>(props: TableProps<RecordType>) {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    size: customizeSize,
    bordered,
    dropdownPrefixCls: customizeDropdownPrefixCls,
    dataSource,
    pagination,
    rowSelection,
    rowKey,
    rowClassName,
    columns,
    children,
    childrenColumnName: legacyChildrenColumnName,
    onChange,
    getPopupContainer,
    loading,
    expandIcon,
    expandable,
    expandedRowRender,
    expandIconColumnIndex,
    indentSize,
    scroll,
    sortDirections,
    locale,
    showSorterTooltip = true,
  } = props;

  const tableProps = omit(props, ['className', 'style']) as TableProps<RecordType>;

  const size = React.useContext(SizeContext);
  const { locale: contextLocale = defaultLocale, renderEmpty, direction } = React.useContext(
    ConfigContext,
  );
  const mergedSize = customizeSize || size;
  const tableLocale = { ...contextLocale.Table, ...locale } as TableLocale;
  const rawData: RecordType[] = dataSource || EMPTY_LIST;

  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('table', customizePrefixCls);
  const dropdownPrefixCls = getPrefixCls('dropdown', customizeDropdownPrefixCls);

  const mergedExpandable: ExpandableConfig<RecordType> = {
    childrenColumnName: legacyChildrenColumnName,
    expandIconColumnIndex,
    ...expandable,
  };
  const { childrenColumnName = 'children' } = mergedExpandable;

  const expandType: ExpandType = React.useMemo<ExpandType>(() => {
    if (rawData.some(item => (item as any)[childrenColumnName])) {
      return 'nest';
    }

    if (expandedRowRender || (expandable && expandable.expandedRowRender)) {
      return 'row';
    }

    return null;
  }, [rawData]);

  const internalRefs = {
    body: React.useRef<HTMLDivElement>(),
  };

  // ============================ RowKey ============================
  const getRowKey = React.useMemo<GetRowKey<RecordType>>(() => {
    if (typeof rowKey === 'function') {
      return rowKey;
    }

    return (record: RecordType) => (record as any)[rowKey as string];
  }, [rowKey]);

  const [getRecordByKey] = useLazyKVMap(rawData, childrenColumnName, getRowKey);

  // ============================ Events =============================
  const changeEventInfo: Partial<ChangeEventInfo<RecordType>> = {};

  const triggerOnChange = (info: Partial<ChangeEventInfo<RecordType>>, reset: boolean = false) => {
    const changeInfo = {
      ...changeEventInfo,
      ...info,
    };

    if (reset) {
      changeEventInfo.resetPagination!();

      // Reset event param
      if (changeInfo.pagination!.current) {
        changeInfo.pagination!.current = 1;
      }

      // Trigger pagination events
      if (pagination && pagination.onChange) {
        pagination.onChange(1, changeInfo.pagination!.pageSize);
      }
    }

    if (scroll && scroll.scrollToFirstRowOnChange !== false && internalRefs.body.current) {
      scrollTo(0, {
        getContainer: () => internalRefs.body.current!,
      });
    }

    if (onChange) {
      onChange(changeInfo.pagination!, changeInfo.filters!, changeInfo.sorter!, {
        currentDataSource: getFilterData(
          getSortData(rawData, changeInfo.sorterStates!, childrenColumnName),
          changeInfo.filterStates!,
        ),
      });
    }
  };

  /**
   * Controlled state in `columns` is not a good idea that makes too many code (1000+ line?)
   * to read state out and then put it back to title render.
   * Move these code into `hooks` but still too complex.
   * We should provides Table props like `sorter` & `filter` to handle control in next big version.
   */

  // ============================ Sorter =============================
  const onSorterChange = (
    sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
    sorterStates: SortState<RecordType>[],
  ) => {
    triggerOnChange(
      {
        sorter,
        sorterStates,
      },
      false,
    );
  };
  const [transformSorterColumns, sortStates, sorterTitleProps, getSorters] = useSorter<RecordType>({
    prefixCls,
    columns,
    children,
    onSorterChange,
    sortDirections: sortDirections || ['ascend', 'descend'],
    tableLocale,
    showSorterTooltip,
  });
  const sortedData = React.useMemo(() => getSortData(rawData, sortStates, childrenColumnName), [
    rawData,
    sortStates,
  ]);

  changeEventInfo.sorter = getSorters();
  changeEventInfo.sorterStates = sortStates;

  // ============================ Filter ============================
  const onFilterChange = (
    filters: Record<string, Key[]>,
    filterStates: FilterState<RecordType>[],
  ) => {
    triggerOnChange(
      {
        filters,
        filterStates,
      },
      true,
    );
  };

  const [transformFilterColumns, filterStates, getFilters] = useFilter<RecordType>({
    prefixCls,
    locale: tableLocale,
    dropdownPrefixCls,
    columns,
    children,
    onFilterChange,
    getPopupContainer,
  });
  const mergedData = getFilterData(sortedData, filterStates);

  changeEventInfo.filters = getFilters();
  changeEventInfo.filterStates = filterStates;

  // ============================ Column ============================
  const columnTitleProps = React.useMemo(
    () => ({
      ...sorterTitleProps,
    }),
    [sorterTitleProps],
  );
  const [transformTitleColumns] = useTitleColumns(columnTitleProps);

  // ========================== Pagination ==========================
  const onPaginationChange = (current: number, pageSize: number) => {
    triggerOnChange({
      pagination: { ...changeEventInfo.pagination, current, pageSize },
    });
  };

  const [mergedPagination, resetPagination] = usePagination(
    mergedData.length,
    pagination,
    onPaginationChange,
  );

  changeEventInfo.pagination =
    pagination === false ? {} : getPaginationParam(pagination, mergedPagination);

  changeEventInfo.resetPagination = resetPagination;

  // ============================= Data =============================
  const pageData = React.useMemo<RecordType[]>(() => {
    if (pagination === false || !mergedPagination.pageSize) {
      return mergedData;
    }

    const { current = 1, total, pageSize = DEFAULT_PAGE_SIZE } = mergedPagination;

    // Dynamic table data
    if (mergedData.length < total!) {
      if (mergedData.length > pageSize) {
        warning(
          false,
          'Table',
          '`dataSource` length is less than `pagination.total` but large than `pagination.pageSize`. Please make sure your config correct data with async mode.',
        );
        return mergedData.slice((current - 1) * pageSize, current * pageSize);
      }
      return mergedData;
    }

    const currentPageData = mergedData.slice((current - 1) * pageSize, current * pageSize);
    return currentPageData;
  }, [
    !!pagination,
    mergedData,
    mergedPagination && mergedPagination.current,
    mergedPagination && mergedPagination.pageSize,
    mergedPagination && mergedPagination.total,
  ]);

  // ========================== Selections ==========================
  const [transformSelectionColumns, selectedKeySet] = useSelection<RecordType>(rowSelection, {
    prefixCls,
    data: mergedData,
    pageData,
    getRowKey,
    getRecordByKey,
    expandType,
    childrenColumnName,
    locale: tableLocale,
    expandIconColumnIndex: mergedExpandable.expandIconColumnIndex,
    getPopupContainer,
  });

  const internalRowClassName = (record: RecordType, index: number, indent: number) => {
    let mergedRowClassName;
    if (typeof rowClassName === 'function') {
      mergedRowClassName = classNames(rowClassName(record, index, indent));
    } else {
      mergedRowClassName = classNames(rowClassName);
    }

    return classNames(
      {
        [`${prefixCls}-row-selected`]: selectedKeySet.has(getRowKey(record, index)),
      },
      mergedRowClassName,
    );
  };

  // ========================== Expandable ==========================

  // Pass origin render status into `rc-table`, this can be removed when refactor with `rc-table`
  (mergedExpandable as any).__PARENT_RENDER_ICON__ = mergedExpandable.expandIcon;

  // Customize expandable icon
  mergedExpandable.expandIcon =
    mergedExpandable.expandIcon || expandIcon || renderExpandIcon(tableLocale!);

  // Adjust expand icon index, no overwrite expandIconColumnIndex if set.
  if (expandType === 'nest' && mergedExpandable.expandIconColumnIndex === undefined) {
    mergedExpandable.expandIconColumnIndex = rowSelection ? 1 : 0;
  } else if (mergedExpandable.expandIconColumnIndex! > 0 && rowSelection) {
    mergedExpandable.expandIconColumnIndex! -= 1;
  }

  // Indent size
  mergedExpandable.indentSize = mergedExpandable.indentSize || indentSize || 15;

  // ============================ Render ============================
  const transformColumns = React.useCallback(
    (innerColumns: ColumnsType<RecordType>): ColumnsType<RecordType> => {
      return transformTitleColumns(
        transformSelectionColumns(transformFilterColumns(transformSorterColumns(innerColumns))),
      );
    },
    [transformSorterColumns, transformFilterColumns, transformSelectionColumns],
  );

  let topPaginationNode: React.ReactNode;
  let bottomPaginationNode: React.ReactNode;
  if (pagination !== false) {
    let paginationSize: PaginationConfig['size'];
    if (mergedPagination.size) {
      paginationSize = mergedPagination.size;
    } else {
      paginationSize = mergedSize === 'small' || mergedSize === 'middle' ? 'small' : undefined;
    }

    const renderPagination = (position: string = 'right') => (
      <Pagination
        className={`${prefixCls}-pagination ${prefixCls}-pagination-${position}`}
        {...mergedPagination}
        size={paginationSize}
      />
    );
    if (mergedPagination.position !== null && Array.isArray(mergedPagination.position)) {
      const topPos = mergedPagination.position.find(p => p.indexOf('top') !== -1);
      const bottomPos = mergedPagination.position.find(p => p.indexOf('bottom') !== -1);
      if (!topPos && !bottomPos) {
        bottomPaginationNode = renderPagination();
      } else {
        if (topPos) {
          topPaginationNode = renderPagination(topPos!.toLowerCase().replace('top', ''));
        }
        if (bottomPos) {
          bottomPaginationNode = renderPagination(bottomPos!.toLowerCase().replace('bottom', ''));
        }
      }
    } else {
      bottomPaginationNode = renderPagination();
    }
  }

  // >>>>>>>>> Spinning
  let spinProps: SpinProps | undefined;
  if (typeof loading === 'boolean') {
    spinProps = {
      spinning: loading,
    };
  } else if (typeof loading === 'object') {
    spinProps = {
      spinning: true,
      ...loading,
    };
  }

  const wrapperClassNames = classNames(`${prefixCls}-wrapper`, className, {
    [`${prefixCls}-wrapper-rtl`]: direction === 'rtl',
  });
  return (
    <div className={wrapperClassNames} style={style}>
      <Spin spinning={false} {...spinProps}>
        {topPaginationNode}
        <RcTable<RecordType>
          {...tableProps}
          direction={direction}
          expandable={mergedExpandable}
          prefixCls={prefixCls}
          className={classNames({
            [`${prefixCls}-middle`]: mergedSize === 'middle',
            [`${prefixCls}-small`]: mergedSize === 'small',
            [`${prefixCls}-bordered`]: bordered,
          })}
          data={pageData}
          rowKey={getRowKey}
          rowClassName={internalRowClassName}
          emptyText={(locale && locale.emptyText) || renderEmpty('Table')}
          // Internal
          internalHooks={INTERNAL_HOOKS}
          internalRefs={internalRefs as any}
          transformColumns={transformColumns}
        />
        {pageData && pageData.length > 0 && bottomPaginationNode}
      </Spin>
    </div>
  );
}

Table.defaultProps = {
  rowKey: 'key',
};

Table.SELECTION_ALL = SELECTION_ALL;
Table.SELECTION_INVERT = SELECTION_INVERT;
Table.Column = Column;
Table.ColumnGroup = ColumnGroup;

export default Table;
