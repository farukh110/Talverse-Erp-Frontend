
import React, { useEffect } from 'react';
import { Form, Select } from 'antd';
import { IBaseProps, IDataItem } from '../ICustomProps/ICustomProps';
import { useFormDefaultValue } from '../../../hooks/formHooks';
import { L } from '../../../lib/abpUtility';
export interface ICustomDropdownInputProps extends IBaseProps {
    dataItems?: IDataItem[];
    onChange?: (selectedItem: IDataItem) => void;
    formRef?: any;
}
const CustomDropdownInput = (props: ICustomDropdownInputProps) => {

    const { value, hidden, name, label, dataItems, rules, onChange, disable, formRef } = props;
    //remove data itmes having -1 as key and set value of -1 item as palceholder text
    let initial: any;
    let placeholder = "--- Please select ---";
    let copyDataItems: any = [];
    const initializeComponent = () => {

        try {
            if (dataItems) {
                copyDataItems = dataItems;
                if (value != "" && value == "-1") {
                    let index = dataItems.findIndex((x: IDataItem) => (x && x.key == value));
                    if (index > -1) {
                        placeholder = dataItems.find((x: IDataItem) => (x && x.key == value))?.value;
                        copyDataItems = dataItems.slice(1);
                    }
                }
                initial = copyDataItems.find((x: IDataItem) => (x && x.key == value));
            }

        } catch (e) {
            console.log(`error: ${e}`);
        }
    }
    initializeComponent();
    useFormDefaultValue(formRef, name, value, dataItems);
    const changeSelectedValue = (key: any) => {
        const changedItem = copyDataItems.find((x: IDataItem) => x.key == key);

        if (onChange && typeof (onChange) == 'function') {
            onChange(changedItem);
        }
    }
    const { Option } = Select;
    return (
        <>
            <Form.Item label={L(label)} initialValue={value} name={name} hidden={hidden} rules={rules}>
                <Select allowClear={true} optionFilterProp="children" filterOption={(input, option: any) => option.children?.toString().toLowerCase().indexOf(input?.toString().toLowerCase()) >= 0 || option.value?.toString().toLowerCase().indexOf(input?.toString().toLowerCase()) >= 0
                } showSearch disabled={disable} value={value} placeholder={placeholder} onChange={changeSelectedValue}  >
                    {copyDataItems && copyDataItems.map((item: any) => (
                        <Option value={item.key} key={item.key}  >{item.value}</Option>
                    ))}
                </Select>
            </Form.Item>
        </>
    )
}
export default CustomDropdownInput;