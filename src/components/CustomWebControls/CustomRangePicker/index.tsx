
import * as React from 'react';
import { DatePicker, Form } from 'antd';
import FormUtils from '../../../utils/formUtils';
import { L } from '../../../lib/abpUtility';
import moment from 'moment';
import { IBaseProps } from '../ICustomProps/ICustomProps';

export interface IcustomCustomRangePickerProps extends IBaseProps {
  defaultValue?: any,
  visible?: any,
  mode?: any,
  internalName: any,
  displayName: any,
  validations: any,
  size: any,
  options: any,
  formRef: any,
  disable: any
}



const CustomRangePicker = (props: any) => {

  const { defaultValue, mode, visible, internalName, displayName, validations, size, options, formRef, disable } = props;
  let val = defaultValue && defaultValue != null ? [moment(defaultValue.rangeStart), moment(defaultValue.rangeEnd)] : ["", ""];
  const { RangePicker } = DatePicker;
  let validateRules = disable ? [] : FormUtils.getFormValidationObject(validations);
  // className={className}
  return (

    <Form.Item label={L(displayName)} initialValue={val} name={internalName} hidden={!visible} rules={validateRules}>
      <RangePicker disabled={disable} format='DD-MMM-YY'
        disabledDate={d => !d || (options && options['maxDate'] ? d.isAfter(options['maxDate'], 'date') : false) || (options && options['minDate'] ? d.isBefore(options['minDate'], 'date') : false)}
      />
    </Form.Item>
  )
}
export default CustomRangePicker;