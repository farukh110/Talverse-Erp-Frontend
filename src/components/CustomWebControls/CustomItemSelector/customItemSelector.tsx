import React, { forwardRef, useEffect } from 'react';
import { CustomTable } from '../../../components/CustomGrid';
import { CustomAutoComplete } from '../../../components/CustomWebControls/CustomAutoComplete';
import { useAppState, useCompState } from '../../../hooks/appStoreHooks';
import FormElement from '../../../components/CustomForm/components/FormElement';
import { CustomButton } from '../../../components/CustomControls';
import './index.less';
import { Card, Form, Modal } from 'antd';
import { L } from '../../../lib/abpUtility';
import LocalizationKeys from '../../../lib/localizationKeys';
import AppConsts from '../../../lib/appconst';

export interface ICustomItemSelectorOption {

    name: any,
    dataSource: string,
    dataTextField: string,
    dataValueField: string,
    parameters: any[],
    placeholder: string,
    heading: string,
    pageTitle: string
}

export interface ICustomItemSelectorProps {

    componentOptions: ICustomItemSelectorOption,
    savedSelectedItems: any[],
    dataSourceColumns: any[],
    onUpdateRow?: (row: any) => Promise<boolean>;
    onDeleteRow?: (row: any) => Promise<boolean>;
    pageTitle?: string
    overrideActions?: boolean;
    actionsList?: [];
    isDeleteActionVisible?: boolean;
    isEditActionVisible?: boolean;
    source?: string;
}

const CustomItemSelector = forwardRef((props: ICustomItemSelectorProps, ref: any) => {

    const [formRef] = Form.useForm();

    let { componentOptions, savedSelectedItems, dataSourceColumns, onUpdateRow, onDeleteRow, pageTitle, overrideActions, actionsList, isDeleteActionVisible, isEditActionVisible, source } = props;

    //selected items state 
    const [selectedItems, setSelectedItems] = useCompState([]);//useAppState(componentOptions.name, savedSelectedItems);

    //from API get columns
    //loop over apicolumns and convert it to table columns

    useEffect(() => {
        setSelectedItems(savedSelectedItems);
    }, [savedSelectedItems]);
    let columns: any[] = [];

    dataSourceColumns.map((apiCol: any) => {

        columns.push({
            "dataIndex": apiCol.internalName,
            "key": apiCol.internalName,
            "title": apiCol.displayName,
            render: (text: any, record: any) => {
                if (apiCol.render) {
                    return apiCol.render(text, record);
                }
                else {
                    return apiCol.mode == "Edit" ? <FormElement
                        {...apiCol}
                        displayName=""
                        defaultValue={record[apiCol.internalName]}
                        internalName={`customItemSelector_${apiCol.internalName}_${record.id}`}
                        mode={record.isEditable ? 'Edit' : 'ReadOnly'}  >
                    </FormElement> : <div>{text}</div>
                }
            }
        })

    });

    const onSelect = (value: any) => {
        
        if (value) {
            let arr = [...selectedItems];
            value.isEditable = true;
            if (source && source != '')
                value.source = source
            // arr.push(value);
            arr.unshift(value);
            // arr.push(JSON.parse(value));
            setSelectedItems(arr);
        }
    }

    const onRemove = async (value: any) => {
        if (onDeleteRow && typeof (onDeleteRow) == 'function') {
            Modal.confirm({
                title: L(LocalizationKeys.ERP_MsgConfirmOperation.key),
                async onOk() {
                    let res = await onDeleteRow!(value);
                    //  should we ? wait for response here ? 
                    if (res || value.isEditable) {
                        let arr: any = [...selectedItems];
                        setSelectedItems(
                            arr.filter((item: any) => item.id !== value.id)
                        );
                    }
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }
    }

    const editRow = (value: any) => {
        let arr: any = [...selectedItems];
        let item = arr.find((item: any) => item.id == value.id);
        item.isEditable = true;
        setSelectedItems([...arr]);
    }

    const saveRow = async (value: any) => {
        if (onUpdateRow && typeof (onUpdateRow) == 'function') {
            let res = await onUpdateRow!(value);
            //  and should we ? wait for response here ? 
            if (res) {
                let arr: any = [...selectedItems];
                let item = arr.find((item: any) => item.id == value.id);
                item.isEditable = false;
                setSelectedItems([...arr]);
            }
        }
    }

    const isEditEnable = (record: any) => {
        return ((!record.isEditable) && (isEditActionVisible != undefined ? isEditActionVisible : true));
    }
    const checkEnable = (record: any) => {
        return record.isEditable;
    }


    let defaultActions = [{
        "actionName": L(AppConsts.actionNames.DELETE),
        "actionCallback": (value: any) => onRemove(value),
        "appearance": CustomButton.appearances.Delete,
        "isVisible": () => { return isDeleteActionVisible != undefined ? isDeleteActionVisible : true; }
    },
    {
        "actionName": L(AppConsts.actionNames.EDIT),
        "actionCallback": (value: any) => editRow(value),
        "appearance": CustomButton.appearances.Edit,
        "isVisible": isEditEnable
    },
    {
        "actionName": L(AppConsts.actionNames.SAVE),
        "actionCallback": (value: any) => saveRow(value),
        "appearance": CustomButton.appearances.Check,
        "isVisible": checkEnable
    },
        // {
        //     "actionName":  "Additional Target Achieved",
        //     "actionCallback": additionalTargetModal,
        //     "appearance": CustomButton.appearances.MoreInfo,
        //     // "isVisible": isEditEnable
        // }
    ];

    defaultActions = !overrideActions && actionsList ? [...defaultActions, ...actionsList] : overrideActions ? actionsList! : defaultActions;

    let tableOptions = {

        "rowKey": (record: any) => record.id.toString(),
        "bordered": true,
        "columns": columns,
        "loading": (selectedItems === undefined ? true : false),
        "dataSource": (selectedItems === (undefined || null) ? [] : selectedItems),
        "pagination": false,
        "actionsList": defaultActions
    }

    let headerOptions = {
        "createOrUpdateModalOpen": null,
        "enableButton": false
    }

    let searchOptions = {
        "onSearch": null,
        "placeholder": null,
        "enableSearch": false
    }

    return (
        <Form ref={ref} form={formRef} layout="vertical" className="custom-form">
            <div className="custom-item-form">

                <h4 className="custom-selector-title"> {pageTitle} </h4>

                <CustomAutoComplete
                    {...componentOptions}
                    onSelectItem={(value: any) => onSelect(value)}
                    selectedItems={selectedItems} formRef={formRef}
                    componentName='ctrlCustomItemSelectorDropdown'
                />
                <CustomTable
                    options={tableOptions}
                    searchOptions={searchOptions}
                    headerOptions={headerOptions}
                />
            </div>
        </Form>
    )
})

export default CustomItemSelector;
