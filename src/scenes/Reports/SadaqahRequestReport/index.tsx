import { Card, FormInstance, Input, Modal, Tooltip } from 'antd';
import React, { ComponentState, useEffect, useRef } from 'react';
import { CustomButton } from '../../../components/CustomControls';
import { CustomTable } from '../../../components/CustomGrid';
import { useAppState, useAppStores, useCompState } from '../../../hooks/appStoreHooks';
import { isGranted, L } from '../../../lib/abpUtility';
import AppConsts from '../../../lib/appconst';
import LocalizationKeys from '../../../lib/localizationKeys';
import utils from '../../../utils/utils';
import sadaqahAdvanceFilterForm from './json/sadaqahAdvanceFilterForm.json';
import CreateOrUpdateSadaqah from './components/createOrUpdateSadaqah';
import { OrderMarkAsDoneDto, OrderRemarksDto } from '../../../services/reports/dto/reportsDto';
import { EntityDto } from '../../../services/dto/entityDto';
import ReportsStore from '../../../stores/reportsStore';
import updateRemarksForm from './json/updateRemarksForm.json';
import formUtils from '../../../utils/formUtils';
import './index.less';

export interface ISadaqahRequestReportState {

    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    orderNumber: number;
    sadaqahRequest: any;
    filter: string;
    sorting: string;
}

const confirm = Modal.confirm;
const Search = Input.Search;

