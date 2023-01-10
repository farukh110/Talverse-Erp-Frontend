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
import orderAdvanceFilterForm from '../../Orders/json/orderAdvanceFilterForm.json'
import utils from '../../../utils/utils';
import { CustomButton } from '../../../components/CustomControls';


export interface IOrderState {
    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    orderId: number;
    filter: string;
    sorting: string
    showInvoiceModal: boolean;
}


const OrderReport = (props: any) => {

    const formRef = useRef<FormInstance>(null);

    const initialState: IOrderState = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        orderId: 0,
        filter: '',
        sorting: 'OrderId DESC',
        showInvoiceModal: false,
    };

    const { ordersStore, userStore, programCategoryStore } = useAppStores();
    const [compState, setCompState] = useCompState(initialState);
    const [orders] = useAppState(OrdersStore.AppStateKeys.ORDERS, {});
    const [editOrder, setEditOrder] = useAppState(OrdersStore.AppStateKeys.EDIT_ORDER, {});


    useEffect(() => {
        getAllOrderDetail();
    }, [compState.filter]);

    const getAllOrderDetail = async () => {
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
            ComponentIdOrName: 'OrderList',
            Parameters: params
        }
        let res = await ordersStore.GetComponentData(requestObj, 'GetAll');

    }

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {

        compState.maxResultCount = pagination.pageSize;
        compState.skipCount = (pagination.current - 1) * compState.maxResultCount!
        compState.sorting = sorter && sorter.field ? sorter.field + " " + (sorter.order == "descend" ? "DESC" : "ASC") : 'OrderId DESC';

        setCompState(compState);
        getAllOrderDetail();
    };

    const csvClick = async () => {

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
            value: 10000
        }];
        if (compState.filter) {
            params.push({
                "key": "QueryFilters",
                "value": compState.filter
            });
        }
        let requestObj: ContentRequestDto = {
            ComponentIdOrName: 'OrderReport',
            Parameters: params
        }
        let res = await ordersStore.GetCustomCsv(requestObj);
        utils.downloadFile(res, `Operations Report ${utils.formattedDate(new Date())}.csv`);

    }

    const handleSearch = (value: string) => {
        compState.skipCount = 0;
        compState.filter = value;
        setCompState({ ...compState });
    };


    const columns = [
        { title: L(LocalizationKeys.ERP_LblOrderNumber.key), dataIndex: 'orderNumber', sorter: true, key: 'orderNumber', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblDate.key), dataIndex: 'orderDate', sorter: true, key: 'orderDate', width: 150, render: (text: string) => <div>{utils.formattedDate(text)}</div> },
        { title: L(LocalizationKeys.ERP_LblProduct.key), dataIndex: 'product', sorter: true, key: 'product', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblCategory.key), dataIndex: 'category', sorter: true, key: 'category', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblCampaign.key), dataIndex: 'campaign', sorter: true, key: 'campaign', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblDonorName.key), dataIndex: 'placedFor', sorter: true, key: 'placedFor', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblRepName.key), dataIndex: 'placedBy', sorter: true, key: 'placedBy', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblQuantity.key), dataIndex: 'quantity', sorter: true, key: 'quantity', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblCurrency.key), dataIndex: 'symbol', sorter: true, key: 'symbol', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblAmount.key), dataIndex: 'amount', sorter: true, key: 'amount', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblOrderStatus.key), dataIndex: 'status', sorter: true, key: 'status', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblCreatedOn.key), dataIndex: 'creationTime', sorter: true, key: 'creationTime', width: 150, render: (text: string) => <div> {utils.formattedDateAndTime(text)} </div> },
        { title: L(LocalizationKeys.ERP_LblCreatorUserId.key), dataIndex: 'creatorUser', sorter: true, key: 'creatorUser', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblLastModificationTime.key), dataIndex: 'lastModificationTime', sorter: true, key: 'lastModificationTime', width: 150, render: (text: string) => <div>{utils.formattedDateAndTime(text)}</div> },
        { title: L(LocalizationKeys.ERP_LblLastModifierUserId.key), dataIndex: 'lastModifierUser', sorter: true, key: 'lastModifierUser', width: 150, render: (text: string) => <div>{text}</div> },
    ];

    let csvOptions = {
        downloadCSV: csvClick,
        customCsv: true
    }

    let tableOptions = {
        "rowKey": (record: any) => record.orderId.toString(),
        "bordered": true,
        "columns": columns,
        "pagination": { pageSize: compState.maxResultCount, total: orders === (undefined || null) ? 0 : orders.totalCount, defaultCurrent: 1 },
        "loading": (orders === undefined ? true : false),
        "dataSource": (orders === (undefined || null) ? [] : orders.items),
        "onChange": handleTableChange,
        "actionsList": [],
        "getGridData": getAllOrderDetail,
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
        "advanceFilterFields": orderAdvanceFilterForm,
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
export default OrderReport;