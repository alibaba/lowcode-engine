import { propTypeHandler, contextTypeHandler, childContextTypeHandler } from './propTypeHandler';
import defaultPropsHandler from './defaultPropsHandler';
import flowTypeHandler from './flowTypeHandler';
import componentMethodsHandler from './componentMethodsHandler';
import preProcessHandler from './preProcessHandler';

const { handlers } = require('react-docgen');

const defaultHandlers = [
  preProcessHandler,
  propTypeHandler,
  contextTypeHandler,
  childContextTypeHandler,
  handlers.propTypeCompositionHandler,
  handlers.propDocBlockHandler,
  flowTypeHandler,
  defaultPropsHandler,
  handlers.componentDocblockHandler,
  handlers.displayNameHandler,
  componentMethodsHandler,
  handlers.componentMethodsJsDocHandler,
];

export default defaultHandlers;
