
import * as React from 'react';
import { DatePicker, Form } from 'antd';
import FormUtils from '../../../utils/formUtils';
import { L } from '../../../lib/abpUtility';
import moment from 'moment';
import utils from '../../../utils/utils';



const CustomDatePicker = (props: any) => {

  const { defaultValue, mode, visible, internalName, displayName, dataItems, validations, size, formRef, options } = props;


  let val = defaultValue && defaultValue != "" ? moment.utc(defaultValue) : "";
  const customValidationCallBack = (rule: any, value: any, callback: any) => {
    const form = formRef;
    let isValid = false;
    if (value) {
      isValid = utils.isCampaignDateValid(value, form!.getFieldValue(rule.fieldToCompare));
    }
    return isValid ? Promise.resolve() : Promise.reject(rule.message);
  }

  let disable = FormUtils.getDisabledStatus(mode);
  let validateRules = disable ? [] : FormUtils.getFormValidationObject(validations, customValidationCallBack);

  return (

    <Form.Item label={L(displayName)} initialValue={val} name={internalName} hidden={!visible} rules={validateRules}  >
      <DatePicker disabled={disable}
        disabledDate={d => !d || (options && options['maxDate'] ? d.isAfter(options['maxDate'], 'date') : false) || (options && options['minDate'] ? d.isBefore(options['minDate'], 'date') : false)} />
    </Form.Item>
  )
}
export default CustomDatePicker;