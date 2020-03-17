const { handlers } = require('react-docgen');
import {
  propTypeHandler,
  contextTypeHandler,
  childContextTypeHandler,
} from './propTypeHandler';

const defaultHandlers = [
  propTypeHandler,
  contextTypeHandler,
  childContextTypeHandler,
  handlers.propTypeCompositionHandler,
  handlers.propDocBlockHandler,
  handlers.flowTypeHandler,
  handlers.defaultPropsHandler,
  handlers.componentDocblockHandler,
  handlers.displayNameHandler,
  handlers.componentMethodsHandler,
  handlers.componentMethodsJsDocHandler,
];

export default defaultHandlers;
