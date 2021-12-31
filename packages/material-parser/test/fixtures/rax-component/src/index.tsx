import { createElement, forwardRef } from 'rax';
import { Price as _Price, Title as _Title } from '@ali/pcom-chaoshi-meta-design';
import View from 'rax-view';
import Text from 'rax-text';
import './index.css';

interface Props {
  a: string;
}

const MyComponent = forwardRef((props: Props, ref: any) => {
  return (
    <View>
      <Text className="rax-demo-title">Hello World!</Text>
    </View>
  );
});

export default MyComponent;

export const Price = _Price;
export const Title = _Title;
