
import * as React from 'react';
import { Input, Form } from 'antd';
import FormUtils from '../../../utils/formUtils';
import { L } from '../../../lib/abpUtility';


const CustomTextbox = (props: any) => {
  const { defaultValue, mode, visible, internalName, displayName, validations, size } = props;

  let disable = FormUtils.getDisabledStatus(mode);
  let validateRules = disable ? [] : FormUtils.getFormValidationObject(validations);
  
  return (

    <Form.Item initialValue={defaultValue} label={L(displayName)} name={internalName} rules={validateRules} hidden={!visible} >
      <Input disabled={disable} />
    </Form.Item>

  )
}

export default CustomTextbox;