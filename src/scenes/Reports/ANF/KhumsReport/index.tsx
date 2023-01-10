import React, { useEffect, useRef } from 'react';
import { Card } from 'antd';
import { FormInstance } from 'antd/lib/form';
// import './index.less';
import { L } from '../../../../lib/abpUtility';
import LocalizationKeys from '../../../../lib/localizationKeys';
import utils from '../../../../utils/utils';
import { useAppStores, useCompState } from '../../../../hooks/appStoreHooks';
import { CustomTable } from '../../../../components/CustomGrid';
import AnfKhumsAdvanceFilterForm from './json/AnfKhumsAdvanceFilterForm.json'
import AppConsts from '../../../../lib/appconst';


export interface IKhumsReportState {

    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    filter: string;
    sorting: string;
}

const AnfKhumsReport = (props: any) => {

    const formRef = useRef<FormInstance>(null);

    const initialState: IKhumsReportState = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        filter: "",
        sorting: "",
    };

    const { reportsStore } = useAppStores();
    const [compState, setCompState] = useCompState(initialState);
    const [khums, setKhumsRecord] = useCompState({});

    useEffect(() => {
        getKhumsReport();
    }, [compState.filter]);

    const getKhumsReport = async () => {

        let response = await getKhumsReportData();
        setKhumsRecord({
            totalCount: response.length,
            items: response
        });
    }

    const getAllCSVData = async () => {
        let response = await getKhumsReportData();
        return response;
    }

    const getKhumsReportData = async () => {
        try {
            let filter = compState.filter && compState.filter.filters ? compState.filter : null;
            let defaultFilter = { programType: "islamic-payments", program: "-khums" };

            if (filter && filter.filters.length == 2) {
                defaultFilter['from'] = filter.filters[0].value;
                defaultFilter['to'] = filter.filters[1].value;
            }

            let response = await reportsStore.GetAnfKhumsReport(defaultFilter);

            if (response)
                return response;
            else {
                utils.getAlertMessage(AppConsts.alertMessageTypes.error, LocalizationKeys.ERP_MsgRequestedFailed.key);
                return [];
            }


        }
        catch (ex) {

        }
    }

    const handleSearch = (value: string) => {
        compState.skipCount = 0;
        compState.filter = value;
        setCompState({ ...compState });
    };


    const handleTableChange = (pagination: any, filters: any, sorter: any) => {

        compState.maxResultCount = pagination.pageSize;
        compState.skipCount = (pagination.current - 1) * compState.maxResultCount!
        compState.sorting = sorter && sorter.field ? sorter.field + " " + (sorter.order == "descend" ? "DESC" : "ASC") : 'Khums DESC';
        setCompState(compState);
        //getKhumsReport();
    };

    const columns = [
        { title: L(LocalizationKeys.ERP_LblOrderNumber.key), dataIndex: 'orderNumber', sorter: false, key: 'orderNumber', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblAppName.key), dataIndex: 'appName', sorter: false, key: 'appName', width: 100, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblProductName.key), dataIndex: 'productName', sorter: false, key: 'productName', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblOrderDate.key), dataIndex: 'orderDate', sorter: false, key: 'orderDate', width: 120, render: (text: string) => <div>{utils.formattedDate(text)}</div> },
        { title: L(LocalizationKeys.ERP_LblCreationDate.key), dataIndex: 'creationDate', sorter: false, key: 'creationDate', width: 150, render: (text: string) => <div> {utils.formattedDate(text)} </div> },
        { title: L(LocalizationKeys.ERP_LblDeadline.key), dataIndex: 'deadline', sorter: false, key: 'deadline', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblCurrency.key), dataIndex: 'currency', sorter: false, key: 'currency', width: 120, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblAmount.key), dataIndex: 'amount', sorter: false, key: 'amount', width: 130, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblRepName.key), dataIndex: 'repName', sorter: false, key: 'repName', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblMarjaeName.key), dataIndex: 'marjaeName', sorter: false, key: 'marjaeName', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblSahmType.key), dataIndex: 'sahmType', sorter: false, key: 'sahmType', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblReceiptRequired.key), dataIndex: 'receiptRequired', sorter: false, key: 'receiptRequired', width: 120, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblNameOnMarjaReceipt.key), dataIndex: 'nameonMarjaReceipt', sorter: false, key: 'nameonMarjaReceipt', width: 180, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblAdditionalNote.key), dataIndex: 'additionalNote', sorter: false, key: 'additionalNote', width: 150, render: (text: string) => <div>{text}</div> },
    ];

    let csvOptions = {
        "getCSVData": getAllCSVData,
        "headers": [

            { label: L(LocalizationKeys.ERP_LblOrderNumber.key), key: "orderNumber" },
            { label: L(LocalizationKeys.ERP_LblAppName.key), key: "appName" },
            { label: L(LocalizationKeys.ERP_LblProductName.key), key: "productName" },
            { label: L(LocalizationKeys.ERP_LblOrderDate.key), key: "orderDate" },
            { label: L(LocalizationKeys.ERP_LblCreationDate.key), key: "creationDate" },
            { label: L(LocalizationKeys.ERP_LblDeadline.key), key: "deadline" },
            { label: L(LocalizationKeys.ERP_LblCurrency.key), key: "currency" },
            { label: L(LocalizationKeys.ERP_LblAmount.key), key: "amount" },
            { label: L(LocalizationKeys.ERP_LblRepName.key), key: "repName" },
            { label: L(LocalizationKeys.ERP_LblMarjaeName.key), key: "marjaeName" },
            { label: L(LocalizationKeys.ERP_LblSahmType.key), key: "sahmType" },
            { label: L(LocalizationKeys.ERP_LblReceiptRequired.key), key: "receiptRequired" },
            { label: L(LocalizationKeys.ERP_LblNameOnMarjaReceipt.key), key: "nameonMarjaReceipt" },
            { label: L(LocalizationKeys.ERP_LblAdditionalNote.key), key: "additionalNote" },

        ],
        "fileName": "AnfKhumsReport.csv",
        "enableExport": true
    }

    let tableOptions = {
        "rowKey": (record: any) => record.orderNumber.toString(),
        "bordered": true,
        "columns": columns,
        "pagination": { pageSize: compState.maxResultCount, total: khums === (undefined || null) ? 0 : khums.totalCount, defaultCurrent: 1 },
        "loading": (khums === undefined ? true : false),
        "dataSource": (khums === (undefined || null) ? [] : khums.items),
        "actionsList": [],
        "getGridData": getKhumsReport,
        "onChange": handleTableChange,
        "enableSorting": false,
    }

    let headerOptions = {
        "createOrUpdateModalOpen": () => { },
        "enableButton": false
    }

    let searchOptions = {
        "onSearch": handleSearch,
        "placeholder": L(LocalizationKeys.ERP_LblFilter.key),
        "enableSearch": false,
        "advanceFilterFields": AnfKhumsAdvanceFilterForm,
        "enableAdvanceSearch": true
    }

    return (
        <>
            <Card>
                <CustomTable
                    options={tableOptions}
                    searchOptions={searchOptions}
                    csvOptions={csvOptions}
                    headerOptions={headerOptions}
                />
            </Card>
        </>
    )
}

export default AnfKhumsReport;