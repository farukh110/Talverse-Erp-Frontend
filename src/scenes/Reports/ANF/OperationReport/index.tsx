import React, { useEffect, useRef } from 'react';
import { Card, Input, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form';
// import './index.less';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useAppState, useAppStores, useCompState } from '../../../../hooks/appStoreHooks';
import OrdersStore from '../../../../stores/ordersStore';
import { ContentRequestDto } from '../../../../services/Content/dto/contentRequestDto';
import AppConsts from '../../../../lib/appconst';
import { L } from '../../../../lib/abpUtility';
import LocalizationKeys from '../../../../lib/localizationKeys';
import { CustomTable } from '../../../../components/CustomGrid';
import AnfOperationReportAdvanceFilterForm from '../OperationReport/json/AnfOperationReportAdvanceFilterForm.json'
import utils from '../../../../utils/utils';
import { CustomButton } from '../../../../components/CustomControls';


export interface IOrderState {
    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    orderId: number;
    filter: string;
    sorting: string
}


const AnfOrderReport = (props: any) => {

    const formRef = useRef<FormInstance>(null);

    const initialState: IOrderState = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        orderId: 0,
        filter: '',
        sorting: '',
    };

    const { reportsStore } = useAppStores();
    const [compState, setCompState] = useCompState(initialState);
    const [orders, setOrders] = useCompState({});


    useEffect(() => {
        getAllOrderDetail();
    }, [compState.filter]);

    const getAllOrderDetail = async () => {

        let response = await getReportData();
        setOrders({
            totalCount: response.length,
            items: response
        });

    }


    const getAllCSVData = async () => {
        let response = await getReportData();
        return response;
    }

    const getReportData = async () => {
        try {
            let filter = compState.filter && compState.filter.filters ? compState.filter : null;
            let defaultFilter = {};

            if (filter && filter.filters.length == 2) {
                defaultFilter['from'] = filter.filters[0].value;
                defaultFilter['to'] = filter.filters[1].value;
            }

            let response = await reportsStore.GetAnfOperationsReportReport(defaultFilter);

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



    const handleTableChange = (pagination: any, filters: any, sorter: any) => {

        compState.maxResultCount = pagination.pageSize;
        compState.skipCount = (pagination.current - 1) * compState.maxResultCount!
        compState.sorting = sorter && sorter.field ? sorter.field + " " + (sorter.order == "descend" ? "DESC" : "ASC") : 'OrderId DESC';

        setCompState(compState);
        // getAllOrderDetail();
    };



    const handleSearch = (value: string) => {
        compState.skipCount = 0;
        compState.filter = value;
        setCompState({ ...compState });
    };

    const columns = [
        { title: L(LocalizationKeys.ERP_LblOrderNum.key), dataIndex: 'orderNo', sorter: false, key: 'orderNo', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblDateOfRequest.key), dataIndex: 'dateOfRequest', sorter: false, key: 'dateOfRequest', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblOrderCreationTime.key), dataIndex: 'orderCreationTime', sorter: false, key: 'orderCreationTime', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblCategory.key), dataIndex: 'category', sorter: false, key: 'category', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblProgramName.key), dataIndex: 'programName', sorter: false, key: 'programName', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblProductName.key), dataIndex: 'productName', sorter: false, key: 'productName', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblOccasion.key), dataIndex: 'occasion', sorter: false, key: 'occasion', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblOtherOccasion.key), dataIndex: 'otherOccasion', sorter: false, key: 'otherOccasion', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblZiyara.key), dataIndex: 'ziyara', sorter: false, key: 'ziyara', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblMarhumName.key), dataIndex: 'marhumName', sorter: false, key: 'marhumName', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblChildName.key), dataIndex: 'childName', sorter: false, key: 'childName', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblFitrahType.key), dataIndex: 'fitrahType', sorter: false, key: 'fitrahType', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblFitrahDonorCountry.key), dataIndex: 'fitrah', sorter: false, key: 'fitrah', width: 150, render: (text: string) => <div> {text} </div> },
        { title: L(LocalizationKeys.ERP_LblDateOfExecution.key), dataIndex: 'dateofExecution', sorter: false, key: 'dateofExecution', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblQuantity.key), dataIndex: 'quantity', sorter: false, key: 'quantity', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblCountry.key), dataIndex: 'country', sorter: false, key: 'country', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblCity.key), dataIndex: 'city', sorter: false, key: 'city', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblHolyShrine.key), dataIndex: 'holyShrine', sorter: false, key: 'holyShrine', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblOrphanType.key), dataIndex: 'orphanType', sorter: false, key: 'orphanType', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblOrphanID.key), dataIndex: 'orphanID', sorter: false, key: 'orphanID', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblCurrency.key), dataIndex: 'currency', sorter: false, key: 'currency', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblUnitAmount.key), dataIndex: 'unitAmount', sorter: false, key: 'unitAmount', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblTotalAmount.key), dataIndex: 'totalAmount', sorter: false, key: 'totalAmount', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblAdditionalComments.key), dataIndex: 'additionalComments', sorter: false, key: 'additionalComments', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblRepName.key), dataIndex: 'repName', sorter: false, key: 'repName', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblIC.key), dataIndex: 'iC', sorter: false, key: 'iC', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblHolyPersonality.key), dataIndex: 'holyPersonality', sorter: false, key: 'holyPersonality', width: 150, render: (text: string) => <div>{text}</div> },

    ];

    let csvOptions = {
        "getCSVData": getAllCSVData,
        "headers": [
            { label: L(LocalizationKeys.ERP_LblOrderNum.key), key: 'orderNo' },
            { label: L(LocalizationKeys.ERP_LblDateOfRequest.key), key: 'dateOfRequest' },
            { label: L(LocalizationKeys.ERP_LblOrderCreationTime.key), key: 'orderCreationTime' },
            { label: L(LocalizationKeys.ERP_LblCategory.key), key: 'category' },
            { label: L(LocalizationKeys.ERP_LblProgramName.key), key: 'programName' },
            { label: L(LocalizationKeys.ERP_LblProductName.key), key: 'productName' },
            { label: L(LocalizationKeys.ERP_LblOccasion.key), key: 'occasion' },
            { label: L(LocalizationKeys.ERP_LblOtherOccasion.key), key: 'otherOccasion' },
            { label: L(LocalizationKeys.ERP_LblZiyara.key), key: 'ziyara' },
            { label: L(LocalizationKeys.ERP_LblMarhumName.key), key: 'marhumName' },
            { label: L(LocalizationKeys.ERP_LblChildName.key), key: 'childName' },
            { label: L(LocalizationKeys.ERP_LblFitrahType.key), key: 'fitrahType' },
            { label: L(LocalizationKeys.ERP_LblFitrahDonorCountry.key), key: 'fitrah' },
            { label: L(LocalizationKeys.ERP_LblDateOfExecution.key), key: 'dateofExecution' },
            { label: L(LocalizationKeys.ERP_LblQuantity.key), key: 'quantity' },
            { label: L(LocalizationKeys.ERP_LblCountry.key), key: 'country' },
            { label: L(LocalizationKeys.ERP_LblCity.key), key: 'city' },
            { label: L(LocalizationKeys.ERP_LblHolyShrine.key), key: 'holyShrine' },
            { label: L(LocalizationKeys.ERP_LblOrphanType.key), key: 'orphanType' },
            { label: L(LocalizationKeys.ERP_LblOrphanID.key), key: 'orphanID' },
            { label: L(LocalizationKeys.ERP_LblCurrency.key), key: 'currency' },
            { label: L(LocalizationKeys.ERP_LblUnitAmount.key), key: 'unitAmount' },
            { label: L(LocalizationKeys.ERP_LblTotalAmount.key), key: 'totalAmount' },
            { label: L(LocalizationKeys.ERP_LblAdditionalComments.key), key: 'additionalComments' },
            { label: L(LocalizationKeys.ERP_LblRepName.key), key: 'repName' },
            { label: L(LocalizationKeys.ERP_LblIC.key), key: 'iC' },
            { label: L(LocalizationKeys.ERP_LblHolyPersonality.key), key: 'holyPersonality' },


        ],
        "fileName": "AnfOperationOrderReport.csv",
        "enableExport": true
    }

    let tableOptions = {
        "rowKey": (record: any) => record.orderNo.toString(),
        "bordered": true,
        "columns": columns,
        "pagination": { pageSize: compState.maxResultCount, total: orders === (undefined || null) ? 0 : orders.totalCount, defaultCurrent: 1 },
        "loading": (orders === undefined ? true : false),
        "dataSource": (orders === (undefined || null) ? [] : orders.items),
        "onChange": handleTableChange,
        "actionsList": [],
        "getGridData": getAllOrderDetail,
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
        "advanceFilterFields": AnfOperationReportAdvanceFilterForm,
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
export default AnfOrderReport;