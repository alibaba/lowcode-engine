/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import classNames from 'classnames';
import toArray from 'rc-util/lib/Children/toArray';
import ResponsiveObserve, {
  Breakpoint,
  ScreenMap,
  responsiveArray,
} from '../_util/responsiveObserve';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import Row from './Row';
import DescriptionsItem from './Item';

const DEFAULT_COLUMN_MAP: Record<Breakpoint, number> = {
  xxl: 3,
  xl: 3,
  lg: 3,
  md: 3,
  sm: 2,
  xs: 1,
};

function getColumn(column: DescriptionsProps['column'], screens: ScreenMap): number {
  if (typeof column === 'number') {
    return column;
  }

  if (typeof column === 'object') {
    for (let i = 0; i < responsiveArray.length; i++) {
      const breakpoint: Breakpoint = responsiveArray[i];
      if (screens[breakpoint] && column[breakpoint] !== undefined) {
        return column[breakpoint] || DEFAULT_COLUMN_MAP[breakpoint];
      }
    }
  }

  return 3;
}

function getFilledItem(
  node: React.ReactElement,
  span: number | undefined,
  rowRestCol: number,
): React.ReactElement {
  let clone = node;

  if (span === undefined || span > rowRestCol) {
    clone = React.cloneElement(node, {
      span: rowRestCol,
    });
    warning(
      span === undefined,
      'Descriptions',
      'Sum of column `span` in a line not match `column` of Descriptions.',
    );
  }

  return clone;
}

function getRows(children: React.ReactNode, column: number) {
  const childNodes = toArray(children).filter(n => n);
  const rows: React.ReactElement[][] = [];

  let tmpRow: React.ReactElement[] = [];
  let rowRestCol = column;

  childNodes.forEach((node, index) => {
    const span: number | undefined = node.props?.span;
    const mergedSpan = span || 1;

    // Additional handle last one
    if (index === childNodes.length - 1) {
      tmpRow.push(getFilledItem(node, span, rowRestCol));
      rows.push(tmpRow);
      return;
    }

    if (mergedSpan < rowRestCol) {
      rowRestCol -= mergedSpan;
      tmpRow.push(node);
    } else {
      tmpRow.push(getFilledItem(node, mergedSpan, rowRestCol));
      rows.push(tmpRow);
      rowRestCol = column;
      tmpRow = [];
    }
  });

  return rows;
}

export interface DescriptionsProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  bordered?: boolean;
  size?: 'middle' | 'small' | 'default';
  children?: React.ReactNode;
  title?: React.ReactNode;
  column?: number | Partial<Record<Breakpoint, number>>;
  layout?: 'horizontal' | 'vertical';
  colon?: boolean;
}

function Descriptions({
  prefixCls: customizePrefixCls,
  title,
  column = DEFAULT_COLUMN_MAP,
  colon = true,
  bordered,
  layout,
  children,
  className,
  style,
  size,
}: DescriptionsProps) {
  const { getPrefixCls, direction } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('descriptions', customizePrefixCls);
  const [screens, setScreens] = React.useState<ScreenMap>({});
  const mergedColumn = getColumn(column, screens);

  // Responsive
  React.useEffect(() => {
    const token = ResponsiveObserve.subscribe(newScreens => {
      if (typeof column !== 'object') {
        return;
      }
      setScreens(newScreens);
    });

    return () => {
      ResponsiveObserve.unsubscribe(token);
    };
  }, []);

  // Children
  const rows = getRows(children, mergedColumn);

  return (
    <div
      className={classNames(prefixCls, className, {
        [`${prefixCls}-${size}`]: size && size !== 'default',
        [`${prefixCls}-bordered`]: !!bordered,
        [`${prefixCls}-rtl`]: direction === 'rtl',
      })}
      style={style}
    >
      {title && <div className={`${prefixCls}-title`}>{title}</div>}

      <div className={`${prefixCls}-view`}>
        <table>
          <tbody>
            {rows.map((row, index) => (
              <Row
                key={index}
                index={index}
                colon={colon}
                prefixCls={prefixCls}
                vertical={layout === 'vertical'}
                bordered={bordered}
                row={row}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Descriptions.Item = DescriptionsItem;

export default Descriptions;
