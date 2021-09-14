import Icons from '@ali/ve-icons';
import classNames from 'classnames';
import { Component } from 'react';
import { testType } from '@ali/ve-utils';
import VEField, { IVEFieldProps } from './field';
import { SettingField } from './setting-field';
import VariableSwitcher from './variable-switcher';
import popups from '@ali/ve-popups';

import './fields.less';

interface IHelpTip {
  url?: string;
  content?: string | JSX.Element;
}

function renderTip(tip: IHelpTip, prop?: { propName?: string }) {
  const propName = prop && prop.propName;
  if (!tip) {
    return (
      <Icons.Tip position="top" key="icon" className="engine-field-tip-icon">
        <div>
          <div>{propName}</div>
        </div>
      </Icons.Tip>
    );
  }
  if (testType(tip) === 'object') {
    return (
      <Icons.Tip position="top" url={tip.url} key="icon-tip" className="engine-field-tip-icon">
        <div>
          <div>属性：{propName}</div>
          <div>说明：{tip.content}</div>
        </div>
      </Icons.Tip>
    );
  }
  return (
    <Icons.Tip position="top" key="icon" className="engine-field-tip-icon">
      <div>
        <div>属性：{propName}</div>
        <div>说明：{tip}</div>
      </div>
    </Icons.Tip>
  );
}

export class PlainField extends VEField {
  public static defaultProps = {
    headDIY: true,
  };

  public static displayName = 'PlainField';

  public renderHead(): null {
    return null;
  }
}

export class InlineField extends VEField {
  public static displayName = 'InlineField';

  constructor(props: any) {
    super(props);
    this.classNames = ['engine-setting-field', 'engine-inline-field'];
  }

  public renderFoot() {
    return (
      <div className="engine-field-variable-wrapper">
        <VariableSwitcher {...this.props} />
      </div>
    );
  }
}

export class BlockField extends VEField {
  public static displayName = 'BlockField';

  constructor(props: IVEFieldProps) {
    super(props);
    this.classNames = ['engine-setting-field', 'engine-block-field', props.isGroup ? 'engine-group-field' : ''];
  }

  public renderHead() {
    const { title, tip, propName } = this.props;
    return [
      <span className="engine-field-title" key={title}>
        {title}
      </span>,
      renderTip(tip, { propName }),
      <VariableSwitcher {...this.props} />,
    ];
  }
}

export class AccordionField extends VEField {
  public readonly props: IVEFieldProps;

  private willDetach?: () => any;

  constructor(props: IVEFieldProps) {
    super(props);
    this._generateClassNames(props);
    if (props.onExpandChange) {
      this.willDetach = props.onExpandChange(() => this.forceUpdate());
    }
  }

  public componentWillReceiveProps(nextProps: IVEFieldProps) {
    this.classNames = this._generateClassNames(nextProps);
  }

  public componentWillUnmount() {
    if (this.willDetach) {
      this.willDetach();
    }
  }

  public renderHead() {
    const { title, tip, toggleExpand, propName } = this.props;
    return (
      <div className="engine-field-head" onClick={() => toggleExpand && toggleExpand()}>
        <Icons name="arrow" className="engine-field-arrow" size="12px" />
        <span className="engine-field-title">{title}</span>
        {renderTip(tip, { propName })}
        {<VariableSwitcher {...this.props} />}
      </div>
    );
  }

  private _generateClassNames(props: IVEFieldProps) {
    this.classNames = [
      'engine-setting-field',
      'engine-accordion-field',
      props.isGroup ? 'engine-group-field' : '',
      !props.isExpand ? 'engine-collapsed' : '',
    ];
    return this.classNames;
  }
}

export class EntryField extends VEField {
  constructor(props: any) {
    super(props);
    this.classNames = ['engine-setting-field', 'engine-entry-field'];
  }

  public render() {
    const { propName, stageName, tip, title } = this.props;
    const classNameList = classNames(...this.classNames, this.props.className);
    const fieldProps: any = {};

    if (stageName) {
      // 为 stage 切换奠定基础
      fieldProps['data-stage-target'] = this.props.stageName;
    }

    const innerElements = [
      <span className="engine-field-title" key="field-title">
        {title}
      </span>,
      renderTip(tip, { propName }),
      <Icons name="arrow" className="engine-field-arrow" size="12px" key="engine-field-arrow-icon" />,
    ];

    return (
      <div className={classNameList} {...fieldProps}>
        {innerElements}
      </div>
    );
  }
}

export class PopupField extends VEField {
  constructor(props: any) {
    super(props);
    this.classNames = ['engine-setting-field', 'engine-popup-field'];
  }

  public renderBody() {
    return '';
  }

