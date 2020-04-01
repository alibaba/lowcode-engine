import { Component, isValidElement, ReactElement, ReactNode } from 'react';
import { Dialog, Search, Input } from '@alifd/next';
import Editor from '@ali/lowcode-editor-core';
import './index.scss';

export default class EventBindDialog extends Component<{
  editor:Editor,
}> {
  private eventList: any[] = [
    {
      name: 'getData',
    },
    {
      name: 'deleteData',
    },
    {
      name: 'initData',
    },
    {
      name: 'editData',
    },
    {
      name: 'submitData',
    },
  ];

  state = {
    visiable:false,
    selectedEventName: '',
    eventName: '',
  };

  openDialog = (bindEventName:String) => {
    this.setState({
      visiable:true,
      eventName:bindEventName
    })
  }

  closeDialog = () => {
    this.setState({
      visiable:false
    })
  }

  componentDidMount (){
    const {editor,config} = this.props;
    editor.on(`${config.pluginKey}.openDialog`,(bindEventName:String)=>{
      this.openDialog(bindEventName)
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

  onSelectItem = (eventName: String) => {
    this.setState({
      selectedEventName: eventName,
    });

    // 为空是新建事件
    if (eventName === '') {
      this.initEventName();
    } else {
      this.setState({
        selectedEventName: eventName,
        eventName,
      });
    }
  };

  onSearchEvent = (searchEventName: String) => {};

  onOk = () => {
    const {editor} = this.props;
    editor.emit('event-setter.bindEvent',this.state.eventName);
    this.closeDialog();
  };

  render() {
    const { selectedEventName, eventName,visiable} = this.state;
    return (
      <Dialog visible={visiable} title="事件绑定" onClose={this.closeDialog} onCancel={this.closeDialog} onOk={this.onOk}>
        <div className="event-dialog-body">
          <div className="dialog-left-container">
            <div className="dialog-small-title">事件选择</div>

            <div className="dialog-left-context">
              <ul className="event-type-container">
                <li className="select-item">内置函数</li>
                <li className="select-item select-item-active">组件事件</li>
              </ul>

              <div className="event-select-container">
                <div>
                  <Search className="event-search-box" shape="simple" />

                  <ul className="event-list">
                    <li
                      className={selectedEventName == '' ? 'select-item select-item-active' : 'select-item'}
                      onClick={() => this.onSelectItem('')}
                    >
                      新建事件
                    </li>
                    {this.eventList.map((item, index) => (
                      <li
                        key={index}
                        className={selectedEventName == item.name ? 'select-item select-item-active' : 'select-item'}
                        onClick={() => this.onSelectItem(item.name)}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="dialog-right-container">
            <div className="dialog-small-title">事件名称</div>
            <div className="event-input-container">
              <Input style={{ width: '100%' }} value={eventName} onChange={this.onInputChange} />
            </div>

            <div className="dialog-small-title">参数设置</div>
            <Input.TextArea style={{ width: '100%', height: '319px' }} />
          </div>
        </div>
      </Dialog>
    );
  }
}
