import ConfigProvider from '../config-provider';
import Select from './select';
import AutoComplete from './auto-complete';
import Option from './option';
import OptionGroup from './option-group';

Select.AutoComplete = ConfigProvider.config(AutoComplete, {
    componentName: 'Select',
});

Select.Option = Option;
Select.OptionGroup = OptionGroup;

// compatible with 0.x version
/* istanbul ignore next */
function transform(props, deprecated) {
    const {
        shape,
        container,
        multiple,
        filterBy,
        overlay,
        safeNode,
        noFoundContent,
        ...others
    } = props;

    const newprops = others;
    if (shape === 'arrow-only') {
        deprecated('shape=arrow-only', 'hasBorder=false', 'Select');
        newprops.hasBorder = false;
    }
    if (container) {
        deprecated('container', 'popupContainer', 'Select');
        newprops.popupContainer = container;
    }
    if (multiple) {
        deprecated('multiple', 'mode=multiple', 'Select');
        newprops.mode = 'multiple';
    }
    if (filterBy) {
        deprecated('filterBy', 'filter', 'Select');
        newprops.filter = filterBy;
    }
    if (overlay) {
        deprecated('overlay', 'popupContent', 'Select');
        newprops.popupContent = overlay;
        newprops.autoWidth = false;
    }

    if (noFoundContent) {
        deprecated('noFoundContent', 'notFoundContent', 'Select');
        newprops.notFoundContent = noFoundContent;
    }

    if (safeNode) {
        deprecated('safeNode', 'popupProps={safeNode}', 'Select');
        newprops.popupProps = {
            safeNode,
        };
    }

    return newprops;
}

// compatible with 0.x version: Select.Combobox
Select.Combobox = ConfigProvider.config(Select, {
    transform: /* istanbul ignore next */ (props, deprecated) => {
        deprecated('Select.Combobox', '<Select showSearch={true}/>', 'Select');

        const newprops = transform(props, deprecated);
        if (props.onInputUpdate) {
            newprops.onSearch = props.onInputUpdate;
            newprops.showSearch = true;
        }
        return newprops;
    },
});

export default ConfigProvider.config(Select, {
    transform,
    exportNames: ['focusInput', 'handleSearchClear'],
});
