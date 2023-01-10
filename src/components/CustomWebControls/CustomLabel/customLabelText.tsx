
import * as React from 'react';
import { Form, Tag } from 'antd';
import { L } from '../../../lib/abpUtility';
import utils from '../../../utils/utils';
import ReactJson from 'react-json-view';
import './index.less';

export interface ICustomLabelTextProps {
    value?: any;
    visible: boolean;
    internalName?: any;
    displayName?: any;
    dataType?: any;

}

const CustomLabelText = (props: ICustomLabelTextProps) => {

    let { value, visible, internalName, displayName, dataType } = props;

    // switch (dataType) {

    //     case "DatePicker":
    //         defaultValue = utils.formattedDate(defaultValue);
    //         break;

    //     case "Text":
    //         try {
    //             let jsonInfo = JSON.parse(defaultValue);
    //             defaultValue = <div className="label-json-view">
    //                             <ReactJson
    //                             name={false}
    //                             src={jsonInfo}
    //                             onEdit={false}
    //                             onAdd={false}
    //                             onDelete={false}
    //                             enableClipboard={true}
    //                             iconStyle="circle" />
    //                             </div>;
    //         } catch (ex) {
    //         }
    //         break;

    //     case "Checkbox":
    //         defaultValue = defaultValue ? <Tag color="#2db7f5">{L('Yes')}</Tag> : <Tag color="red">{L('No')}</Tag>
    //         break;
    // }


    // let suffix = "";
    // if (options && options['labelSuffix']) {
    //     suffix = options['labelSuffix'];
    // }

    return (
        <Form.Item label={L(displayName)} name={internalName} hidden={!visible}>
            <div>{value || "--" } </div>
        </Form.Item>
    )
}
export default CustomLabelText;