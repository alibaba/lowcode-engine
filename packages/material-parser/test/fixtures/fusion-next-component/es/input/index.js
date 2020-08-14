import ConfigProvider from '../config-provider';
import Input from './input';
import Password from './password';
import TextArea from './textarea';
import Group from './group';

Input.Password = ConfigProvider.config(Password, {
    exportNames: ['getInputNode', 'focus']
});

Input.TextArea = ConfigProvider.config(TextArea, {
    exportNames: ['getInputNode', 'focus']
});
Input.Group = Group;

// 用来自动生成文档的工具底层依赖的 react-docgen，无法解析生成 HOC 的方法中存在第二个参数的情况
// 所以不能在 input.jsx／textarea.jsx 中生成 HOC
export default ConfigProvider.config(Input, {
    exportNames: ['getInputNode', 'focus']
});