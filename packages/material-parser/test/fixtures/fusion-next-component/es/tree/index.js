import ConfigProvider from '../config-provider';
import Tree from './view/tree';
import TreeNode from './view/tree-node';

Tree.Node = TreeNode;

export default ConfigProvider.config(Tree, {
    exportNames: ['setFocusKey']
});