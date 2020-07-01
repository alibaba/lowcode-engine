import * as React from 'react';
import omit from 'omit.js';
import { FormProvider as RcFormProvider } from 'rc-field-form';
import { FormProviderProps as RcFormProviderProps } from 'rc-field-form/lib/FormContext';
import { ColProps } from '../grid/col';
import { FormLabelAlign } from './interface';

/**
 * Form Context
 * Set top form style and pass to Form Item usage.
 */
export interface FormContextProps {
  vertical: boolean;
  name?: string;
  colon?: boolean;
  labelAlign?: FormLabelAlign;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
}

export const FormContext = React.createContext<FormContextProps>({
  labelAlign: 'right',
  vertical: false,
});

/**
 * Form Item Context
 * Used for Form noStyle Item error collection
 */
export interface FormItemContextProps {
  updateItemErrors: (name: string, errors: string[]) => void;
}

export const FormItemContext = React.createContext<FormItemContextProps>({
  updateItemErrors: () => {},
});

/**
 * Form Provider
 *
 */
export interface FormProviderProps extends Omit<RcFormProviderProps, 'validateMessages'> {}

export const FormProvider: React.FC<FormProviderProps> = props => {
  const providerProps = omit(props, ['prefixCls']);
  return <RcFormProvider {...providerProps} />;
};
