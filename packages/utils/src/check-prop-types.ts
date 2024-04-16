import * as ReactIs from 'react-is';
// @ts-expect-error
import { default as ReactPropTypesSecret } from 'prop-types/lib/ReactPropTypesSecret';
// @ts-expect-error
import { default as factoryWithTypeCheckers } from 'prop-types/factoryWithTypeCheckers';
import { IPublicTypePropType } from '@alilc/lowcode-types';
import { isRequiredPropType } from './check-types/is-required-prop-type';
import { Logger } from '../../shared/src/helper/logger';

const PropTypes2 = factoryWithTypeCheckers(ReactIs.isElement, true);
const logger = new Logger({ level: 'warn', bizName: 'utils' });

export function transformPropTypesRuleToString(rule: IPublicTypePropType | string): string {
  if (!rule) {
    return 'PropTypes.any';
  }

  if (typeof rule === 'string') {
    return rule.startsWith('PropTypes.') ? rule : `PropTypes.${rule}`;
  }

  if (isRequiredPropType(rule)) {
    const { type, isRequired } = rule;
    return `PropTypes.${type}${isRequired ? '.isRequired' : ''}`;
  }

  const { type, value } = rule;
  switch (type) {
    case 'oneOf':
      return `PropTypes.oneOf([${value.map((item: any) => `"${item}"`).join(',')}])`;
    case 'oneOfType':
      return `PropTypes.oneOfType([${value.map((item: any) => transformPropTypesRuleToString(item)).join(', ')}])`;
    case 'arrayOf':
    case 'objectOf':
      return `PropTypes.${type}(${transformPropTypesRuleToString(value)})`;
    case 'shape':
    case 'exact':
      return `PropTypes.${type}({${value.map((item: any) => `${item.name}: ${transformPropTypesRuleToString(item.propType)}`).join(',')}})`;
    default:
      logger.error(`Unknown prop type: ${type}`);
  }

  return 'PropTypes.any';
}

export function checkPropTypes(
  value: any,
  name: string,
  rule: any,
  componentName: string,
): boolean {
  let ruleFunction = rule;
  if (typeof rule === 'object') {
    // eslint-disable-next-line no-new-func
    ruleFunction = new Function(
      `"use strict"; const PropTypes = arguments[0]; return ${transformPropTypesRuleToString(rule)}`,
    )(PropTypes2);
  }
  if (typeof rule === 'string') {
    // eslint-disable-next-line no-new-func
    ruleFunction = new Function(
      `"use strict"; const PropTypes = arguments[0]; return ${transformPropTypesRuleToString(rule)}`,
    )(PropTypes2);
  }
  if (!ruleFunction || typeof ruleFunction !== 'function') {
    logger.warn('checkPropTypes should have a function type rule argument');
    return true;
  }
  const err = ruleFunction(
    {
      [name]: value,
    },
    name,
    componentName,
    'prop',
    null,
    ReactPropTypesSecret,
  );
  if (err) {
    logger.warn(err);
  }
  return !err;
}
