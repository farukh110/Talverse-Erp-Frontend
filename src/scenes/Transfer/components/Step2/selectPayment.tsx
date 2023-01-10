import React, { useEffect, useRef } from 'react'
import { Table, Form, Modal } from 'antd';
import { CustomButton, CustomCol, CustomRow } from '../../../../components/CustomControls';
import { L } from '../../../../lib/abpUtility';
import CustomNumberInput from '../../../../components/CustomWebControls/CustomNumberTextbox/customNumberInput';
import { useAppState, useAppStores, useCompState } from '../../../../hooks/appStoreHooks';
import TransferStore from '../../../../stores/transferStore';
import LocalizationKeys from '../../../../lib/localizationKeys';

export interface ITransferState {
    dataList: [],
    orderList: [],
    isSelect: boolean,
    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    transferId: number;
    filter: string;
    sorting: string;
}

const SelectPayment = (props: any) => {

    const { validations, pendingTransfersList, formRef, editMode } = props;
    const [checkStrictly, setCheckStrictly] = useCompState(false);

    const namePrefix = TransferStore.AppStateKeys.prefixes.SELECTED_PAYMENTS;

    const [alreadySelectedRows, setAlreadySelectedRows] = useAppState(TransferStore.AppStateKeys.PENDING_TRANSFERS_SELECTED_KEYS);
    const [isInEditMode, setIsInEditMode] = useAppState(TransferStore.AppStateKeys.RETAIN_TRANSFER_DATA, false);
    const selectedRowsRef = useRef([]);
    selectedRowsRef.current = alreadySelectedRows;
    const initialState: ITransferState = {
        dataList: [],
        orderList: [],
        isSelect: false,
        modalVisible: false,
        maxResultCount: 50,
        skipCount: 0,
        transferId: 0,
        filter: '',
        sorting: ''
    };

    const [compState, setCompState] = useCompState(initialState);
    // const [transfers] = useAppState(transferStore.AppStateKeys.TRANSFER, {});

    const onLoad = () => {
        initializePendingTransferData();
    }
    useEffect(onLoad, [pendingTransfersList]);
    const onSelectedRowsChange = () => {
        setParentAmountOnKeySelection();
        if (isInEditMode) {
            initializePendingTransferData();
        }
    }
    useEffect(onSelectedRowsChange, [alreadySelectedRows, isInEditMode]);
    const getInputControl = (obj: any, index: number) => {
        let ctrl: any;
        if (obj.ordersList) {
            ctrl = <CustomNumberInput label={""}
                value={obj.transferAmount}
                name={`${namePrefix}${obj.id}${TransferStore.AppStateKeys.prefixes.TRANSFER_AMOUNT}`}
                rules={validations.amount} max={obj.pendingAmount} disable={true} formRef={formRef} />
        }
        else {
            ctrl = <CustomNumberInput label={""}
                value={obj.transferAmount}
                name={`${namePrefix}${obj.id}${TransferStore.AppStateKeys.prefixes.TRANSFER_AMOUNT}`}
                rules={validations.amount} max={obj.pendingAmount} disable={editMode && !isInEditMode} formRef={formRef} />
        }
        return ctrl;
    }
    const initializePendingTransferData = () => {
        let dataList: any = [];
        let selectedKeys: any = [];
        let index = 0;
        if (pendingTransfersList && pendingTransfersList.length > 0)
            pendingTransfersList.map((transferItem: any) => {
                const rowId = `rw-${transferItem.id}`;
                if (transferItem.isSelected && !transferItem.ordersList) {
                    selectedKeys.push(rowId);
                }
                index++;
                dataList.push({
                    isSelected: transferItem.isSelected,
                    key: rowId,
                    ctrlId: `${namePrefix}${transferItem.id}${TransferStore.AppStateKeys.prefixes.TRANSFER_AMOUNT}`,
                    categoryName: transferItem.name,
                    amount: transferItem.currencySymbol + transferItem.pendingAmount,
                    pendingAmount: transferItem.pendingAmount,
                    transferAmount: getInputControl(transferItem, index),
                    children: transferItem.ordersList?.map((orderItem: any) => {
                        index++;
                        const cRowId = `rw-${transferItem.id}-${orderItem.orderId}`;
                        if ( orderItem.isSelected)
                            selectedKeys.push(cRowId);

                        return {
                            key: cRowId,
                            ctrlId: `${namePrefix}${transferItem.id}_${orderItem.orderId}${TransferStore.AppStateKeys.prefixes.TRANSFER_AMOUNT}`,
                            categoryName: ` ${orderItem.name} (${orderItem.orderNumber})`,
                            amount: orderItem.currencySymbol + orderItem.pendingAmount,
                            pendingAmount: orderItem.pendingAmount,
                            transferAmount: <CustomNumberInput label=''
                                value={orderItem.transferAmount}
                                name={`${namePrefix}${transferItem.id}_${orderItem.orderId}${TransferStore.AppStateKeys.prefixes.TRANSFER_AMOUNT}`}
                                rules={validations.amount} max={orderItem.pendingAmount} formRef={formRef} onChangeChild={onChangeValue} disable={(!orderItem.isEditable) || (editMode && !isInEditMode)} />
                        }
                    })
                });
            });
        if (!alreadySelectedRows || (alreadySelectedRows && alreadySelectedRows.length == 0) && !isInEditMode) {
            setAlreadySelectedRows(selectedKeys);
        }
        compState.dataList = dataList;
        setCompState({ ...compState });
    }

    const onChangeValue = (val?: any, field?: string) => {
        let formValues = formRef?.getFieldsValue(true);
        let splitedKey = field!.split('_');
        //splitedKey[0] -- "selectedPayments"
        //splitedKey[1] -- "parentId"
        //splitedKey[2] -- childId
        //splitedKey[3] -- transferAmount

        let properyStartsWith = `${splitedKey[0]}_${splitedKey[1]}_`;
        let totalParentAmount = calculateTotalParentAmount(formValues, properyStartsWith, selectedRowsRef.current);
        if (totalParentAmount > 0) {
            let fieldName = `${splitedKey[0]}_${splitedKey[1]}_${splitedKey[3]}`;
            setTotalParentAmount(fieldName, totalParentAmount);
        }
    }
    const setParentAmountOnKeySelection = () => {
        let formValues = formRef?.getFieldsValue(true);
        if (formValues) {
            Object.keys(formValues).forEach(function (key) {
                if (key.startsWith('selectedPayments')) {
                    let splitedKey = key.split('_');
                    if (splitedKey.length === 3) {
                        let properyStartsWith = `${splitedKey[0]}_${splitedKey[1]}_`;
                        let totalParentAmount = calculateTotalParentAmount(formValues, properyStartsWith, alreadySelectedRows);
                        if (totalParentAmount > 0) {
                            let fieldName = `${splitedKey[0]}_${splitedKey[1]}_transferAmount`;
                            setTotalParentAmount(fieldName, totalParentAmount);
                        }
                    }
                }
            });
        }
    }
    const calculateTotalParentAmount = (formValues: any, properyStartsWith: string, selectedKeys: any) => {
        let sum = 0;
        for (const property in formValues) {
            try {
                if (property.startsWith(properyStartsWith)) {
                    let temp = property.split('_')
                    if (temp.length == 4) {
                        let childId = `rw-${temp[1]}-${temp[2]}`
                        let itemIsSelected = selectedKeys.find((item: any) => item == childId);
                        if (itemIsSelected)
                            sum = Number(sum) + Number(formValues[property]);
                    }
                }
            }
            catch (e) {
                console.log(`error: ${e}`);
            }
        }
        return sum;
    }

    const setTotalParentAmount = (fieldName: string, totalParentAmount: Number) => {
        try {
            let setObj = {};
            setObj[fieldName] = totalParentAmount;
            formRef!.setFieldsValue(setObj);
        } catch (e) {
            console.log(`error: ${e}`);

        }
    }

    const columns = [
        {
            title: 'Category Name - Currency',
            dataIndex: 'categoryName',
            key: 'categoryName',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Transfer Amount',
            dataIndex: 'transferAmount',
            width: '30%',
            key: 'transferAmount',
        },
    ];

    const confirm = Modal.confirm;
    const onEditClick = () => {
        try {
            // add popUp or Message that if continue , details will be reset 
            confirm({
                title: L(LocalizationKeys.ERP_MsgConfirmTransferEdit.key),
                onOk() {
                    setCompState({ ...compState });
                    setIsInEditMode(true);
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }
        catch (ex) {
            console.log(`error: ${ex}`);
        }
    }
    const onDiscardClick = () => {
        try {
            // add popUp or Message that if continue , details will be reset 
            confirm({
                title: L(LocalizationKeys.ERP_MsgConfirmTransferDiscard.key),
                onOk() {
                    setCompState({ ...compState });
                    setAlreadySelectedRows([]);
                    setIsInEditMode(false);
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }
        catch (ex) {
            console.log(`error: ${ex}`);
        }
    }


    const handleRowSelection = (record: any, isChecked: boolean) => {
        try {
            if (isChecked) {
                if (formRef.getFieldValue(record.ctrlId) === 0)//get value of transfer amount
                    setTotalParentAmount(record.ctrlId, record.pendingAmount);
            }
            else
                setTotalParentAmount(record.ctrlId, 0)

            if (record.children) {
                record.children.forEach((item: any) => {
                    if (isChecked) {
                        if (formRef.getFieldValue(item.ctrlId) === 0)//get value of transfer amount
                            setTotalParentAmount(item.ctrlId, item.pendingAmount);
                    }
                    else
                        setTotalParentAmount(item.ctrlId, 0)
                });
            }
        } catch (ex) {
        }
    }
    return (
        <>

            <CustomRow gutter={[8, 32]}>

                <CustomCol span={24}>

                    <div className='float-right'>

                        {editMode && !isInEditMode &&
                            <CustomButton className='btn-padding btn-green' appearance={CustomButton.appearances.Edit} onClick={onEditClick} > {L(LocalizationKeys.ERP_LblEdit.key)} </CustomButton>
                        }
                        {editMode && isInEditMode &&
                            <CustomButton className='btn-padding btn-red' appearance={CustomButton.appearances.Delete} onClick={onDiscardClick} > {L(LocalizationKeys.ERP_LblDiscard.key)} </CustomButton>
                        }


                    </div>

                </CustomCol>

            </CustomRow>

            <br />

            <CustomRow>

                <CustomCol className="multi-step-table" span={24}>

                    {compState.dataList && compState.dataList.length > 0 && <Table
                        columns={columns} rowKey="key"
                        bordered
                        // rowSelection={{ ...rowSelection, checkStrictly }}
                        rowSelection={editMode && !isInEditMode ? { selectedRowKeys: compState.dataList && compState.dataList.length > 0 ? alreadySelectedRows : [], checkStrictly } : {
                            type: 'checkbox',
                            selectedRowKeys: compState.dataList && compState.dataList.length > 0 ? alreadySelectedRows : [],
                            onChange: (key, _selectedRows) => {
                                setAlreadySelectedRows(key);
                            },
                            onSelect: (record: any, isChecked: boolean) => {
                                handleRowSelection(record, isChecked);
                            },
                            onSelectAll: (isChecked: any, records: any) => {
                                records.forEach((record: any) => {
                                    handleRowSelection(record, isChecked);
                                });
                            },
                            checkStrictly,
                        }}
                        dataSource={compState.dataList}
                        pagination={false}
                        size="small"
                    />}

                </CustomCol>

            </CustomRow>

        </>
    )
}

export default SelectPayment;
