import { Form } from 'antd';
import React from 'react';
import { L } from '../../../lib/abpUtility';
import FormUtils from '../../../utils/formUtils';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css'
import './index.less';
import { useCompState } from '../../../hooks/appStoreHooks';

const CustomPhoneInput = (props: any) => {

    const { defaultValue, mode, visible, internalName, displayName, validations, size, formRef, defaultCountry, onChangeCallback } = props;
    const [value, setValue] = useCompState(defaultValue);
    const customValidationCallBack = (rule: any, val: any, callback: any) => {

        if (rule.value) {
            let isValid = true;
            let currentVal = formRef!.getFieldValue(internalName);
            if (currentVal && currentVal != '' && currentVal.length > 4)
                if (!isValidPhoneNumber(currentVal))
                    isValid = false;

            return isValid ? Promise.resolve() : Promise.reject(rule.message);
        }
        else
            return Promise.resolve();
    }

    let disable = FormUtils.getDisabledStatus(mode);
    let validateRules = disable ? [] : FormUtils.getFormValidationObject(validations, customValidationCallBack);

    const onCountryChange = (val: any) => {
        if (onChangeCallback && typeof (onChangeCallback) == 'function') {
            onChangeCallback({ formId: 'country', fieldId: 'customPhoneInput', selectedItem: val });
        }
    }

    const onPhoneNumberChange = (val: any) => {
        setValue(val);
        if (onChangeCallback && typeof (onChangeCallback) == 'function') {
            onChangeCallback({ formId: '0', fieldId: 'customPhoneInput', selectedItem: val });
        }
    }

    return (
        <div>
            <Form.Item initialValue={defaultValue} label={L(displayName)} name={internalName} rules={validateRules} hidden={!visible}>

                <PhoneInput
                    international
                    defaultCountry={defaultCountry}
                    value={value}
                    onChange={onPhoneNumberChange}
                    limitMaxLength={true}
                    onCountryChange={onCountryChange}

                />
            </Form.Item>
        </div>
    )
}

export default CustomPhoneInput;