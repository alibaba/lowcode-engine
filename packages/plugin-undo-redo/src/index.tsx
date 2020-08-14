import React, { PureComponent } from 'react';
import { Editor } from '@ali/lowcode-editor-core';
import Icon from '@ali/ve-icons';
import { Button } from '@alifd/next';
import { Designer } from '@ali/lowcode-designer';
import { PluginProps } from '@ali/lowcode-types';

import './index.scss';

export interface IProps extends PluginProps {
  editor: Editor;
  logo?: string;
}

export interface IState {
  undoEnable: boolean;
  redoEnable: boolean;
}

export default class UndoRedo extends PureComponent<IProps, IState> {
  static displayName = 'LowcodeUndoRedo';

  private history: any;

  constructor(props: any) {
    super(props);
    this.state = {
      undoEnable: false,
      redoEnable: false,
    };
  }

  async componentDidMount() {
    const { editor } = this.props;
    editor.on('designer.history.change', this.handleHistoryChange);

    const designer = await editor.onceGot(Designer);
    this.history = designer.currentHistory;
    this.updateState(this.history?.getState() || 0);
  }

  componentWillUnmount(): void {
    const { editor } = this.props;
    editor.off('designer.history.change', this.handleHistoryChange);
  }

  handleHistoryChange = (history: any): void => {
    this.history = history;
    this.updateState(this.history?.getState() || 0);
  };

  init = (): void => {
    const { editor } = this.props;

    this.history = editor.get(Designer)?.currentHistory;
    this.updateState(this.history?.getState() || 0);

    editor.on('designer.history.change', (history: any): void => {
      this.history = history;
      this.updateState(this.history?.getState() || 0);
    });
  };

  updateState = (state: number): void => {
    this.setState({
      undoEnable: !!(state & 1),
      redoEnable: !!(state & 2),
    });
  };

  handleUndoClick = (): void => {
    this.history?.back();
  };

  handleRedoClick = (): void => {
    this.history?.forward();
  };

  render(): React.ReactNode {
    const { undoEnable, redoEnable } = this.state;
    return (
      <div className="lowcode-plugin-undo-redo">
        <Button
          size="medium"
          data-tip="撤销"
          data-dir="bottom"
          className="ve-local-history-item"
          onClick={this.handleUndoClick}
          ghost
          disabled={!undoEnable}
        >
          <Icon name="amindUndo" size="18px" />
        </Button>
        <Button
          size="medium"
          data-tip="恢复"
          data-dir="bottom"
          className="ve-local-history-item"
          onClick={this.handleRedoClick}
          ghost
          disabled={!redoEnable}
        >
          <Icon name="forward" size="18px" />
        </Button>
      </div>
    );
  }
}
