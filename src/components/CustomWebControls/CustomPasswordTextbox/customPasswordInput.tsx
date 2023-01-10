import * as React from 'react';
import { Input, Form } from 'antd';
import { L } from '../../../lib/abpUtility';
import { IBaseProps } from '../ICustomProps/ICustomProps';

export interface ICustomPasswordInputProps extends IBaseProps {
    prefix?: any;
    placeholder?: any;
}
const CustomPasswordInput = (props: ICustomPasswordInputProps) => {
    const { value, hidden, name, label, rules, disable, prefix, placeholder } = props;

    return (
        <Form.Item initialValue={value} label={L(label)} name={name} rules={rules} hidden={hidden}   >
            <Input.Password autoComplete="new-password" disabled={disable} prefix={prefix} placeholder={placeholder} />
        </Form.Item>
    )
}

export default CustomPasswordInput;