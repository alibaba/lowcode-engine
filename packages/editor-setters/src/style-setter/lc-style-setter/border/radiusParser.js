import compose from 'lodash.flow';
import curry from 'lodash.curry';
import { getRelatedRules } from './borderParser';
import utils from '../utils';
const keys = Object.keys;
const getRadiusEmptyState = () => ({
  tl: null,
  tr: null,
  bl: null,
  br: null,
});

const stateMutator = {
  'border-radius': (s, r) => keys(s).forEach(k => { s[k] = r; }),
  'border-top-left-radius': (s, r) => { s.tl = r; },
  'border-top-right-radius': (s, r) => { s.tr = r; },
  'border-bottom-left-radius': (s, r) => { s.bl = r; },
  'border-bottom-right-radius': (s, r) => { s.br = r; },
};

const mapStateToCurrentValue = (state, type) => {
  switch (type) {
    case 'border-radius':
      return keys(state).every(k => state[k] === state.tl) ? state.tl : null;
    case 'border-top-left-radius':
      return state.tl;
    case 'border-top-right-radius':
      return state.tr;
    case 'border-bottom-left-radius':
      return state.bl;
    case 'border-bottom-right-radius':
      return state.br;
    default:
      break;
  }
  return null;
};

const parseToRadius = curry((type, mapfn, rules) => {
  const ruleState = Object.assign({}, getRadiusEmptyState());
  rules.forEach(rule => stateMutator[rule[0]](ruleState, rule[1]));
  return mapfn(ruleState, type);
});

export default function radiusParser(props, state) {
  const rules = props.value || props.defaultValue || {};
  const current = compose(
    getRelatedRules,
    parseToRadius(state, mapStateToCurrentValue)
  )(rules, stateMutator);
  const inherit = utils.getInheritPropertyValue(
    rules, state, props.node);
  return { current, inherit, value: utils.notEmptyValue(current, inherit) };
}
