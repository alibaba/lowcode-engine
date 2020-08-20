import { Component, isValidElement, ReactElement, ReactNode } from 'react';
import { Radio, Menu, Table, Icon, Dialog } from '@alifd/next';
import nativeEvents from './native-events';

import './index.scss';
const { SubMenu, Item, Group, Divider } = Menu;
const RadioGroup = Radio.Group;

const EVENT_CONTENTS = {
  COMPONENT_EVENT: 'componentEvent',
  NATIVE_EVENT: 'nativeEvent',
  LIFE_CYCLE_EVENT: 'lifeCycleEvent',
};

const DEFINITION_EVENT_TYPE = {
  EVENTS: 'events',
  NATIVE_EVENTS: 'nativeEvents',
  LIFE_CYCLE_EVENT: 'lifeCycleEvent',
};

const SETTER_NAME = 'event-setter'

export default class EventsSetter extends Component<{
  value: any[];
  onChange: (eventList: any[]) => void;
}> {
  state = {
    showEventList: false,
    eventBtns: [],
    eventList: [],
    selectType: null,
    nativeEventList: [],
    lifeCycleEventList: [],
    eventDataList: (this.props?.value?.eventDataList ? this.props.value.eventDataList : this.props?.value) || [],
    relatedEventName: '',
  };

  // constructor (){
  //   super();
  //   debugger;
  //   // if (!this.props || !this.props.value){
  //   //   this.setState({
  //   //     eventDataList:[]
  //   //   })
  //   // }
  // }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   debugger;
  //   // const { value } = nextProps;
  //   // debugger;
  //   // if (value !== prevState.eventDataList) {
  //   //   return {
  //   //     value,
  //   //   };
  //   // }
  //   return null;
  // }

  private bindEventName:String;

  componentDidMount() {
    const {editor} = this.props.field;
    this.initEventBtns();
    this.initEventList();
    editor.on(`${SETTER_NAME}.bindEvent`,(relatedEventName)=>{
      this.bindEvent(relatedEventName);
    })

  }

  /**
   * 初始化事件按钮
   */
  initEventBtns() {
    const { definition } = this.props;
    let isRoot = false;
    let isCustom = false;
    let eventBtns = [];
    definition.map(item => {
      if (item.type === DEFINITION_EVENT_TYPE.LIFE_CYCLE_EVENT) {
        isRoot = true;
      }

      if (item.type === DEFINITION_EVENT_TYPE.EVENTS) {
        isCustom = true;
      }
    });

    if (isRoot) {
      eventBtns = [
        {
          value: EVENT_CONTENTS.LIFE_CYCLE_EVENT,
          label: '生命周期',
        },
      ];
    } else if (isCustom) {
      eventBtns = [
        {
          value: EVENT_CONTENTS.COMPONENT_EVENT,
          label: '组件自带事件',
        },
      ];
    } else {
      eventBtns = [
        {
          value: EVENT_CONTENTS.NATIVE_EVENT,
          label: '原生事件',
        },
      ];
    }

    this.setState({
      eventBtns,
    });
  }

  initEventList() {
    const { definition } = this.props;
    let nativeEventList = [];
    definition.map(item => {
      if (item.type === DEFINITION_EVENT_TYPE.EVENTS) {
        this.checkEventListStatus(item.list, DEFINITION_EVENT_TYPE.EVENTS);
        this.setState({
          eventList: item.list,
        });
      }

      if (item.type === DEFINITION_EVENT_TYPE.NATIVE_EVENTS) {
        this.checkEventListStatus(
          item.list,
          DEFINITION_EVENT_TYPE.NATIVE_EVENTS,
        );
        nativeEventList = item.list;
      }

      if (item.type === DEFINITION_EVENT_TYPE.LIFE_CYCLE_EVENT) {
        this.checkEventListStatus(
          item.list,
          DEFINITION_EVENT_TYPE.LIFE_CYCLE_EVENT,
        );
        this.setState({
          lifeCycleEventList: item.list,
        });
      }
    });

    if (nativeEventList.length == 0) {
      nativeEventList = nativeEvents;
      this.setState({
        nativeEventList,
      });
    }
  }

  checkEventListStatus = (eventList: Array, eventType: String) => {
    const { eventDataList } = this.state;
    if (
      eventType === DEFINITION_EVENT_TYPE.EVENTS ||
      eventType === DEFINITION_EVENT_TYPE.LIFE_CYCLE_EVENT
    ) {
      eventList.map(item => {
        item.disabled = false;
        eventDataList.map(eventDataItem => {
          if (item.name === eventDataItem.name) {
            item.disabled = true;
          }
        });
      });
    } else if (eventType === DEFINITION_EVENT_TYPE.NATIVE_EVENTS) {
      eventDataList.map(eventDataItem => {
        eventList.map(item => {
          item.eventList.map(eventItem => {
            if (eventItem.name === eventDataItem.name) {
              item.disabled = true;
            } else {
              item.disabled = false;
            }
          });
        });
      });
    }
  };

  /**
   * 渲染事件信息
   */
  renderEventInfoCell = (value, index, record) => {
    let eventTagText = '';
    if (record.type === EVENT_CONTENTS.NATIVE_EVENT) {
      eventTagText = '原';
    } else if (record.type === EVENT_CONTENTS.COMPONENT_EVENT) {
      eventTagText = '组';
    } else if (record.type === EVENT_CONTENTS.LIFE_CYCLE_EVENT) {
      eventTagText = '生';
    }
    return (
      <div>
        <div className="event-cell">
          <div className="event-type-tag">{eventTagText}</div>
          {record.name}
        </div>
        <div className="event-cell" style={{ marginTop: '8px' }}>
          <Icon type="attachment" size="small" className="related-icon" />
          <span className="related-event-name" onClick={()=>this.onRelatedEventNameClick(record.relatedEventName)}>
            {record.relatedEventName || ''}
          </span>
        </div>
      </div>
    );
  };

  /**
   * 渲染事件操作项
   */
  renderEventOperateCell = (eventName: String) => {
    return (
      <div>
        <Icon
          type="set"
          className="event-operate-icon"
          style={{ marginLeft: '3px', marginRight: '4px' }}
          onClick={() => this.openDialog(eventName)}
        />
        <Icon
          type="ashbin"
          className="event-operate-icon"
          onClick={() => this.openDeleteEventDialog(eventName)}
        />
      </div>
    );
  };

  updateEventListStatus = (eventName: String, unDisabled: boolean) => {
    const { eventList, nativeEventList, lifeCycleEventList } = this.state;
    eventList.map(item => {
      if (item.name === eventName) {
        item.disabled = !unDisabled;
      }
    });

    lifeCycleEventList.map(item => {
      if (item.name === eventName) {
        item.disabled = !unDisabled;
      }
    });

    nativeEventList.map(item => {
      item.eventList.map(itemData => {
        if (itemData.name === eventName) {
          itemData.disabled = !unDisabled;
        }
      });
    });
  };

  onRadioChange = value => {
    this.setState({
      selectType: value,
    });
  };



  onEventMenuClick = (eventName: String) => {
    const { selectType, eventDataList } = this.state;
    eventDataList.push({
      type: selectType,
      name: eventName,
    });

    this.setState({
      eventDataList,
    });

    this.updateEventListStatus(eventName);
    this.closeEventMenu();
    this.openDialog(eventName);
  };

  onRelatedEventNameClick = (eventName:String) => {
    const {editor} =  this.props.field;

    editor.get('skeleton').getPanel('sourceEditor').show();

    setTimeout(()=>{
      editor.emit('sourceEditor.focusByFunction',{
        functionName:eventName
      })
    },300)


    // editor.emit('sourceEditor.focusByFunction',{
    //   functionName:eventName
    // })
  }

  closeEventMenu = () => {
    if (this.state.selectType !== null) {
      this.setState({
        selectType: null,
      });
    }
  };

  openDeleteEventDialog = (eventName: String) => {
    this.deleteEvent(eventName);
    // Dialog.confirm({
    //   title: '删除事件',
    //   content: '确定删除当前事件吗',
    //   onOk: () => this.deleteEvent(eventName),
    // });
  };

  deleteEvent = (eventName: String) => {
    const { eventDataList,eventList} = this.state;
    eventDataList.map((item, index) => {
      if (item.name === eventName) {
        eventDataList.splice(index, 1);
      }
    });

    this.setState({
      eventDataList,
    });
    this.props.onChange({eventDataList,eventList});
    this.updateEventListStatus(eventName, true);
  };

  openDialog = (bindEventName: String) => {
    const {editor} = this.props.field;
    this.bindEventName = bindEventName;
    editor.emit('eventBindDialog.openDialog',bindEventName,SETTER_NAME);
  };


  bindEvent = (relatedEventName: String) => {
    const {eventDataList,eventList} = this.state;
    eventDataList.map(item => {
      if (item.name === this.bindEventName) {
        item.relatedEventName = relatedEventName;
      }
    });

    this.setState({
      eventDataList
    })


    this.props.onChange({eventDataList,eventList});

    //this.closeDialog();
  };

  render() {
    const {
      eventBtns,
      eventList,
      nativeEventList,
      lifeCycleEventList,
      selectType,
      eventDataList,
    } = this.state;
    const {editor} = this.props.field;
    let showEventList =
      lifeCycleEventList.length > 0 ? lifeCycleEventList : eventList;
    return (
      <div className="lc-block-setter event-body" onClick={this.closeEventMenu}>

        <div className="event-title">
          {
             eventBtns.length>1 ?<span>点击选择事件类型</span>:<span>点击绑定事件</span>
          }
        </div>

        <RadioGroup
          dataSource={eventBtns}
          shape="button"
          size="medium"
          value={selectType}
          onChange={this.onRadioChange}
          style={{ width: '100%' }}
        />
        {selectType && selectType != EVENT_CONTENTS.NATIVE_EVENT && (
          <Menu
            defaultOpenKeys="sub-menu"
            className="event-menu"
            onItemClick={this.onEventMenuClick}
          >
            {showEventList.map((item, index) => (
              <Item
                key={item.name}
                helper={item.description}
                disabled={item.disabled}
              >
                {item.name}
              </Item>
            ))}
          </Menu>
        )}

        {selectType && selectType === EVENT_CONTENTS.NATIVE_EVENT && (
          <Menu
            defaultOpenKeys="sub-menu"
            className="event-menu"
            onItemClick={this.onEventMenuClick}
          >
            {nativeEventList.map((item, index) => (
              <Group label={item.name} key={index}>
                {item.eventList.map(item => (
                  <Item key={item.name} disabled={item.disabled}>
                    {item.name}
                  </Item>
                ))}
              </Group>
            ))}
          </Menu>
        )}

        <div className="event-table">
          <Table dataSource={eventDataList} size="small">
            <Table.Column title="已有事件" cell={this.renderEventInfoCell} />
            <Table.Column
              title="操作"
              dataIndex="name"
              cell={this.renderEventOperateCell}
              width={70}
            />
          </Table>
        </div>
      </div>
    );
  }
}
