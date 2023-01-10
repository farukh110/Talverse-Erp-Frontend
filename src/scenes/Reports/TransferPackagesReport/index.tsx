import React, { useEffect, useRef } from 'react';
import { Card, Input, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form';
// import './index.less';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useAppState, useAppStores, useCompState } from '../../../hooks/appStoreHooks';
import OrdersStore from '../../../stores/ordersStore';
import { ContentRequestDto } from '../../../services/Content/dto/contentRequestDto';
import AppConsts from '../../../lib/appconst';
import { L } from '../../../lib/abpUtility';
import LocalizationKeys from '../../../lib/localizationKeys';
import { CustomTable } from '../../../components/CustomGrid';
import TransferPackageReportAdvanceFilterForm from '../TransferPackagesReport/json/TransferPackageReportAdvanceFilterForm.json'
import utils from '../../../utils/utils';
import { CustomButton } from '../../../components/CustomControls';


export interface ITransferReportState {
    maxResultCount: number;
    skipCount: number;
    orderId: number;
    filter: string;
    sorting: string
    showInvoiceModal: boolean;
}


const TransferPackagesReport = (props: any) => {

    const formRef = useRef<FormInstance>(null);

    const initialState: ITransferReportState = {
        maxResultCount: 30,
        skipCount: 0,
        orderId: 0,
        filter: '',
        sorting: 't.PackageId',
        showInvoiceModal: false,
    };

    const { reportsStore } = useAppStores();
    const [compState, setCompState] = useCompState(initialState);
    const [transferRecords, setTransferRecords] = useCompState([]);

    useEffect(() => {
        getTransferPackages();
    }, [compState.filter]);

    const getTransferPackages = async () => {
        let params = [{
            key: "SkipCount",
            value: compState.skipCount
        },
        {
            key: "Sorting",
            value: compState.sorting
        },
        {
            key: "MaxResultCount",
            value: compState.maxResultCount
        }];
        if (compState.filter) {
            params.push({
                "key": "QueryFilters",
                "value": compState.filter
            });
        }
        let requestObj: ContentRequestDto = {
            ComponentIdOrName: 'TransferPackageReport',
            Parameters: params
        }

        let res = await reportsStore.GetTransferPackageReport(requestObj);
        res = res.filter((item:any) => item.equivalentAmount != null );
        setTransferRecords(res);
    }

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        compState.maxResultCount = pagination.pageSize;
        compState.skipCount = (pagination.current - 1) * compState.maxResultCount!
        compState.sorting = sorter && sorter.field ? sorter.field + " " + (sorter.order == "descend" ? "DESC" : "ASC") : 't.PackageId';
        setCompState(compState);
        getTransferPackages();
    };

    const getAllCSVData = async () => {
        let params = [{
            key: "SkipCount",
            value: 0
        },
        {
            key: "Sorting",
            value: compState.sorting
        },
        {
            key: "MaxResultCount",
            value: 5000
        }];
        if (compState.filter) {
            params.push({
                "key": "QueryFilters",
                "value": compState.filter
            });
        }
        let requestObj: ContentRequestDto = {
            ComponentIdOrName: 'TransferPackageReport',
            Parameters: params
        }

        let res = await reportsStore.GetTransferPackageReport(requestObj);
        return res ? res : [];
    }

    const handleSearch = (value: string) => {
        compState.skipCount = 0;
        compState.filter = value;
        setCompState({ ...compState });
    };

    // utils.formattedDate(
    const columns = [
        { title: L(LocalizationKeys.ERP_LblTrackingNumber.key), dataIndex: 'packageId', sorter: true, key: 'packageId', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblTransferDate.key), dataIndex: 'transferDate', sorter: true, key: 'transferDate', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblOrigin.key), dataIndex: 'origin', sorter: true, key: 'origin', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblDestination.key), dataIndex: 'destination', sorter: true, key: 'destination', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblStatus.key), dataIndex: 'status', sorter: true, key: 'status', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblProduct.key), dataIndex: 'product', sorter: true, key: 'product', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblOrderNumber.key), dataIndex: 'orderNum', sorter: true, key: 'orderNum', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblDonorName.key), dataIndex: 'donorName', sorter: true, key: 'donorName', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblOriginalCurrency.key), dataIndex: 'currency', sorter: true, key: 'currency', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblOriginalAmount.key), dataIndex: 'originalAmount', sorter: true, key: 'originalAmount', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblFXRate.key), dataIndex: 'fxRate', sorter: true, key: 'fxRate', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblEquivalentCurrency.key), dataIndex: 'equivalentCurrency', sorter: true, key: 'equivalentCurrency', width: 150, render: (text: string) => <div> {text} </div> },
        { title: L(LocalizationKeys.ERP_LblEquivalentAmount.key), dataIndex: 'equivalentAmount', sorter: true, key: 'amountEquivalent', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblDateOfTransfer.key), dataIndex: 'dateOfTransfer', sorter: true, key: 'dateofTransfer', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblRefrenceOrInvoiceId.key), dataIndex: 'invoiceOrReferenceId', sorter: true, key: 'invoiceOrRefrenceId', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblPersonName.key), dataIndex: 'personName', sorter: true, key: 'personName', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblPersonWhatsApp.key), dataIndex: 'personWhatsAppNumber', sorter: true, key: 'personWhatsappNumber', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblComments.key), dataIndex: 'comments', sorter: true, key: 'comments', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblQuantity.key), dataIndex: 'qty', sorter: true, key: 'qty', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblUsdPrice.key), dataIndex: 'usdPrice', sorter: true, key: 'usdPrice', width: 150, render: (text: string) => <div>{text}</div> },
    ];


    let csvOptions = {
        "getCSVData": getAllCSVData,
        "headers": [
            { label: L(LocalizationKeys.ERP_LblTrackingNumber.key), key: 'packageId' },
            { label: L(LocalizationKeys.ERP_LblTransferDate.key), key: 'transferDate' },
            { label: L(LocalizationKeys.ERP_LblOrigin.key), key: 'origin' },
            { label: L(LocalizationKeys.ERP_LblDestination.key), key: 'destination' },
            { label: L(LocalizationKeys.ERP_LblStatus.key), key: 'status' },
            { label: L(LocalizationKeys.ERP_LblProduct.key), key: 'product' },
            { label: L(LocalizationKeys.ERP_LblOrderNumber.key), key: 'orderNum' },
            { label: L(LocalizationKeys.ERP_LblDonorName.key), key: 'donorName' },
            { label: L(LocalizationKeys.ERP_LblOriginalCurrency.key), key: 'currency' },
            { label: L(LocalizationKeys.ERP_LblOriginalAmount.key), key: 'originalAmount' },
            { label: L(LocalizationKeys.ERP_LblFXRate.key), key: 'fxRate' },
            { label: L(LocalizationKeys.ERP_LblEquivalentCurrency.key), key: 'equivalentCurrency' },
            { label: L(LocalizationKeys.ERP_LblEquivalentAmount.key), key: 'equivalentAmount' },
            { label: L(LocalizationKeys.ERP_LblDateOfTransfer.key), key: 'dateOfTransfer' },
            { label: L(LocalizationKeys.ERP_LblRefrenceOrInvoiceId.key), key: 'invoiceOrReferenceId' },
            { label: L(LocalizationKeys.ERP_LblPersonName.key), key: 'personName' },
            { label: L(LocalizationKeys.ERP_LblPersonWhatsApp.key), key: 'personWhatsAppNumber' },
            { label: L(LocalizationKeys.ERP_LblComments.key), key: 'comments' },
            { label: L(LocalizationKeys.ERP_LblQuantity.key), key: 'qty' },
            { label: L(LocalizationKeys.ERP_LblUsdPrice.key), key: 'usdPrice' },
        ],
        "fileName": "TransferPackageReport.csv",
        "enableExport": true
    }


    let tableOptions = {
        "rowKey": (record: any) => record?.packageId?.toString() + record?.qty?.toString(),
        "bordered": true,
        "columns": columns,
        "pagination":false,
        // "pagination": { pageSize: compState.maxResultCount, total: transferRecords === (undefined || null) ? 0 : transferRecords.length, defaultCurrent: 1 },
        "loading": (transferRecords === undefined ? true : false),
        "dataSource": (transferRecords === (undefined || null) ? [] : transferRecords),
        "onChange": handleTableChange,
        "actionsList": [],
        "getGridData": getTransferPackages,
        "enableSorting": true,
    }
    let headerOptions = {
        "createOrUpdateModalOpen": () => { },
        "enableButton": false
    }
    let searchOptions = {
        "onSearch": handleSearch,
        "placeholder": L(LocalizationKeys.ERP_LblFilter.key),
        "enableSearch": false,
        "advanceFilterFields": TransferPackageReportAdvanceFilterForm,
        "enableAdvanceSearch": true
    }
    return (
        <>
            <Card >
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
export default TransferPackagesReport;