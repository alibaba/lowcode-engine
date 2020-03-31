import {
  propTypeHandler,
  contextTypeHandler,
  childContextTypeHandler,
} from './propTypeHandler';
import defaultPropsHandler from './defaultPropsHandler';

const { handlers } = require('react-docgen');

const defaultHandlers = [
  propTypeHandler,
  contextTypeHandler,
  childContextTypeHandler,
  handlers.propTypeCompositionHandler,
  handlers.propDocBlockHandler,
  handlers.flowTypeHandler,
  defaultPropsHandler,
  handlers.componentDocblockHandler,
  handlers.displayNameHandler,
  handlers.componentMethodsHandler,
  handlers.componentMethodsJsDocHandler,
];

export default defaultHandlers;
