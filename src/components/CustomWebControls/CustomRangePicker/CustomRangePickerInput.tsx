
import * as React from 'react';
import {  DatePicker,Form } from 'antd';
import FormUtils from '../../../utils/formUtils';
import { L } from '../../../lib/abpUtility';
import moment from 'moment';
import { IBaseProps } from '../ICustomProps/ICustomProps';

export interface IcustomDatepickerInputProps extends IBaseProps {
  pickerType?:any,
  valueStart?:any ,
  valueEnd?:any

}

const  CustomRangePickerInput = (props : IcustomDatepickerInputProps) => {

    const { valueStart ,valueEnd, hidden, name, label, rules, disable, className , pickerType } = props;

    let val = valueStart && valueStart != "" && valueStart != null  ? [ moment(valueStart) , moment(valueEnd)  ]: ["",""];

    const { RangePicker } = DatePicker;

    return (

        <Form.Item label={L(label)}  initialValue={val} name={name}   hidden={hidden} rules={rules}>
       <RangePicker   disabled={disable} className={className} format='DD-MMM-YY' />
       </Form.Item>
    )  
  }
  export default CustomRangePickerInput;