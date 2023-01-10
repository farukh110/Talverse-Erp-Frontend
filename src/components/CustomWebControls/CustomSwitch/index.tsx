
import * as React from 'react';
import { Switch , Form } from 'antd';
import FormUtils from '../../../utils/formUtils';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { L } from '../../../lib/abpUtility';



const CustomSwitch = (props: any) => {
    const { defaultValue, mode, visible, internalName, displayName, size , onChangeCallback } = props;
    let disable = FormUtils.getDisabledStatus(mode);

    const onChangeTrigger =(state:boolean)=>{
        if (typeof (onChangeCallback) == 'function') {
            // trigger form to reload 
            onChangeCallback({ state: state, fieldId: internalName });
        }
    }
    return (
        <Form.Item label={L(displayName)} name={internalName} initialValue={defaultValue != "" && defaultValue == true ? true : false} valuePropName={'checked'} hidden={!visible}   >
            <Switch disabled={disable}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />} onChange={onChangeTrigger} />
        </Form.Item>
    )
}

export default CustomSwitch;