import { Component, isValidElement, ReactElement, ReactNode } from 'react';
import { Dialog, Search, Input ,Button} from '@alifd/next';
import Editor from '@ali/lowcode-editor-core';
import './index.scss';

export default class VariableBindDialog extends Component<{
  editor: Editor;
}> {
  private loopVariableList: any[] = [
    {
      name: 'item',
    },
    {
      name: 'index',
    },
  ];

  private stateVaroableList: any[] = [
    {
      name: 'abc',
    },
    {
      name: 'title',
    },
    {
      name: 'jdata',
    },
  ];

  state = {
    visiable: true,
    selectedVariableName: '',
    variableContext: '',
  };

  openDialog = (bindEventName: String) => {
    this.setState({
      visiable: true,
      eventName: bindEventName,
    });
  };

  closeDialog = () => {
    this.setState({
      visiable: false,
    });
  };

  componentDidMount() {
    const { editor, config } = this.props;
    editor.on(`${config.pluginKey}.openDialog`, (bindEventName: String) => {
      this.openDialog(bindEventName);
    });
  }

  initEventName = () => {
    const { bindEventName } = this.state;
    let eventName = bindEventName;
    this.eventList.map((item) => {
      if (item.name === eventName) {
        eventName = `${eventName}_new`;
      }
    });

    this.setState({
      eventName,
    });
  };

  onInputChange = (eventName: String) => {
    this.setState({
      eventName,
    });
  };

  onSelectItem = (variableName: String) => {
    this.setState({
      selectedVariableName:variableName,
      variableContext:variableName
    });

    // // 为空是新建事件
    // if (variableName === '') {
    //   this.initEventName();
    // } else {
    //   this.setState({
    //     selectedEventName: eventName,
    //     eventName,
    //   });
    // }
  };


  onOk = () => {
    const { editor } = this.props;
    editor.emit('event-setter.bindEvent', this.state.eventName);
    this.closeDialog();
  };

  renderBottom = () => {
      return (
        <div className="variable-bind-dialog-bottom">
            <div className="bottom-left-container">
              <Button type="normal" warning>移除绑定</Button>
            </div>

            <div className="bottom-right-container">
              <Button type="primary" onClick={this.onOk}>确定</Button>&nbsp;&nbsp;
              <Button type="normal" onClick={this.closeDialog}>取消</Button>
            </div>
        </div>
      )
  }

  render() {
    const { selectedEventName, eventName, visiable ,variableContext} = this.state;
    return (
      <Dialog
        visible={visiable}
        title="变量绑定"
        onClose={this.closeDialog}
        onCancel={this.closeDialog}
        onOk={this.onOk}
        footer={this.renderBottom()}
      >
        <div className="variable-dialog-body">
          <div className="dialog-left-container">
            <div className="dialog-small-title">变量选择</div>

            <div className="dialog-left-context">
              <div className="variable-type-container">
                <div>
                  <div className="select-item select-item-active">当前上下文</div>
                  <div className="variable-list">
                    {this.loopVariableList.map((item) => (
                      <div className="variable-item" onClick={()=>this.onSelectItem(item.name)}>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="select-item select-item-active">State属性</div>
                <div className="variable-list">
                  {this.stateVaroableList.map((item) => (
                    <div className="variable-item" onClick={()=>this.onSelectItem(item.name)}>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="dialog-right-container">
            <div className="dialog-small-title">绑定</div>
            <Input.TextArea style={{ width: '100%', height: '219px' }} value={variableContext}/>

            <div className="dialog-small-title" style={{marginTop:'13px'}}>帮助</div>
            <Input.TextArea style={{ width: '100%', height: '137px' }} />
          </div>
        </div>
      </Dialog>
    );
  }
}
