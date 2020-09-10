import { Button } from '@ali/vu-uxcore-legao-design';
import './index.less';

const MyButton = (props) => {
  const { action, componentPrototype, type, className } = props;
  return (
    <Button
      className={className}
      type={type || action.type || 'outline'}
      danger={action.danger || false}
      onClick={() => {
        if (action.fn && typeof action.fn === 'function') {
          action.fn(componentPrototype);
        }
      }}
    >
      {action.title}
    </Button>
  );
};

export default MyButton;
