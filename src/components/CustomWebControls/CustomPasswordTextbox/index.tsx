
import * as React from 'react';
import { Input, Form } from 'antd';
import FormUtils from '../../../utils/formUtils';
import { L } from '../../../lib/abpUtility';



const CustomPasswordTextBox = (props: any) => {
  const { defaultValue, mode, visible, internalName, displayName, size, validations, formRef } = props;
  const customValidationCallBack = (rule: any, value: any, callback: any) => {
    const form = formRef;
    let isValid = true;
    if (value && value !== form!.getFieldValue(rule.fieldToCompare)) {
      isValid = false;
    }
    return isValid ? Promise.resolve() : Promise.reject(rule.message);
  }

  let disable = FormUtils.getDisabledStatus(mode);
  let validateRules = disable ? [] : FormUtils.getFormValidationObject(validations, customValidationCallBack);
  return (
    <Form.Item label={L(displayName)} name={internalName} rules={validateRules} initialValue={defaultValue} hidden={!visible} >
      <Input.Password disabled={disable} />
    </Form.Item>
  )
}

export default CustomPasswordTextBox;