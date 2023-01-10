import { FormInstance } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import AppConsts from '../../../lib/appconst';
import utils from '../../../utils/utils';
import { CustomButton } from '../../CustomControls';
import CustomForm from '../../CustomForm';
import './index.less';

const CustomAdvanceFilter = (props: any) => {

    const { advanceFilterFields, onSearch } = props;
    const formRef = useRef<FormInstance>();

    const submitForm = () => {

        try {
            formRef.current!.validateFields().then(async (values: any) => {
                let filterArr: any = [];

                for (const [key, value] of Object.entries(values)) {
                    if (value) {
                        let currentItemType = advanceFilterFields.formFields.find((item: any) => item.internalName == key || item.componentName == key)?.type;
                        let val: any = value;
                        switch (currentItemType) {
                            case "RangePicker":
                                if (val && val[0] != "" && val[1] != "") {
                                    filterArr.push({ "fieldName": key, "operator": ">=", "value": utils.getStartOfDate(val[0], AppConsts.DateUnits.DAY, 'YYYY-MM-DD HH:mm:ss') }); // get start date
                                    filterArr.push({ "fieldName": key, "operator": "<=", "value": utils.getEndOfDate(val[1], AppConsts.DateUnits.DAY, 'YYYY-MM-DD HH:mm:ss') }); // get end date 
                                }
                                break;
                            case "DatePicker":
                                filterArr.push({ "fieldName": key, "operator": ">=", "value": utils.getStartOfDate(value, AppConsts.DateUnits.DAY, 'YYYY-MM-DD HH:mm:ss') });
                                filterArr.push({ "fieldName": key, "operator": "<=", "value": utils.getEndOfDate(value, AppConsts.DateUnits.DAY, 'YYYY-MM-DD HH:mm:ss') });
                                break;

                            case "Text":
                                filterArr.push({ "fieldName": key, "operator": "like", "value": `%${value}%` });
                                break;

                            default:
                                filterArr.push({ "fieldName": key, "operator": "=", "value": value });
                                break;
                        }
                    }
                }
                let advanceFilterPayload = {
                    fieldName: "",
                    operator: "AND",
                    filters: filterArr
                };
                if (onSearch) {
                    onSearch(advanceFilterPayload);
                }
            });
        }
        catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    const reload = () => {
        if (onSearch) {
            onSearch(null);

        }
        formRef.current!.resetFields();
    }

    return (
        <div>
            <CustomForm
                ref={formRef} alignButtonsInline={true} {...advanceFilterFields}
                saveButton={

                    <CustomButton
                        onClick={() => submitForm()}
                        className='btn-advance-search'
                        appearance={CustomButton.appearances.Search}>
                    </CustomButton>
                }
                cancelButton={
                    <CustomButton
                        onClick={() => reload()}
                        className='btn-advance-clear btn-light'
                        appearance={CustomButton.appearances.Clear}>
                    </CustomButton>
                }
            >
            </CustomForm>
        </div>
    )
}

export default CustomAdvanceFilter;
