
import * as React from 'react';
import {  DatePicker,Form } from 'antd';
import FormUtils from '../../../utils/formUtils';
import { L } from '../../../lib/abpUtility';
import moment from 'moment';
import { IBaseProps } from '../ICustomProps/ICustomProps';

export interface IcustomDatepickerInputProps extends IBaseProps {
  pickerType?:any
}

const  CustomDatepickerInput = (props : IcustomDatepickerInputProps) => {

    const { value, hidden, name, label, rules, disable, className , pickerType } = props;

    let val = value != "" && value != null  ?  moment(value) : "";

    return (

        <Form.Item label={L(label)} initialValue={val} name={name}   hidden={hidden} rules={rules}>
       <DatePicker disabled={disable} className={className} picker={pickerType ? pickerType : 'date'}/>
       </Form.Item>
    )  
  }
  export default CustomDatepickerInput;