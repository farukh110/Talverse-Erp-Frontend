
import React, { useEffect } from 'react';
import { Input, Form, InputNumber } from 'antd';
import { L } from '../../../lib/abpUtility';
import { IBaseProps } from '../ICustomProps/ICustomProps';
import { useFormDefaultValue } from '../../../hooks/formHooks';
import LocalizationKeys from '../../../lib/localizationKeys';

export interface ICustomNumberInputProps extends IBaseProps {
  max?: number;
  min?: number;
  onChangeChild?: (val?: any, fieldId?: string) => any;
  formRef?: any;
  dynamicFormula?: any;
  prefix?: any;
}

const CustomNumberInput = (props: ICustomNumberInputProps) => {
  const { min, max, value, hidden, name, label, rules, disable, formRef, prefix, onChangeChild, dynamicFormula } = props;

  let validateRules = rules ? [...rules] : [];
  if (min) {
    validateRules.push({ required: true, type: "number", min: min, message: `${L(LocalizationKeys.ERP_Error_FieldMinValueMessage.key)} ${min}` });
  }
  if (max) {
    validateRules.push({ required: true, type: "number", max: max, message: `${L(LocalizationKeys.ERP_Error_FieldMaxValueMessage.key)} ${max}` });
  }

  useFormDefaultValue(formRef, name, value);
  const onChangeValue = () => {
    if (onChangeChild) {
      onChangeChild!(formRef?.getFieldValue(name), name);
    }

    if (dynamicFormula) {
      try {
        let regex = /\[(.*?)\]/g;
        let forumlaFields = dynamicFormula.match(regex)?.map((fieldName: any) => {
          return fieldName.replace('[', '').replace(']', '');
        });
        //forumlaFields[0] -- "set value field"
        //forumlaFields[1] -- "get value field "
        //forumlaFields[2] -- "get value field "
        let formula = dynamicFormula.split('=');
        let formulatToAplly = formula[1];
        for (let j = 1; j < forumlaFields.length; j++) {
          let value = formRef.getFieldValue(forumlaFields[j]);
          formulatToAplly = formulatToAplly.replace([forumlaFields[j]], value)
        }
        if (!formulatToAplly.includes('undefined')) {
          let evalRes = eval(formulatToAplly);
          if (evalRes) {
            let obj = {};
            obj[forumlaFields[0]] = evalRes;
            formRef.setFieldsValue(obj);
          }
        }
      } catch (ex) {
        console.log(`error: ${ex}`);
      }
    }
  }
  return (
    <Form.Item name={name} label={L(label)} initialValue={value} rules={validateRules} hidden={hidden}  >
      <InputNumber type='number' addonBefore={prefix ? prefix : null} disabled={disable} onChange={onChangeValue} />
    </Form.Item>
  )
}

export default CustomNumberInput;

