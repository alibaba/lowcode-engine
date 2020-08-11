
import ResultFile from '../../../../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    'index',
    'jsx',
    `
import { createElement, Component } from 'rax';

import Page from 'rax-view';
import Text from 'rax-text';

import './index.css';

class Home$$Page extends Component {
  render() {
    return (
      <Page>
        <Text>Hello world!</Text>
      </Page>
    );
  }
}

export default Home$$Page;

    `,
  );

  return [['src','pages','Home'], file];
}
  