

import React, { useEffect, useRef } from 'react';
import { Input, Form, InputNumber } from 'antd';
import FormUtils from '../../../utils/formUtils';
import { L } from '../../../lib/abpUtility';


function CustomCalculatedControl(props: any) {

    const { defaultValue, mode, visible, internalName, displayName, validations, size, formRef, options, formFields } = props;
    let suffix = "";

    useEffect(() => {
        performDynamicCalculation();
    }, [formFields]);
    let disable = FormUtils.getDisabledStatus(mode);
    let validateRules = disable ? [] : FormUtils.getFormValidationObject(validations);

    if (options && options['labelSuffix']) {
        suffix = options['labelSuffix'];
    }


    const onChange = () => {
        performDynamicCalculation();
    }

    const performDynamicCalculation = () => {
        try {
            let depField = options['dependentField'];
            let depFieldFormula = formFields.find((x: any) => x.internalName == depField).options?.calculationFormula;
            let regex = /\[(.*?)\]/g;
            let forumlaFields = depFieldFormula.match(regex)?.map((fieldName: any) => {
                return fieldName.replace('[', '').replace(']', '');
            });
            let forumlaWithValue = depFieldFormula;
            for (let j = 0; j < forumlaFields.length; j++) {
                let value = formRef.getFieldValue(forumlaFields[j]);
                forumlaWithValue = forumlaWithValue.replace([forumlaFields[j]], value)
            }
            let evalRes = eval(forumlaWithValue);
            let obj = {};
            obj[depField] = !isNaN(evalRes) ? evalRes : 0;
            formRef.setFieldsValue(obj);
        }
        catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    return (
        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => true} >
            {() => (
                <Form.Item name={internalName} label={L(displayName)} initialValue={defaultValue} rules={validateRules} hidden={!visible} >
                    <InputNumber addonBefore={options && options['prefixField'] && formRef.getFieldValue(options['prefixField']) ? formRef.getFieldValue(options['prefixField']) : ""} addonAfter={suffix} disabled={disable} onChange={onChange} />
                </Form.Item>
            )
            }
        </Form.Item>
    )
}
export default CustomCalculatedControl;