
import * as React from 'react';
import {  Input,Form } from 'antd';
import FormUtils from '../../../utils/formUtils';
import { L } from '../../../lib/abpUtility';


const  CustomMultiLineTextBox = (props : any) => {

    const { defaultValue ,mode ,visible,internalName,displayName,validations,size } = props;
    let validateRules = FormUtils.getFormValidationObject(validations);
    let disable = FormUtils.getDisabledStatus(mode);

    return (
        <Form.Item initialValue={defaultValue} label={L(displayName)} hidden={!visible} name={internalName} rules={validateRules}  >
        <Input.TextArea  disabled={disable} />
      </Form.Item>
      
    )  
  }

  export default CustomMultiLineTextBox;