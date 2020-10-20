/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/member-ordering */
import * as React from 'react';
import SubModule from './sub-module';

enum Gender {
  MALE,
  FEMALE,
}

interface Obj {
  s: string;
  n: number;
}

type Func = (a: string) => JSX.Element;
type Union =
  | string
  | number
  | {
      a: string;
    };

interface Props {
  error(a: string): number;
  void: void;
  object: Object;
  trigger?: Array<'click' | 'hover' | 'contextMenu'>;
  str?: string;
  num: number;
  gender: Gender;
  any: any;
  bool: boolean;
  tuple: [number, string, true];
  enum: 'red' | 'yellow' | 'green';
  arr: number[];
  halfEmptyObj: {
    [k: string]: any;
    fun(a: string[]): void;
  };
  // eslint-disable-next-line @typescript-eslint/ban-types
  emptyObj: {};
  func(arg: string): number;
  funcs: {
    n(): number;
    a(arg: string, num: number): void;
  };
  fuzzy:
    | boolean
    | 'object'
    | number
    | 'number'
    | 'test'
    | {
        a: any;
        sa: string[];
      };
  oneOf: boolean | 'test' | Obj;
  refFunc(p: Props): void;
  elementOrOther: JSX.Element | Func;
  obj: {
    a: number;
    arrOfStr: string[];
    arrOfObj: Obj[];
    func: () => void;
  };
  objOf: {
    [k: string]: number;
  };
  exact: {
    a: number;
  };
  node?: React.ReactNode;
  element?: JSX.Element;
  elementType?: React.ElementType;
  union: Union;
  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  func2: Func;
  html: HTMLBaseElement;
  loading?: boolean | { delay?: number };
}

interface AppProps extends React.FC<Props> {
  SubModule?: typeof SubModule;
}
const App: AppProps = () => {
  return <div>hello</div>;
};

App.defaultProps = {
  object: {
    a: '1',
    b: '2',
  },
  func(a: string) {
    return 123;
  },
  str: 'str',
};

export default App;
