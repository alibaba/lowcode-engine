import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import ConfigProvider from '../config-provider';
import Step from './view/step';
import StepItem from './view/step-item';

Step.Item = StepItem;

export default ConfigProvider.config(Step, {
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        if ('type' in props) {
            deprecated('type', 'shape', 'Step');

            var _props = props,
                type = _props.type,
                direction = _props.direction,
                labelPlacement = _props.labelPlacement,
                others = _objectWithoutProperties(_props, ['type', 'direction', 'labelPlacement']);

            direction = direction === 'vertical' ? 'ver' : direction === 'horizontal' ? 'hoz' : direction;
            labelPlacement = labelPlacement === 'vertical' ? 'ver' : labelPlacement === 'horizontal' ? 'hoz' : labelPlacement;
            props = _extends({ shape: type, direction: direction, labelPlacement: labelPlacement }, others);
        }

        return props;
    }
});