
import React from 'react';
import { Form, Radio } from 'antd';
import { IBaseProps, IDataItem } from '../ICustomProps/ICustomProps';
import { L } from '../../../lib/abpUtility';

export interface ICustomRadioButtonInputProps extends IBaseProps {
    dataItems?: IDataItem[];
    onChange?: (selectedItem: IDataItem) => void;
}

const CustomRadioButtonInput = (props: ICustomRadioButtonInputProps) => {

    const { value, hidden, name, label, dataItems, rules, onChange, disable } = props;
    //remove data itmes having -1 as key and set value of -1 item as palceholder text
    let initial: any;
    let copyDataItems: any = [];
    const initializeComponent = () => {
        try {
            if (dataItems) {
                copyDataItems = dataItems;
                if (value != "" && value == "-1") {
                    let index = dataItems.findIndex((x: IDataItem) => (x && x.key == value));
                    if (index > -1) {
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
    const changeSelectedValue = (key: any) => {
        const changedItem = copyDataItems.find((x: IDataItem) => x.key == key);

        if (onChange && typeof (onChange) == 'function') {
            onChange(changedItem);
        }

    }
    return (
        <>
            <Form.Item label={L(label)} initialValue={value} name={name} hidden={hidden} rules={rules}>

                <Radio.Group value={value}
                    disabled={disable} onChange={changeSelectedValue}>

                    {
                        copyDataItems.map((item: any) => (
                            <Radio value={item.key} key={item.key}  >{item.value}</Radio>
                        ))
                    }

                </Radio.Group>

            </Form.Item>
        </>
    )
}
export default CustomRadioButtonInput;