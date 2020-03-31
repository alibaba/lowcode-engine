import * as React from 'react';

interface Props {
  str?: string;
  num: number;
  any: any;
  bool: boolean;
  tuple: [1, 'str', true];
  enum: 'red' | 'yellow' | 'green';
  arr: number[];
  obj: {
    a: number;
    [k: string]: number;
  };
  objOf: {
    [k: string]: number;
  };
  exact: {
    a: number;
  };
  empty: {};
  node?: React.ReactNode;
  element?: JSX.Element;
  elementType?: React.ElementType;
  instance: Props;
}

const App = (props: Props) => {
  return <div>hello</div>;
};

export default App;