const SadaqahRequestReport = (props: any) => {

    const formRef = useRef<FormInstance>(null);

    const initialState: ISadaqahRequestReportState = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        orderNumber: 0,
        sadaqahRequest: 0,
        filter: "",
        sorting: "OrderNumber DESC",
    };

    const { reportsStore } = useAppStores();
    const [compState, setCompState] = useCompState(initialState);
    const [sadaqahRequest, setSadaqahRequest] = useCompState({});
    const [loadingStatus, setLoadingStatus] = useCompState(false);
    const [editSadaqah, setEditSadaqah] = useAppState(ReportsStore.AppStateKeys.REMARKS_ORDER, {});

    let performedById = "performedById";
    
    console.log(" editSadaqah editSadaqah ", editSadaqah);

    useEffect(() => {
        getSadaqahRequestReport();
    }, [compState.filter]);

    console.log("sadaqahRequest hai kya ", sadaqahRequest.items);
    console.log("compState .... ", compState);

    const displayModal = (isVisible: boolean, modelType?: string) => {
        if (modelType) {
            if (modelType == "Manage") {
                compState.modalVisible = isVisible;
            }
            else if (modelType == "View") {
                compState.viewModalVisible = isVisible;
            }
        }
        else {
            compState.modalVisible = compState.viewModalVisible = isVisible;
        }
        setCompState({ ...compState });
    };

    const getSadaqahRequestReport = async () => {

        let filter = compState.filter?.filters ? compState?.filter : '';

        console.log(" filter sadaqah : ",filter);
        console.log(" compState.filter?.filters : ",compState.filter?.filters);
        console.log(" compState?.filter : ",compState?.filter);

        let res = await reportsStore.GetSadaqahRequestReport(filter, {
            maxResultCount: compState.maxResultCount,
            skipCount: compState.skipCount,
            keyword: compState.filter,
            sorting: compState.sorting
        });

        setSadaqahRequest(res);
        console.log(" res res res res ", res);

    }

    const getAllCSVData = async () => {

        let filter = compState.filter.filters ? compState.filter : '';
        let res = await reportsStore.GetSadaqahRequestReport(filter, {
            maxResultCount: 5000,
            skipCount: 0,
            keyword: '',
            sorting: ''
        });

        // let res = await reportsStore.GetKhumsReport();
        return res ? res.items : [];
    }

    const handleSearch = (value: string) => {
        compState.skipCount = 0;
        compState.filter = value;
        setCompState({ ...compState });
    };


    const handleTableChange = (pagination: any, filters: any, sorter: any) => {

        compState.maxResultCount = pagination.pageSize;
        compState.skipCount = (pagination.current - 1) * compState.maxResultCount!
        compState.sorting = sorter && sorter.field ? sorter.field + " " + (sorter.order == "descend" ? "DESC" : "ASC") : 'OrderNumber DESC';
        setCompState(compState);
        getSadaqahRequestReport();
    };

    const onOrderMarkAsAction = (record: any) => {

        console.log(` record.performedById : ${record.performedById} and record.performedDate : ${record.performedDate} `);

        try {
            console.log(" onOrderMarkAsAction clicked");
            console.log(" comp state onOrderMarkAsAction ", compState);
            setLoadingStatus(true);
            confirm({
                title: `${L(LocalizationKeys.ERP_MsgConfirmCompletedOrder.key)} ${record.orderNumber} of Customer ${record.supporterName}`,
                async onOk() {

                    let requestObj: OrderMarkAsDoneDto = {

                        isMarkAsDone: true,
                        isRemarks: false,
                        remarks: ''
                    }

                    let result: any = await reportsStore.updateMarkAsDone(record.id, requestObj);

                    // console.log(" requestObj _ _ _ ", requestObj);

                    // console.log(" result _ _ _ ", result);

                    // markAsDoneButton();
                    if (result) {
                        // console.log(" result && result.id result && result.id __ __ _", result);
                        utils.getAlertMessage(AppConsts.alertMessageTypes.success, "Saved Record");
                    }
                    else {
                        utils.getAlertMessage(AppConsts.alertMessageTypes.error, "Something Went wrong");
                    }
                    setLoadingStatus(false);
                    await getSadaqahRequestReport();
                },
                onCancel() {
                    // console.log('Cancel');
                    setLoadingStatus(false);
                },

            });

        } catch (error) {
            console.log(`error: ${error}`);
            setLoadingStatus(false);
        }
    }

    const onOrderRemarksAction = async (item: any, actionName?: any) => {

        try {

            console.log(" actionName actionName ", actionName);
            let res = compState.orderNumber = item?.orderNumber;
            let entityDto: EntityDto = { id: item?.id || 0 };

            console.log(" item in remarks  ", item);
            console.log(" item.remarks ", item.remarks);

            let remarksMessage: any;

            remarksMessage = updateRemarksForm.formFields.find(item => item);

            remarksMessage.defaultValue = item.remarks;

            let requestObj: OrderRemarksDto = {

                isMarkAsDone: false,
                isRemarks: true,
                remarks: remarksMessage.defaultValue
            }

            console.log(" remarks Message ", remarksMessage.defaultValue);

            if (entityDto.id === (0 || undefined)) {

                await reportsStore.updateRemarks(entityDto.id, requestObj);

                console.log("remarksMessage .... __________ ", remarksMessage.defaultValue = requestObj.remarks);
                console.log("requestObj .... __________ ", requestObj);


            } else if (entityDto.id > 0 && actionName == L(AppConsts.actionNames.REMARKS_ORDER)) {

                await reportsStore.updateRemarks(entityDto.id, requestObj);
            }

            compState.id = entityDto.id || 0;
            if (compState.id == 0) {

                //reset app store for order

                setEditSadaqah({});
            }

            displayModal(true, compState.id == 0 || actionName == L(AppConsts.actionNames.REMARKS_ORDER) ? "Manage" : "View");

        } catch (error) {

            console.log("error", error);
        }
    }

    const columns = [
        { title: L(LocalizationKeys.ERP_LblOrderNumber.key), dataIndex: 'orderNumber', sorter: true, key: 'orderNumber', width: 150, render: (text: string, row: any) => <div> {text} </div> },
        { title: L(LocalizationKeys.ERP_LblCountry.key), dataIndex: 'countryName', sorter: true, key: 'countryName', width: 120, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblCity.key), dataIndex: 'cityName', sorter: true, key: 'cityName', width: 120, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblWhenToPerform.key), dataIndex: 'whenToPerform', sorter: true, key: 'whenToPerform', width: 120, render: (text: string) => <div>{utils.formattedDate(text)}</div> },
        { title: L(LocalizationKeys.ERP_LblQuantity.key), dataIndex: 'quantity', sorter: true, key: 'quantity', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblCurrency.key), dataIndex: 'currencyName', sorter: true, key: 'currencyName', width: 120, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblAmount.key), dataIndex: 'amount', sorter: true, key: 'amount', width: 130, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblStatus.key), dataIndex: 'statusName', sorter: true, key: 'statusName', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblRemarks.key), dataIndex: 'remarks', sorter: true, key: 'remarks', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblMarkedDoneBy.key), dataIndex: 'supporterName', sorter: true, key: 'supporterName', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblMarkedDoneOn.key), dataIndex: 'performedDate', sorter: true, key: 'performedDate', width: 150, render: (text: string) => <div> {utils.formattedDate(text)} </div> },
    ];

    let csvOptions = {
        "getCSVData": getAllCSVData,
        "headers": [

            { label: L(LocalizationKeys.ERP_LblOrderNumber.key), key: "orderNumber" },
            { label: L(LocalizationKeys.ERP_LblCountry.key), key: "countryName" },
            { label: L(LocalizationKeys.ERP_LblCity.key), key: "cityName" },
            { label: L(LocalizationKeys.ERP_LblWhenToPerform.key), key: "whenToPerform" },
            { label: L(LocalizationKeys.ERP_LblQuantity.key), key: "quantity" },
            { label: L(LocalizationKeys.ERP_LblCurrency.key), key: "currencyName" },
            { label: L(LocalizationKeys.ERP_LblAmount.key), key: "amount" },
            { label: L(LocalizationKeys.ERP_LblStatus.key), key: "statusName" },
            { label: L(LocalizationKeys.ERP_LblRemarks.key), key: "remarks" },
            { label: L(LocalizationKeys.ERP_LblMarkedDoneBy.key), key: "supporterName" },
            { label: L(LocalizationKeys.ERP_LblMarkedDoneOn.key), key: "performedDate" },

        ],
        "fileName": "SadaqahRequestReport.csv",
        "enableExport": true
    }

    let tableOptions = {
        "rowKey": (record: any) => record.orderNumber.toString(),
        "bordered": true,
        "columns": columns,
        "pagination": { pageSize: compState.maxResultCount, total: sadaqahRequest === (undefined || null) ? 0 : sadaqahRequest.totalCount, defaultCurrent: 1 },
        "loading": (sadaqahRequest === undefined ? true : false),
        "dataSource": (sadaqahRequest === (undefined || null) ? [] : sadaqahRequest.items),
        "actionsList": [{
            "actionName": L(AppConsts.actionNames.MARK_AS_DONE),
            "actionCallback": onOrderMarkAsAction,
            "appearance": CustomButton.appearances.Check,
            "isVisible": (record: any) => {
                return (isGranted(AppConsts.permissionNames.Mark_as_Done))
            }
        },
        {
            "actionName": L(AppConsts.actionNames.REMARKS_ORDER),
            "actionCallback": onOrderRemarksAction,
            "appearance": CustomButton.appearances.RemarksOrder,
            "isVisible": (record: any) => {
                return (isGranted(AppConsts.permissionNames.Order_Remarks))
            }
        }
        ],
        "getGridData": getSadaqahRequestReport,
        "onChange": handleTableChange,
        "enableSorting": false,
    }


    let headerOptions = {
        "createOrUpdateModalOpen": () => { },
        "enableButton": false
    }

    const handleCreate = async (values: any) => {

        console.log(" handleCreate values ... ", values);
        // await getSadaqahRequestReport();
        // displayModal(false);

        if (compState.sadaqahRequest === 0) {

            let dtoObj: OrderRemarksDto = {
                isMarkAsDone: false,
                isRemarks: true,
                remarks: values.remarks
            };
            await reportsStore.updateRemarks(compState.id, dtoObj);
        }

        await getSadaqahRequestReport();
        displayModal(false);

    };



    let searchOptions = {
        "onSearch": handleSearch,
        "placeholder": L(LocalizationKeys.ERP_LblFilter.key),
        "enableSearch": false,
        "advanceFilterFields": sadaqahAdvanceFilterForm,
        "enableAdvanceSearch": true
    }

    const getButtonCss = (row: any):any => {
        
        if(row[performedById] != null) {
            return row[performedById] ? 'high-lighted-row' : 'data-row';
        }
    }

    const markAsDoneButton = () => {

        console.log('markAsDoneButton on click');
    }
    
    return (
        <>
            <Card>
                <CustomTable
                    options={tableOptions}
                    searchOptions={searchOptions}
                    csvOptions={csvOptions}
                    headerOptions={headerOptions}
                    getTableRowCSS={getButtonCss}
                />

                <CreateOrUpdateSadaqah
                    visible={compState.modalVisible}
                    onCancel={() => {
                        displayModal(false);
                    }}
                    modalType={compState.orderId === 0 ? 'edit' : 'create'}
                    onCreate={handleCreate}
                    orderNumber={compState.orderNumber}
                />

            </Card>
        </>
    )
}

export default SadaqahRequestReport;