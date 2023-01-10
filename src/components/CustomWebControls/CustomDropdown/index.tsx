
import React, { useEffect } from 'react';
import { Form, Select } from 'antd';
import FormUtils from '../../../utils/formUtils';
import { L } from '../../../lib/abpUtility';
import CustomLabel from '../CustomLabel';

const CustomDropdown = (props: any) => {

    const { defaultValue, mode, visible, displayName, dataItems, validations, size, options, onReloadForm, onChangeCallback, formRef, formFields } = props;
    let { internalName } = props;
    //remove data itmes having -1 as key and set value of -1 item as palceholder text
    let initial: any;
    let placeholder = "--- Please select ---";
    let copyDataItems: any = [];
    if (internalName == "Quantity") {
        internalName = "ddl-" + internalName;
    }
    const initializeComponent = () => {
        try {
            copyDataItems = dataItems;
            if (defaultValue != "" && defaultValue == "-1") {
                let index = dataItems.findIndex((x: any) => (x && x.key == defaultValue));
                if (index > -1) {
                    placeholder = dataItems.find((x: any) => (x && x.key == defaultValue)).value;
                    copyDataItems = dataItems.slice(1);
                }
            }
            initial = copyDataItems.find((x: any) => (x && x.key == defaultValue))?.key;
        } catch (e) {
            console.log(`error: ${e}`);
        }
    }
    initializeComponent();
    useEffect(() => {
        let obj = {};
        obj[internalName] = initial && initial.value ? initial.value : initial;
        formRef.setFieldsValue(obj);
        if (typeof (onChangeCallback) == 'function') {
            // trigger form to reload 
            onChangeCallback({ formId: initial?.key ? initial.key : initial, fieldId: internalName });
        }
    }, [dataItems])

    const changeSelectedValue = (key: any) => {
        const changedItem = copyDataItems.find((x: any) => x.key == key);
        if (options && options != null) {
            performDynamicCalculation();
            if (options['reloadFormOnChange']) {
                // trigger form to reload 
                onReloadForm(internalName, key);
            }
        }
        if (typeof (onChangeCallback) == 'function') {
            onChangeCallback({ formId: key, fieldId: internalName, selectedItem: changedItem });
        }

    }



    const performDynamicCalculation = () => {
        try {
            let depField = options['dependentField'];
            if (depField) {
                let depFieldFormula = formFields.find((x: any) => x.internalName == depField)?.options?.calculationFormula;
                let regex = /\[(.*?)\]/g;
                let forumlaFields = depFieldFormula && depFieldFormula.match(regex)?.map((fieldName: any) => {
                    return fieldName.replace('[', '').replace(']', '');
                });
                let forumlaWithValue = depFieldFormula;
                for (let j = 0; j < forumlaFields.length; j++) {
                    let tempKey = forumlaFields[j] == "Quantity" ? "ddl-" + forumlaFields[j] : forumlaFields[j];
                    let value = formRef.getFieldValue(tempKey);
                    forumlaWithValue = forumlaWithValue.replace([forumlaFields[j]], value)
                }
                let evalRes = eval(forumlaWithValue);
                let obj = {};
                obj[depField] = !isNaN(evalRes) ? evalRes : 0;
                formRef.setFieldsValue(obj);
            }
        }
        catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    const { Option } = Select;

    let disable = FormUtils.getDisabledStatus(mode);
    let validateRules = disable ? [] : FormUtils.getFormValidationObject(validations);
    return (
        <>
            {((dataItems && dataItems.length > 0 && disable) || !disable) && <Form.Item className={disable ? "frm-fld-readonly" : ""} label={L(displayName)} initialValue={initial} name={internalName} hidden={!visible} rules={validateRules}>
                <Select optionFilterProp="children" filterOption={(input, option: any) => option.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0 || option.value.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                } showSearch disabled={disable} placeholder={placeholder} onChange={changeSelectedValue} allowClear={true}>
                    {copyDataItems && copyDataItems.map((item: any) => (
                        <Option value={item.key} key={item.key}  >{L(item.value)}</Option>
                    ))}
                </Select>
            </Form.Item>}

            {disable && (!dataItems || dataItems.length <= 0) && <CustomLabel {...props} />}
        </>
    )
}
export default CustomDropdown;