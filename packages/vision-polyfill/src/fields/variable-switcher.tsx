import VariableSetter from './variable-setter';
import Icons from '@ali/ve-icons';
import { IVEFieldProps } from './field';
import './variable-switcher.less';
import { Component } from 'react';
import { setters } from '@ali/lowcode-engine';

const { getSetter } = setters;

interface IState {
  visible: boolean;
}

export default class VariableSwitcher extends Component<IVEFieldProps, IState> {
  private ref: HTMLElement | null = null;

  private VariableSetter: any;

  constructor(props: IVEFieldProps) {
    super(props);

    this.VariableSetter = getSetter('VariableSetter')?.component || VariableSetter;

    this.state = {
      visible: false,
    };
  }

  public render() {
    const { isUseVariable, prop } = this.props;
    const { visible } = this.state;
    const isSupportVariable = prop.isSupportVariable();
    const tip = !isUseVariable ? '绑定变量' : prop.getVariableValue();
    if (!isSupportVariable) {
      return null;
    }
    return (
      <div>
        <Icons.Tip
          name="var"
          size="24px"
          position="bottom center"
          className={`engine-field-variable-switcher ${isUseVariable ? 'engine-active' : ''}`}
          data-tip={tip}
          onClick={(e: Event) => {
            e.stopPropagation();
            if (this.VariableSetter.isPopup) {
              this.VariableSetter.show({
                prop,
              });
            } else {
              prop.setUseVariable(!isUseVariable);
            }
          }}
        >
          绑定变量
        </Icons.Tip>
      </div>
    );
  }
}
