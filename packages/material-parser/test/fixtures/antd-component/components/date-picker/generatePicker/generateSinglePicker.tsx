import * as React from 'react';
import classNames from 'classnames';
import CalendarOutlined from '@ant-design/icons/CalendarOutlined';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';
import CloseCircleFilled from '@ant-design/icons/CloseCircleFilled';
import RCPicker from 'rc-picker';
import { PickerMode } from 'rc-picker/lib/interface';
import { GenerateConfig } from 'rc-picker/lib/generate/index';
import enUS from '../locale/en_US';
import { getPlaceholder } from '../util';
import { ConfigContext, ConfigConsumerProps } from '../../config-provider';
import LocaleReceiver from '../../locale-provider/LocaleReceiver';
import SizeContext from '../../config-provider/SizeContext';
import {
  PickerProps,
  PickerLocale,
  PickerDateProps,
  PickerTimeProps,
  getTimeProps,
  Components,
} from '.';

export default function generatePicker<DateType>(generateConfig: GenerateConfig<DateType>) {
  type DatePickerProps = PickerProps<DateType>;

  function getPicker<InnerPickerProps extends DatePickerProps>(
    picker?: PickerMode,
    displayName?: string,
  ) {
    class Picker extends React.Component<InnerPickerProps> {
      static contextType = ConfigContext;

      static displayName: string;

      context: ConfigConsumerProps;

      pickerRef = React.createRef<RCPicker<DateType>>();

      focus = () => {
        if (this.pickerRef.current) {
          this.pickerRef.current.focus();
        }
      };

      blur = () => {
        if (this.pickerRef.current) {
          this.pickerRef.current.blur();
        }
      };

      getDefaultLocale = () => {
        const { locale } = this.props;
        const result = {
          ...enUS,
          ...locale,
        };
        result.lang = {
          ...result.lang,
          ...((locale || {}) as PickerLocale).lang,
        };
        return result;
      };

      renderPicker = (locale: PickerLocale) => {
        const { getPrefixCls, direction } = this.context;
        const {
          prefixCls: customizePrefixCls,
          className,
          size: customizeSize,
          bordered = true,
          ...restProps
        } = this.props;
        const { format, showTime } = this.props as any;
        const prefixCls = getPrefixCls('picker', customizePrefixCls);

        const additionalProps = {
          showToday: true,
        };

        let additionalOverrideProps: any = {};
        if (picker) {
          additionalOverrideProps.picker = picker;
        }
        const mergedPicker = picker || this.props.picker;

        additionalOverrideProps = {
          ...additionalOverrideProps,
          ...(showTime ? getTimeProps({ format, picker: mergedPicker, ...showTime }) : {}),
          ...(mergedPicker === 'time'
            ? getTimeProps({ format, ...this.props, picker: mergedPicker })
            : {}),
        };

        return (
          <SizeContext.Consumer>
            {size => {
              const mergedSize = customizeSize || size;

              return (
                <RCPicker<DateType>
                  ref={this.pickerRef}
                  placeholder={getPlaceholder(mergedPicker, locale)}
                  suffixIcon={
                    mergedPicker === 'time' ? <ClockCircleOutlined /> : <CalendarOutlined />
                  }
                  clearIcon={<CloseCircleFilled />}
                  allowClear
                  transitionName="slide-up"
                  {...additionalProps}
                  {...restProps}
                  {...additionalOverrideProps}
                  locale={locale!.lang}
                  className={classNames(className, {
                    [`${prefixCls}-${mergedSize}`]: mergedSize,
                    [`${prefixCls}-borderless`]: !bordered,
                  })}
                  prefixCls={prefixCls}
                  generateConfig={generateConfig}
                  prevIcon={<span className={`${prefixCls}-prev-icon`} />}
                  nextIcon={<span className={`${prefixCls}-next-icon`} />}
                  superPrevIcon={<span className={`${prefixCls}-super-prev-icon`} />}
                  superNextIcon={<span className={`${prefixCls}-super-next-icon`} />}
                  components={Components}
                  direction={direction}
                />
              );
            }}
          </SizeContext.Consumer>
        );
      };

      render() {
        return (
          <LocaleReceiver componentName="DatePicker" defaultLocale={this.getDefaultLocale}>
            {this.renderPicker}
          </LocaleReceiver>
        );
      }
    }

    if (displayName) {
      Picker.displayName = displayName;
    }

    return Picker as React.ComponentClass<InnerPickerProps>;
  }

  const DatePicker = getPicker<DatePickerProps>();
  const WeekPicker = getPicker<Omit<PickerDateProps<DateType>, 'picker'>>('week', 'WeekPicker');
  const MonthPicker = getPicker<Omit<PickerDateProps<DateType>, 'picker'>>('month', 'MonthPicker');
  const YearPicker = getPicker<Omit<PickerDateProps<DateType>, 'picker'>>('year', 'YearPicker');
  const TimePicker = getPicker<Omit<PickerTimeProps<DateType>, 'picker'>>('time', 'TimePicker');

  return { DatePicker, WeekPicker, MonthPicker, YearPicker, TimePicker };
}
