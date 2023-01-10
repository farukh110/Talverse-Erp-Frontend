import { UserAddOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { FormInstance, Tabs } from 'antd';
import React, { useEffect, useRef } from 'react';
import { CustomModal } from '../../../components/CustomControls';
import CustomCRUDComponent from '../../../components/CustomCRUDComponent';
import { CustomTable } from '../../../components/CustomGrid';
import CustomItemSelector from '../../../components/CustomWebControls/CustomItemSelector/customItemSelector';
import { useAppStores, useCompState } from '../../../hooks/appStoreHooks';
import { L } from '../../../lib/abpUtility';
import LocalizationKeys from '../../../lib/localizationKeys';
import { ContentRequestDto } from '../../../services/Content/dto/contentRequestDto';
import { GrantTransferPointPermission } from '../../../services/permission/dto/permissionDto';

import '../index.less';

const ViewTransferPointsBalance = (props: any) => {


    const { visible, onCreate, onCancel, transferPointId, transferPointName } = props;

    const initialState: any = {
        tableName: '',
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        orderId: 0,
        filter: '',
        sorting: 'OrderId DESC',
        showInvoiceModal: false,
    };

    const { ordersStore, userStore, programCategoryStore, contentStore } = useAppStores();
    const [compState, setCompState] = useCompState(initialState);
    const [orders, setOrders] = useCompState({});


    useEffect(() => {
        getTransferPointBalanceAmount();
    }, [transferPointId]);


    const getTransferPointBalanceAmount = async () => {
        let params = [
            {
                key: "TransferPointId",
                value: transferPointId
            }
        ];
        let requestObj: ContentRequestDto = {
            ComponentIdOrName: 'GetTransferPointBalanceAmounts',
            Parameters: params
        }
        let res = await contentStore.GetComponentData(requestObj);

        let obj = {
            items: res && res.balanceAmount || [],
            totalCount: res && res.balanceAmount && res.balanceAmount.length,
            currencyList: res && res.currencyList || []
        }
        setOrders({ ...obj });


    }


    const onClose = () => {
        if (onCancel && typeof (onCancel) === 'function')
            onCancel();
    }

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {

        compState.maxResultCount = pagination.pageSize;
        compState.skipCount = (pagination.current - 1) * compState.maxResultCount!
        compState.sorting = sorter && sorter.field ? sorter.field + " " + (sorter.order == "descend" ? "DESC" : "ASC") : 'OrderId DESC';

        setCompState(compState);
        getTransferPointBalanceAmount();
    };

    let modalOptions = {

        "visible": visible,
        "width": '55%',
        "title": ` ${L(LocalizationKeys.ERP_LblBalanceAmounts.key)} : ${transferPointName}  `,
        "destroyOnClose": true,
        "onCancel": onClose,
        "footer": null,
        //"onOk": onSubmit,
        "okText": L(LocalizationKeys.ERP_LblSave.key),
        theme: "danger"

    }


    const columns = [
        { title: L(LocalizationKeys.ERP_LblCurrencyCode.key), dataIndex: 'currencyCode', sorter: true, key: 'currencyCode', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblCurrency.key), dataIndex: 'currencyCode', sorter: true, key: 'currencyCode', width: 150, render: (text: string, recod: any) => <div>{getCurrencyName(recod)}</div> },
        { title: L(LocalizationKeys.ERP_LblAmount.key), dataIndex: 'amount', sorter: true, key: 'amount', width: 150, render: (text: string) => <div>{text}</div> },

    ];

    const getCurrencyName = (record: any) => {
        if (record)
            return orders.currencyList.find((cur: any) => cur.coreId == record.currencyId)?.name;
    }

    let tableOptions = {
        "rowKey": (record: any) => record.currencyId.toString(),
        "bordered": true,
        "columns": columns,
        "pagination": false,
        "loading": (orders === undefined ? true : false),
        "dataSource": (orders === (undefined || null) ? [] : orders.items),
        "onChange": handleTableChange,
        "actionsList": [],
        "getGridData": getTransferPointBalanceAmount,
        "enableSorting": true,
    }

    let headerOptions = {
        "createOrUpdateModalOpen": () => { },
        "enableButton": false
    }

    let searchOptions = {
        "onSearch": () => { },
        "placeholder": L(LocalizationKeys.ERP_LblFilter.key),
        "enableSearch": false,
        "advanceFilterFields": null,
        "enableAdvanceSearch": true
    }


    return (<CustomModal className='transfer-point-modal' {...modalOptions}>

        <CustomTable
            options={tableOptions}
            searchOptions={searchOptions}
            headerOptions={headerOptions}
        />

    </CustomModal>
    )
}

export default ViewTransferPointsBalance;
