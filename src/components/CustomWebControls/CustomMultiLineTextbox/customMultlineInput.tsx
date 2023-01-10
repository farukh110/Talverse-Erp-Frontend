
import * as React from 'react';
import {  Input,Form } from 'antd';
import FormUtils from '../../../utils/formUtils';
import { L } from '../../../lib/abpUtility';
import { IBaseProps } from '../ICustomProps/ICustomProps';

export interface ICustomMultlineInputProps extends IBaseProps {
  
}

const  CustomMultlineInput = (props : ICustomMultlineInputProps) => {

    const { value, hidden, name, label, rules, disable } = props;

    return (
        <Form.Item initialValue={value} label={L(label)} hidden={hidden} name={name} rules={rules}>
        <Input.TextArea  disabled={disable} />
      </Form.Item>
      
    )  
  }

  export default CustomMultlineInput;