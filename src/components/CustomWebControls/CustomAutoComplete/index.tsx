import { AutoComplete, Form, Select } from 'antd';
import React, { useEffect } from 'react';
import { useAppStores, useCompState } from '../../../hooks/appStoreHooks';
import { L } from '../../../lib/abpUtility';
import AppConsts from '../../../lib/appconst';
import { ContentRequestDto } from '../../../services/Content/dto/contentRequestDto';
import FormUtils from '../../../utils/formUtils';
// import { FieldModes } from '../../CustomForm';
export interface ICustomAutoCompleteProp {

    parameters: any,
    onSelectItem?: (value: any) => any,
    selectText?: any,
    dataSource: any,
    dataTextField: any,
    dataValueField: any,
    placeholder: any,
    selectedItems?: any,
    formRef?: any,
    selectorMode?: any,
    idField?: any,
    disabled?: any,
    selectedValues?: any,
    onRemove?: (value?: any) => any
    componentName: string;
    preserveItemAfterSelection?: boolean,
    validations?: any,
    defaultValue?: any,
    mode?: any,
    selectFirstItemAsDefault?: boolean;
}

export const CustomAutoComplete = (props: ICustomAutoCompleteProp) => {

    let { mode, parameters, onSelectItem, selectText,
        dataSource, dataTextField, dataValueField,
        placeholder, selectedItems, formRef, selectorMode, onRemove, componentName, selectedValues, disabled, preserveItemAfterSelection, validations, selectFirstItemAsDefault } = props;
    if (props.defaultValue)
        selectedValues = props.defaultValue.toString();
    // data items for dropdown
    const [dataItems, setDataItems] = useCompState([]);
    // row data items for table
    const [apiDataItems, setApiDataItems] = useCompState([]);
    const { contentStore } = useAppStores();

    // start get all data
    const getAllData = async () => {

        //api call

        let requestObj: ContentRequestDto = {
            ComponentIdOrName: dataSource,
            Parameters: parameters
        }
        let dataList = apiDataItems && apiDataItems.length > 0 ? apiDataItems : await contentStore.GetComponentData(requestObj);
        const data: any = [];

        dataList = (dataList && dataList.items) ?? dataList;
        dataList && dataList.map && dataList.map((dataItem: any) => {
            if (!selectedItems || !(selectedItems && selectedItems.find((x: any) => x[dataValueField] == dataItem[dataValueField])))
                data.push({ label: dataItem[dataTextField], value: dataItem[dataValueField].toString() });
        });
        setDataItems(data);
        setApiDataItems(dataList);
    }

    // end get all data

    useEffect(() => {
        getAllData();
    }, [selectedItems]);

    // start autocomplete select function

    const onAutoCompleteSelect = (value: any) => {

        if (selectorMode && selectorMode == AppConsts.selectorModes.MULTIPLE) {
            if (onSelectItem && typeof (onSelectItem) == 'function')
                onSelectItem(value);
        }
        else {
            //reset data item after removing sleected item
            let selectedItem = apiDataItems.find((x: any) => x[dataValueField] == value);
            if (onSelectItem && typeof (onSelectItem) == 'function')
                onSelectItem(selectedItem);
            if (!preserveItemAfterSelection) {
                //remove from dataitems/dropdown
                let removeSelectedItem = dataItems.findIndex((x: any) => x.value == value);
                dataItems.splice(removeSelectedItem, 1);
                formRef.resetFields([componentName]);
                setDataItems([...dataItems]);
            }
        }
    }
    let compOptions = {
        options: dataItems,
        style: { width: '100%' },
        onSelect: onAutoCompleteSelect,
        placeholder: L(placeholder),
        className: 'autoComplete'
    }

    if (mode == AppConsts.formConstants.fieldModes.VIEW) {
        disabled = true;
        compOptions['disabled'] = disabled;
    }
    if (selectorMode && selectorMode == AppConsts.selectorModes.MULTIPLE) {
        compOptions['mode'] = AppConsts.selectorModes.MULTIPLE;
        compOptions['disabled'] = disabled;
        if (onRemove && typeof (onRemove) == 'function')
            compOptions['onDeselect'] = onRemove;

    }
    useEffect(() => {
        if (selectFirstItemAsDefault) {
            if (!selectedValues) {
                if (dataItems && dataItems.length > 0) {
                    let obj = {};
                    obj[componentName] = dataItems[0].value;
                    formRef.setFieldsValue(obj);
                }
            }
        }
    }, [dataItems]);
    let validateRules = disabled ? [] : FormUtils.getFormValidationObject(validations);
    // end autocomplete select function
    return (
        <div>
            <Form.Item className={disabled ? "frm-fld-readonly" : ""} label={L(selectText)} name={componentName} initialValue={selectedValues} rules={validateRules}>
                <Select showSearch allowClear={true}
                    {...compOptions}
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                        option.label?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
                    }
                />
            </Form.Item>

        </div>
    )
}
