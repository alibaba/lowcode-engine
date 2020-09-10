import { Component, isValidElement, ReactElement, ReactNode } from 'react';
import { Dialog, Search, Input } from '@alifd/next';
import { PluginProps } from '@ali/lowcode-types';
import MonacoEditor from 'react-monaco-editor';
import './index.scss';


const defaultEditorOption = {
  width: '100%',
  height: '319px',
  options: {
    readOnly: false,
    automaticLayout: true,
    folding: true, //默认开启折叠代码功能
    lineNumbers: 'on',
    wordWrap: 'off',
    formatOnPaste: true,
    fontSize: 12,
    tabSize: 2,
    scrollBeyondLastLine: false,
    fixedOverflowWidgets: false,
    snippetSuggestions: 'top',
    minimap: {
      enabled: false,
    },
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
    },
  },
};
export default class EventBindDialog extends Component<PluginProps> {
  private eventList: any[] = [
    // {
    //   name: 'getData',
    // },
    // {
    //   name: 'deleteData',
    // },
    // {
    //   name: 'initData',
    // },
    // {
    //   name: 'editData',
    // },
    // {
    //   name: 'submitData',
    // },
  ];

  private bindEventName :''

  state: any = {
    visiable: false,
    setterName:'event-setter',
    selectedEventName: '',
    eventName: '',
    bindEventName:'',
    paramStr:''
  };

  openDialog = (bindEventName: String) => {
    this.bindEventName = bindEventName;

    this.initEventName();

    this.setState({
      visiable: true,
      selectedEventName:''
    });
  };

  closeDialog = () => {
    this.setState({
      visiable: false,
    });
  };

  componentDidMount() {
    const { editor, config } = this.props;
    editor.on(`${config.pluginKey}.openDialog`, (bindEventName: String,setterName:String,paramStr:String) => {
      console.log('paramStr:'+paramStr);
      this.openDialog(bindEventName);
      this.setState({
        setterName,
        paramStr
      })

      let schema = editor.get('designer').project.getSchema();
      let pageNode = schema.componentsTree[0];
      if (pageNode.methods){
        this.eventList = [];
        for (let key in pageNode.methods){
          this.eventList.push({
            name:key
          })
        }
      }
    });
  }

  initEventName = () => {
    let eventName = this.bindEventName;
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
    console.log(this);
    const { editor } = this.props;
    const {setterName,eventName,paramStr} = this.state;
    editor.emit(`${setterName}.bindEvent`, eventName,paramStr);

    // 选中的是新建事件
    if (this.state.selectedEventName == '') {
      // 判断面板是否处于激活状态
      // debugger;
      editor.get('skeleton').getPanel('sourceEditor').show();

      setTimeout(()=>{
        editor.emit('sourceEditor.addFunction', {
          functionName: this.state.eventName,
        });
      },300)

    }

    this.closeDialog();
  };

  onChangeEditor = (paramStr) =>{
    this.setState({
      paramStr
    })
    // console.log(newCode);
  }


  render() {
    const { selectedEventName, eventName, visiable,paramStr } = this.state;
    return (
      <Dialog
        visible={visiable}
        title="事件绑定"
        onClose={this.closeDialog}
        onCancel={this.closeDialog}
        onOk={()=>this.onOk()}
      >
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
            <div className="editor-container">
              <MonacoEditor
                  value = {paramStr}
                  {...defaultEditorOption}
                  {...{ language: 'javascript' }}
                  onChange={(newCode) => this.onChangeEditor(newCode)}
                  // editorDidMount={(editor, monaco) => this.editorDidMount.call(this, editor, monaco, TAB_KEY.JS_TAB)}
                />
            </div>

          </div>
        </div>
      </Dialog>
    );
  }
}
