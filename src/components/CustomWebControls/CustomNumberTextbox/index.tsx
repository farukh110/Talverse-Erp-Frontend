

import * as React from 'react';
import { InputNumber, Form } from 'antd';
import FormUtils from '../../../utils/formUtils';
import { L } from '../../../lib/abpUtility';
import { useFormDefaultValue } from '../../../hooks/formHooks';

function CustomNumberTextbox(props: any) {

  const { defaultValue, mode, visible, internalName, displayName, validations, size, options, formRef } = props;

  let disable = FormUtils.getDisabledStatus(mode);
  let validateRules = disable ? [] : FormUtils.getFormValidationObject(validations);

  let suffix = "";
  if (options && options['labelSuffix']) {
    suffix = options['labelSuffix'];
  }

  useFormDefaultValue(formRef, internalName, Number(defaultValue));

  return (
    <Form.Item shouldUpdate={(prevValues, currentValues) => true} >
      {() => (
        <Form.Item name={internalName} label={L(displayName)} initialValue={Number(defaultValue)} rules={validateRules} hidden={!visible}  >
          <InputNumber type='number' addonBefore={options && options['prefixField'] && formRef.getFieldValue(options['prefixField']) ? formRef.getFieldValue(options['prefixField']) : ""} addonAfter={suffix} disabled={disable} />
        </Form.Item>
      )
      }
    </Form.Item>
  )
}
export default CustomNumberTextbox;