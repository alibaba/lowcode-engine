import * as React from 'react';
import SubModule from './sub-module';

enum Gender {
  MALE,
  FEMALE,
}

interface Props {
  // str?: string;
  // num: number;
  // gender: Gender;
  // any: any;
  // bool: boolean;
  // tuple: [1, 'str', true];
  // enum: 'red' | 'yellow' | 'green';
  // arr: number[];
  // obj: {
  //   a: number;
  //   [k: string]: number;
  // };
  // objOf: {
  //   [k: string]: number;
  // };
  // exact: {
  //   a: number;
  // };
  // empty: {};
  node?: React.ReactNode;
  // element?: JSX.Element;
  // elementType?: React.ElementType;
  // instance: Props;
}

const App = (props: Props) => {
  return <div>hello</div>;
};

App.SubModule = SubModule;

export default App;
