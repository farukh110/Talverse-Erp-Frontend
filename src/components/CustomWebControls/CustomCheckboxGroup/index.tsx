
import * as React from 'react';
import { Checkbox, Form } from 'antd';
import FormUtils from '../../../utils/formUtils';
import {  useCompState } from '../../../hooks/appStoreHooks';
import { L } from '../../../lib/abpUtility';



const  CustomCheckboxGroup = (props: any) => {
    const { defaultValue ,mode ,visible,internalName,displayName,size,dataItems } = props;
    const [ctrlValue, setCtrlValue] = useCompState(defaultValue);
    let disable = FormUtils.getDisabledStatus(mode);
    let options = dataItems.map((item:any) => ({ label: item.value, value: item.key }));
    function onChange(checkedValues:any) {
        setCtrlValue(checkedValues);
      }
    return (
            <Form.Item label={L(displayName)} name={internalName} initialValue={defaultValue} valuePropName={'checked'} hidden={!visible} >
                <Checkbox.Group options={options}  disabled={disable} value={ctrlValue} onChange={onChange} />
              
            </Form.Item>
       )
}

export default CustomCheckboxGroup;