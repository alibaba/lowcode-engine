import ConfigProvider from '../config-provider';
import Step from './view/step';
import StepItem from './view/step-item';

Step.Item = StepItem;

export default ConfigProvider.config(Step, {
    transform: /* istanbul ignore next */ (props, deprecated) => {
        if ('type' in props) {
            deprecated('type', 'shape', 'Step');

            let { type, direction, labelPlacement, ...others } = props;
            direction =
                direction === 'vertical'
                    ? 'ver'
                    : direction === 'horizontal'
                    ? 'hoz'
                    : direction;
            labelPlacement =
                labelPlacement === 'vertical'
                    ? 'ver'
                    : labelPlacement === 'horizontal'
                    ? 'hoz'
                    : labelPlacement;
            props = { shape: type, direction, labelPlacement, ...others };
        }

        return props;
    },
});
