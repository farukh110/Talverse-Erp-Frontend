import { Checkbox } from 'antd';
import * as React from 'react';

const CustomCheckboxInput = (props: any) => {
    return (
        <div> <Checkbox  {...props}> {props.children} </Checkbox> </div>
    )
}

export default CustomCheckboxInput;