  public render() {
    const { propName, stageName, tip, title } = this.props;
    const classNameList = classNames(...this.classNames, this.props.className);
    const fieldProps: any = {};

    if (stageName) {
      // 为 stage 切换奠定基础
      fieldProps['data-stage-target'] = this.props.stageName;
    }

    return (
      <div
        className={classNameList}
        onClick={(e) => popups.popup({
          cancelOnBlur: true,
          content: this.props.children,
          position: 'left bottom',
          showClose: true,
          sizeFixed: true,
          target: e.currentTarget,
        })
        }
      >
        <span className="engine-field-title">{title}</span>
        {renderTip(tip, { propName })}
        <VariableSwitcher {...this.props} />
        <Icons name="popup" className="engine-field-icon" size="medium" />
      </div>
    );
  }
}

export class CaptionField extends VEField {
  constructor(props: IVEFieldProps) {
    super(props);
    this.classNames = ['engine-setting-field', 'engine-caption-field'];
  }

  public renderHead() {
    const { title, tip, propName } = this.props;
    return (
      <div>
        <span className="engine-field-title">{title}</span>
        {renderTip(tip, { propName })}
      </div>
    );
  }
}

export class Stage extends Component {
  public readonly props: {
    key: any;
    stage: any;
    current?: boolean;
    direction?: any;
  };

  public stage: any;

  public additionClassName: string;

  public shell: Element | null = null;

  private willDetach: () => any;

  public componentWillMount() {
    this.stage = this.props.stage;
    if (this.stage.onCurrentTabChange) {
      this.willDetach = this.stage.onCurrentTabChange(() => this.forceUpdate());
    }
  }

  public componentDidMount() {
    this.doSkate();
  }

  public componentWillReceiveProps(props: any) {
    if (props.stage !== this.stage) {
      this.stage = props.stage;
      if (this.willDetach) {
        this.willDetach();
      }
      if (this.stage.onCurrentTabChange) {
        this.willDetach = this.stage.onCurrentTabChange(() => this.forceUpdate());
      }
    }
  }

  public componentDidUpdate() {
    this.doSkate();
  }

  public componentWillUnmount() {
    if (this.willDetach) {
      this.willDetach();
    }
  }

  public doSkate() {
    if (this.additionClassName) {
      setTimeout(() => {
        const elem = this.shell;
        if (elem && elem.classList) {
          if (this.props.current) {
            elem.classList.remove(this.additionClassName);
          } else {
            elem.classList.add(this.additionClassName);
          }
          this.additionClassName = '';
        }
      }, 10);
    }
  }

  public render() {
    const { stage } = this;
    let content = null;
    let tabs = null;

    let className = 'engine-settings-stage';

    if (stage.getTabs) {
      const selected = stage.getNode();
      // stat for cache
      stage.stat();
      const currentTab = stage.getCurrentTab();

      if (stage.hasTabs()) {
        className += ' engine-has-tabs';
        tabs = (
          <div className="engine-settings-tabs">
            {stage.getTabs().map((tab: any) => (
              <div
                key={tab.getId()}
                className={`engine-settings-tab${tab === currentTab ? ' engine-active' : ''}`}
                onClick={() => stage.setCurrentTab(tab)}
              >
                {tab.getTitle()}
                {renderTip(tab.getTip())}
              </div>
            ))}
          </div>
        );
      }

      if (currentTab) {
        if (currentTab.getVisibleItems) {
          content = currentTab
            .getVisibleItems()
            .map((item: any) => <SettingField key={item.getId()} selected={selected} prop={item} />);
        } else if (currentTab.getSetter) {
          content = (
            <SettingField key={currentTab.getId()} selected={selected} prop={currentTab} forceDisplay="plain" />
          );
        }
      }
    } else {
      content = stage.getContent();
    }

    if (this.props.current) {
      if (this.props.direction) {
        this.additionClassName = `engine-stagein-${this.props.direction}`;
        className += ` ${this.additionClassName}`;
      }
    } else if (this.props.direction) {
      this.additionClassName = `engine-stageout-${this.props.direction}`;
    }

    let stageBacker = null;
    if (stage.hasBack()) {
      className += ' engine-has-backer';
      stageBacker = (
        <div className="engine-settings-stagebacker" data-stage-target="stageback">
          <Icons name="arrow" className="engine-field-arrow" size="12px" />
          <span className="engine-field-title">{stage.getTitle()}</span>
          {renderTip(stage.getTip())}
        </div>
      );
    }

    return (
      <div
        ref={(ref) => {
          this.shell = ref;
        }}
        className={className}
      >
        {stageBacker}
        {tabs}
        <div className="engine-stage-content">{content}</div>
      </div>
    );
  }
}
