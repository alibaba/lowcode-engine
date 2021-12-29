import { propTypeHandler, contextTypeHandler, childContextTypeHandler } from './propTypeHandler';
import defaultPropsHandler from './defaultPropsHandler';
import preProcessHandler from './preProcessHandler';
import propTypeJsDocHandler from './propTypeJsDocHandler';

const { handlers } = require('react-docgen');

const defaultHandlers = [
  preProcessHandler,
  handlers.propTypeCompositionHandler,
  propTypeHandler,
  contextTypeHandler,
  childContextTypeHandler,
  handlers.propDocBlockHandler,
  propTypeJsDocHandler,
  defaultPropsHandler,
  handlers.componentDocblockHandler,
  handlers.displayNameHandler,
  handlers.componentMethodsJsDocHandler,
];

export default defaultHandlers;
