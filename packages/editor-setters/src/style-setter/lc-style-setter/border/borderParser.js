import compose from 'lodash.flow';
import curry from 'lodash.curry';
import zipObject from 'lodash.zipobject';
import { parse as parseBorder } from 'css-border-property';
import utils from '../utils';
// const logger = (val) => {
//   console.log(val);
//   return val;
// };
const keys = Object.keys;
const getProp = p => (v => v[p]);
const stateMutator = {
  setKey: (s, k, r) => {
    s[k].c = r['border-color'];
    s[k].s = r['border-style'];
    s[k].w = r['border-width'];
  },
  setKeyOnly: (s, k, k2, r, o) => {
    s[k][k2] = r[o];
  },
  border: (s, r) => keys(s).forEach(k => stateMutator.setKey(s, k, r)),
  'border-left': (s, r) => stateMutator.setKey(s, 'l', r),
  'border-right': (s, r) => stateMutator.setKey(s, 'r', r),
  'border-top': (s, r) => stateMutator.setKey(s, 't', r),
  'border-bottom': (s, r) => stateMutator.setKey(s, 'b', r),

  'border-style': (s, r) => keys(s).forEach(k => { s[k].s = r['border-style']; }),
  'border-width': (s, r) => keys(s).forEach(k => { s[k].w = r['border-width']; }),
  'border-color': (s, r) => keys(s).forEach(k => { s[k].c = r['border-color']; }),

  'border-left-color': (s, r) => stateMutator.setKeyOnly(s, 'l', 'c', r, 'border-color'),
  'border-left-width': (s, r) => stateMutator.setKeyOnly(s, 'l', 'w', r, 'border-width'),
  'border-left-style': (s, r) => stateMutator.setKeyOnly(s, 'l', 's', r, 'border-style'),

  'border-right-color': (s, r) => stateMutator.setKeyOnly(s, 'r', 'c', r, 'border-color'),
  'border-right-width': (s, r) => stateMutator.setKeyOnly(s, 'r', 'w', r, 'border-width'),
  'border-right-style': (s, r) => stateMutator.setKeyOnly(s, 'r', 's', r, 'border-style'),

  'border-top-color': (s, r) => stateMutator.setKeyOnly(s, 't', 'c', r, 'border-color'),
  'border-top-width': (s, r) => stateMutator.setKeyOnly(s, 't', 'w', r, 'border-width'),
  'border-top-style': (s, r) => stateMutator.setKeyOnly(s, 't', 's', r, 'border-style'),

  'border-bottom-color': (s, r) => stateMutator.setKeyOnly(s, 'b', 'c', r, 'border-color'),
  'border-bottom-width': (s, r) => stateMutator.setKeyOnly(s, 'b', 'w', r, 'border-width'),
  'border-bottom-style': (s, r) => stateMutator.setKeyOnly(s, 'b', 's', r, 'border-style'),
};

const mergeToObj = val => zipObject(val.map(getProp('property')), val.map(getProp('value')));
const mapRuleToState = (rule, ruleState, applyFn) => {
  const val = parseBorder(typeof rule === 'string' ? rule : '');
  const r = mergeToObj(val);
  applyFn.call(null, ruleState, r);
  return ruleState;
};

const mapStateToCurrentValue = (state, type) => {
  switch (type) {
    case 'border':
      return {
        // @todo consider to convert color to judge equal
        color: keys(state).every(k => state[k].c === state.l.c)
          ? state.l.c : '',
        style: keys(state).every(k => state[k].s === state.l.s)
          ? state.l.s : '',
        width: keys(state).every(k => state[k].w === state.l.w)
          ? state.l.w : '',
      };
    case 'border-left':
      return {
        color: state.l.c,
        style: state.l.s,
        width: state.l.w,
      };
    case 'border-right':
      return {
        color: state.r.c,
        style: state.r.s,
        width: state.r.w,
      };
    case 'border-top':
      return {
        color: state.t.c,
        style: state.t.s,
        width: state.t.w,
      };
    case 'border-bottom':
      return {
        color: state.b.c,
        style: state.b.s,
        width: state.b.w,
      };
    default:
  }
  return {
    color: '',
    style: '',
    width: '',
  };
};

const getEmptyRuleSet = () => ({
  l: { c: '', s: '', w: '' }, // left: color | style | width
  r: { c: '', s: '', w: '' }, // right: color | style | width
  t: { c: '', s: '', w: '' }, // top: color | style | width
  b: { c: '', s: '', w: '' }, // bottom: color | style | width
});

export const parseToBorder = curry((type, mapfn, rules) => {
  const ruleState = Object.assign({}, getEmptyRuleSet());
  rules.forEach(rule => mapRuleToState(rule[1], ruleState, stateMutator[rule[0]]));
  return mapfn(ruleState, type);
});

const getRule = (rules, fn = v => v) => {
  return fn(rules);
};

export const getRelatedRules = (rules, mutator) => {
  const filterRules = ruleSet => keys(ruleSet)
    .filter(v => !!mutator[v])
    .map(n => [n, getRule(rules)[n]]);
  return getRule(rules, filterRules);
};

export default function borderParser(props, state, mutator = stateMutator) {
  const rules = props.value || props.defaultValue || {};
  const current = compose(
    getRelatedRules,
    // logger,
    parseToBorder(state, mapStateToCurrentValue),
  )(rules, mutator);
  const inheritStr = utils.getInheritPropertyValue(
    rules, state, props.node);
  const inheritValue = mergeToObj(parseBorder(typeof inheritStr !== 'string' ? '' : inheritStr));
  const inherit = {
    color: inheritValue['border-color'],
    style: inheritValue['border-style'],
    width: inheritValue['border-width'],
  };
  return { current, inherit, value: utils.notEmptyValue(current, inherit) };
}
