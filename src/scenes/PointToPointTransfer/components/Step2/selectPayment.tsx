import React, { useEffect, useRef } from 'react'
import { Table, Form, Modal } from 'antd';
import { CustomButton, CustomCol, CustomRow } from '../../../../components/CustomControls';
import { L } from '../../../../lib/abpUtility';
import CustomNumberInput from '../../../../components/CustomWebControls/CustomNumberTextbox/customNumberInput';
import { useAppState, useAppStores, useCompState } from '../../../../hooks/appStoreHooks';
import PointToPointTransferSore from '../../../../stores/pointToPointTransferSore';
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

    const namePrefix = PointToPointTransferSore.AppStateKeys.prefixes.SELECTED_PAYMENTS;

    const [alreadySelectedRows, setAlreadySelectedRows] = useAppState(PointToPointTransferSore.AppStateKeys.PENDING_TRANSFERS_SELECTED_KEYS);
    const [isInEditMode, setIsInEditMode] = useAppState(PointToPointTransferSore.AppStateKeys.RETAIN_TRANSFER_DATA, false);
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
        if (isInEditMode) {
            initializePendingTransferData();
        }
    }
    useEffect(onSelectedRowsChange, [alreadySelectedRows,isInEditMode]);

    const initializePendingTransferData = () => {
        let dataList: any = [];
        let selectedKeys: any = [];
        let index = 0;
        if (pendingTransfersList && pendingTransfersList.balanceAmount && pendingTransfersList.balanceAmount.length > 0)
            pendingTransfersList.balanceAmount.map((transferItem: any) => {
                const rowId = `rw-${transferItem.currencyId}`;
                if (transferItem.isSelected) {
                    selectedKeys.push(rowId);
                }
                index++;
                dataList.push({
                    key: rowId,
                    categoryName: `${transferItem.currencyCode} - ${pendingTransfersList.currencyList.find((cur: any) => cur.coreId == transferItem.currencyId)?.name} `,
                    amount: transferItem.currencySymbol + transferItem.amount,
                    transferAmount: <CustomNumberInput label={""}
                        value={transferItem.transferAmount}
                        name={`${namePrefix}${transferItem.currencyId}${PointToPointTransferSore.AppStateKeys.prefixes.TRANSFER_AMOUNT}`}
                        rules={validations.amount} max={transferItem.amount} disable={editMode && !isInEditMode} formRef={formRef} />,
                });
            });
        if (!alreadySelectedRows || (alreadySelectedRows && alreadySelectedRows.length == 0) && !isInEditMode) {
            setAlreadySelectedRows(selectedKeys);
        }
        compState.dataList = dataList;
        setCompState({ ...compState });
    }

    const columns = [
        {
            title: 'Un-Transferred Balances - Currency',
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
                    setIsInEditMode(true);
                    initializePendingTransferData();
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
    return (
        <>
            <CustomRow gutter={[8, 32]}>

                <CustomCol span={24}>

                    <div className='float-right'>

                        {editMode && !isInEditMode &&
                            <CustomButton className='btn-padding btn-green' appearance={CustomButton.appearances.Edit} onClick={onEditClick} > {"Edit"} </CustomButton>
                        }
                        {editMode && isInEditMode &&
                            <CustomButton className='btn-padding btn-red' appearance={CustomButton.appearances.Delete} onClick={onDiscardClick} > {"Discard"} </CustomButton>
                        }

                    </div>
                </CustomCol>

            </CustomRow>

            <br />


            <CustomRow>
                <CustomCol className="multi-step-table" span={24}>
                    <Table
                        columns={columns} rowKey="key"
                        bordered
                        // rowSelection={{ ...rowSelection, checkStrictly }}
                        rowSelection={editMode && !isInEditMode ? { selectedRowKeys: compState.dataList && compState.dataList.length > 0 ? alreadySelectedRows : [], checkStrictly } : {
                            type: 'checkbox',
                            selectedRowKeys: compState.dataList && compState.dataList.length > 0 ? alreadySelectedRows : [],
                            onChange: (key, _selectedRows) => {
                                setAlreadySelectedRows(key);
                            },
                            onSelect: (record: any) => {
                            },
                            checkStrictly,
                        }}
                        dataSource={compState.dataList}
                        pagination={false}
                        size="small"
                    />
                </CustomCol>
            </CustomRow>
        </>
    )
}

export default SelectPayment;
