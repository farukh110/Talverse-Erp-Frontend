
import * as React from 'react';
import { Checkbox, Form } from 'antd';
import FormUtils from '../../../utils/formUtils';
import { L } from '../../../lib/abpUtility';



const  CustomCheckbox = (props: any) => {
    const { defaultValue ,mode ,visible,internalName,displayName,size } = props;
    let disable = FormUtils.getDisabledStatus(mode);
    // let validateRules = disable ? [] : FormUtils.getFormValidationObject(validations);
  
    return (
            <Form.Item label={L(displayName)} name={internalName} initialValue={defaultValue !="" &&  defaultValue== true ? true : false  } valuePropName={'checked'} hidden={!visible}   >
                <Checkbox  disabled={disable}  />
              
            </Form.Item>
       )
}

export default CustomCheckbox;