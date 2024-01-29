import {Component} from 'react';
import {TipContainer, observer} from '@alilc/lowcode-editor-core';
import classNames from 'classnames';
import {ISkeleton} from '../skeleton';
import TopArea from './top-area';
import LeftArea from './left-area';
import LeftFixedPane from './left-fixed-pane';
import LeftFloatPane from './left-float-pane';
import Toolbar from './toolbar';
import MainArea from './main-area';
import BottomArea from './bottom-area';
import RightArea from './right-area';
import './workbench.less';
import {SkeletonContext} from '../context';
import {EditorConfig, PluginClassSet} from '@alilc/lowcode-types';
import SplitPane, {Pane} from "split-pane-react";
import 'split-pane-react/esm/themes/default.css';

interface SizeState {
  sizes: (string | number)[];
}

@observer
export class Workbench extends Component<{
  skeleton: ISkeleton;
  config?: EditorConfig;
  components?: PluginClassSet;
  className?: string;
  topAreaItemClassName?: string;
}, SizeState> {
  constructor(props: any) {
    super(props);
    const {config, components, skeleton} = this.props;
    skeleton.buildFromConfig(config, components);
    this.state = {sizes: ['70%', 'auto']}
  }

  setSizes(newsize: any[]) {
    this.setState({sizes: newsize});
  }

  componentDidUpdate() {
    console.log(document.querySelector('.lc-main-area')?.parentElement.parentElement)
    const a =document.querySelector('.lc-main-area')?.parentElement.parentElement.style.width;
    console.log('aaa', a)
  }

  render() {
    const {
      skeleton,
      className,
      topAreaItemClassName,
    } = this.props;
    return (
      <div className={classNames('lc-workbench', className)}>
        <SkeletonContext.Provider value={this.props.skeleton}>
          <TopArea area={skeleton.topArea} itemClassName={topAreaItemClassName}/>
          <div className="lc-workbench-body">
            <LeftArea area={skeleton.leftArea}/>
            <LeftFloatPane area={skeleton.leftFloatArea}/>
            <LeftFixedPane area={skeleton.leftFixedArea}/>
            <SplitPane
              split='vertical'
              sizes={this.state.sizes}
              onChange={(sizes:(string|number)[])=>{
                this.setSizes(sizes);
              }}>
              <Pane minSize={450} maxSize='100%'>
                <div className="lc-workbench-center">
                  <Toolbar area={skeleton.toolbar}/>
                  <MainArea area={skeleton.mainArea}/>
                  <BottomArea area={skeleton.bottomArea}/>
                </div>
              </Pane>
              <Pane minSize={300} maxSize='50%'>
                <RightArea area={skeleton.rightArea}/>
              </Pane>
            </SplitPane>
          </div>
          <TipContainer/>
        </SkeletonContext.Provider>
      </div>
    );
  }
}
