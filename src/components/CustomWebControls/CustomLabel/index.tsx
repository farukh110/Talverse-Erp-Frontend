
import * as React from 'react';
import { Form, Tag } from 'antd';
import { L } from '../../../lib/abpUtility';
import utils from '../../../utils/utils';
import ReactJson from 'react-json-view';
import './index.less';
import LocalizationKeys from '../../../lib/localizationKeys';

const CustomLabel = (props: any) => {

    let { defaultValue, mode, visible, internalName, displayName, dataItems, validations, size, options, dataType, value } = props;

    if (!dataType)
        defaultValue = value && value != null && value != "" ? value : defaultValue;

    switch (dataType) {

        case "DatePicker":
            defaultValue = utils.formattedDate(defaultValue);
            break;

        case "DateTimePicker":
            defaultValue = utils.formattedDateAndTime(defaultValue);
            break;

        case "Text":
        case "Multiline":

            try {

                let jsonInfo = JSON.parse(defaultValue);
                if (jsonInfo)
                    defaultValue = <div className="label-json-view">
                        <ReactJson
                            name={false}
                            src={jsonInfo}
                            onEdit={false}
                            onAdd={false}
                            onDelete={false}
                            enableClipboard={true}
                            iconStyle="circle" />
                    </div>;

            } catch (ex) {
                console.log(`error: ${ex}`);
            }
            break;

        case "Checkbox":
            defaultValue = defaultValue ? <Tag color="#2db7f5">{L(LocalizationKeys.ERP_LblYes.key)}</Tag> : <Tag color="red">{L(LocalizationKeys.ERP_LblNo.key)}</Tag>
            break;
    }


    let suffix = "";
    if (options && options['labelSuffix']) {
        suffix = options['labelSuffix'];
    }

    return (
        <Form.Item label={L(displayName)} name={internalName} hidden={!visible}>
            <div>{defaultValue || "--"} {suffix}</div>
        </Form.Item>
    )
}
export default CustomLabel;