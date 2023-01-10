import React, { useEffect, useRef } from 'react';
import { Button, Card, Col, Input, Modal, Row, Tag, message, Tabs, Form, Space } from 'antd';

import { EntityDto } from '../../services/dto/entityDto';
import { isGranted, L } from '../../lib/abpUtility';
import { useAppState, useAppStores, useCompState } from '../../hooks/appStoreHooks';
import { FormInstance } from 'antd/lib/form';
import { CustomTable } from '../../components/CustomGrid';
import { CustomButton, CustomCol, CustomRow, CustomTabPane } from '../../components/CustomControls';

import { ContentRequestDto } from '../../services/Content/dto/contentRequestDto';
import utils from '../../utils/utils';

import AppConsts from '../../lib/appconst';
import CustomDatepickerInput from '../../components/CustomWebControls/CustomDatePicker/customDatepickerInput';
import TransferStore from '../../stores/transferStore';
import DownloadCSV from '../../components/CustomGrid/components/downloadCSV';
import moment from 'moment';
import { UserAddOutlined, UserDeleteOutlined, UserSwitchOutlined } from '@ant-design/icons';
import './index.less'
import LocalizationKeys from '../../lib/localizationKeys';
import CustomRangePickerInput from '../../components/CustomWebControls/CustomRangePicker/CustomRangePickerInput';

export interface INreReporttate {
    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    transferId: number;
    filter: string;
    sorting: string
    data: any
}

const confirm = Modal.confirm;
const Search = Input.Search;

const NREReport = (props: any) => {

    const [formRef] = Form.useForm();

    const initialStateNew: INreReporttate = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        transferId: 0,
        filter: '',
        sorting: 'OrderId DESC',
        data: {}
    };

    const initialStateRemewal: INreReporttate = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        transferId: 0,
        filter: '',
        sorting: 'OrderId DESC',
        data: {}
    };

    const initialStateEnd: INreReporttate = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        transferId: 0,
        filter: '',
        sorting: 'Id DESC',
        data: {}
    };

    const { contentStore } = useAppStores();
    const [compStateNew, setCompStateNew] = useCompState(initialStateNew);

    const [compStateRenewal, setCompStateRenewal] = useCompState(initialStateRemewal);
    const [compStateEnd, setCompStateEnd] = useCompState(initialStateEnd);

    useEffect(() => {
        getAllNew();
    }, [compStateNew.filter]);

    useEffect(() => {
        getAllRenewal();
    }, [compStateRenewal.filter]);

    useEffect(() => {
        getAllEnd();
    }, [compStateEnd.filter]);


    const getAllNew = async () => {

        let StartAndEndDate = formRef.getFieldValue('dateMonthRange');
        let requestObj: ContentRequestDto = {
            ComponentIdOrName: 'NREGetAllNew ',
            Parameters: [{
                key: "SkipCount",
                value: compStateNew.skipCount
            },
            {
                key: "Sorting",
                value: compStateNew.sorting
            },
            {
                key: "MaxResultCount",
                value: compStateNew.maxResultCount
            },
            {
                key: 'StartOfMonth',
                value: utils.getStartOfDate(StartAndEndDate[0], AppConsts.DateUnits.DAY, 'YYYY-MM-DD HH:mm:ss')
            },
            {
                key: 'EndOfMonth',
                value: utils.getEndOfDate(StartAndEndDate[1], AppConsts.DateUnits.DAY, 'YYYY-MM-DD HH:mm:ss')
            }
            ]
        }

        let res = await contentStore.GetComponentData(requestObj);
        if (res) {
            compStateNew.data = res;
        }
        setCompStateNew({ ...compStateNew });
    }

    const getAllRenewal = async () => {

        let StartAndEndDate = formRef.getFieldValue('dateMonthRange');
        let requestObj: ContentRequestDto = {
            ComponentIdOrName: 'NREGetAllRenewal ',
            Parameters: [{
                key: "SkipCount",
                value: compStateRenewal.skipCount
            },
            {
                key: "Sorting",
                value: compStateRenewal.sorting
            },
            {
                key: "MaxResultCount",
                value: compStateRenewal.maxResultCount
            },
            {
                key: 'StartOfMonth',
                value: utils.getStartOfDate(StartAndEndDate[0], AppConsts.DateUnits.DAY, 'YYYY-MM-DD HH:mm:ss')
            },
            {
                key: 'EndOfMonth',
                value: utils.getEndOfDate(StartAndEndDate[1], AppConsts.DateUnits.DAY, 'YYYY-MM-DD HH:mm:ss')
            }

            ]
        }
        let res = await contentStore.GetComponentData(requestObj);

        if (res) {
            compStateRenewal.data = res;
            setCompStateRenewal({ ...compStateRenewal });
        }


    }

    const getAllEnd = async () => {
        let StartAndEndDate = formRef.getFieldValue('dateMonthRange');
        let requestObj: ContentRequestDto = {
            ComponentIdOrName: 'NREGetAllEnded ',
            Parameters: [{
                key: "SkipCount",
                value: compStateEnd.skipCount
            },
            {
                key: "Sorting",
                value: compStateEnd.sorting
            },
            {
                key: "MaxResultCount",
                value: compStateEnd.maxResultCount
            },
            {
                key: 'StartOfMonth',
                value: utils.getStartOfDate(StartAndEndDate[0], AppConsts.DateUnits.DAY, 'YYYY-MM-DD HH:mm:ss')
            },
            {
                key: 'EndOfMonth',
                value: utils.getEndOfDate(StartAndEndDate[1], AppConsts.DateUnits.DAY, 'YYYY-MM-DD HH:mm:ss')
            }

            ]
        }
        let res = await contentStore.GetComponentData(requestObj);
        if (res) {
            compStateEnd.data = res;
            setCompStateEnd({ ...compStateEnd });
        }
    }

    const handleTableChangeNew = (pagination: any, filters: any, sorter: any) => {
        compStateNew.maxResultCount = pagination.pageSize;
        compStateNew.skipCount = (pagination.current - 1) * compStateNew.maxResultCount!
        compStateNew.sorting = sorter && sorter.field ? sorter.field + " " + (sorter.order == "descend" ? "DESC" : "ASC") : 'OrderId  DESC';
        setCompStateNew(compStateNew);
        getAllNew();
    };

    const handleTableChangeRenew = (pagination: any, filters: any, sorter: any) => {
        compStateRenewal.maxResultCount = pagination.pageSize;
        compStateRenewal.skipCount = (pagination.current - 1) * compStateRenewal.maxResultCount!
        compStateRenewal.sorting = sorter && sorter.field ? sorter.field + " " + (sorter.order == "descend" ? "DESC" : "ASC") : 'OrderId  DESC';
        setCompStateRenewal(compStateRenewal);
        getAllRenewal();
    };

    const handleTableChangeEnd = (pagination: any, filters: any, sorter: any) => {
        compStateEnd.maxResultCount = pagination.pageSize;
        compStateEnd.skipCount = (pagination.current - 1) * compStateEnd.maxResultCount!
        compStateEnd.sorting = sorter && sorter.field ? sorter.field + " " + (sorter.order == "descend" ? "DESC" : "ASC") : 'Id DESC';
        setCompStateEnd(compStateEnd);
        getAllEnd();
    };

    const RangePickerProps = {
        name: 'dateMonthRange',
        label: L(LocalizationKeys.ERP_LblSelectMonth_Year.key),
        valueStart: utils.getStartOfDate(new Date(), AppConsts.DateUnits.MONTH),
        valueEnd: utils.getEndOfDate(new Date(), AppConsts.DateUnits.MONTH),
        rules: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldThisFieldIsRequired.key) }]
    };


    const reloadReport = () => {
        formRef!.validateFields().then(async (values: any) => {
            getAllNew();
            getAllRenewal();
            getAllEnd();
        });
    }

    const downloadCSV = async () => {
        let StartAndEndDate = formRef.getFieldValue('dateMonthRange');
        let requestObj: ContentRequestDto = {
            ComponentIdOrName: 'NREExportAll ',
            Parameters: [
                {
                    key: 'StartOfMonth',
                    value: utils.getStartOfDate(StartAndEndDate[0], AppConsts.DateUnits.DAY, 'YYYY-MM-DD HH:mm:ss') //StartAndEndDate[0]
                },
                {
                    key: 'EndOfMonth',
                    value: utils.getEndOfDate(StartAndEndDate[1], AppConsts.DateUnits.DAY, 'YYYY-MM-DD HH:mm:ss')// StartAndEndDate[1]
                }
            ]
        }

        let resp = await contentStore.GetComponentData(requestObj);


        return resp?.items;
    }
    const getDateRangeComp = () => {
        return formRef.getFieldValue('dateMonthRange');
    }

    let csvOptions = {
        "getCSVData": downloadCSV, // rename / chnage function 
        "headers": [
            { label: L(LocalizationKeys.ERP_LblDate.key), key: "date" },
            { label: L(LocalizationKeys.ERP_LblAction.key), key: "action" },
            { label: L(LocalizationKeys.ERP_LblDonorName.key), key: "donorName" },
            { label: L(LocalizationKeys.ERP_LblDonorNameArabic.key), key: "donorNameArabic" },
            { label: L(LocalizationKeys.ERP_LblDonorPhoneNumber.key), key: "donorPhoneNumber" },
            { label: L(LocalizationKeys.ERP_LblDonorEmailAddress.key), key: "donorEmail" },
            { label: L(LocalizationKeys.ERP_LblDonorCountry.key), key: "donorCountry" },
            { label: L(LocalizationKeys.ERP_LblOrphanId.key), key: "orphanId" },
            { label: L(LocalizationKeys.ERP_LblOrphanName.key), key: "orphanName" },
            { label: L(LocalizationKeys.ERP_LblCurrency.key), key: "currency" },
            { label: L(LocalizationKeys.ERP_LblNoOfOrphans.key), key: "quantity" },
            { label: L(LocalizationKeys.ERP_LblAmount.key), key: "amount" },
            { label: L(LocalizationKeys.ERP_LblRepName.key), key: "repName" },
            { label: L(LocalizationKeys.ERP_LblRepLanguage.key), key: "messageLanguage" },
            { label: L(LocalizationKeys.ERP_LblComments.key), key: "comments" },


        ],
        "fileName": `allOrphanList_From_${utils.formattedDate(getDateRangeComp() ? getDateRangeComp()[0] : null, 'DD-MMM-yyyy')}_to_${utils.formattedDate(getDateRangeComp() ? getDateRangeComp()[1] : null, 'DD-MMM-yyyy')
}.csv`,
        "enableExport": true
    }



    const columnsNew = [
        { title: L(LocalizationKeys.ERP_LblDate.key), dataIndex: 'date', sorter: true, key: 'date', width: 150, render: (text: string) => <div>{utils.formattedDate(text, "DD-MMM-YY")}</div> },
        { title: L(LocalizationKeys.ERP_LblAction.key), dataIndex: 'action', sorter: true, key: 'action', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblDonorName.key), dataIndex: 'donorName', sorter: true, key: 'donorName', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblCurrency.key), dataIndex: 'currency', sorter: true, key: 'currency', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblNoOfOrphans.key), dataIndex: 'quantity', sorter: true, key: 'quantity', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblAmount.key), dataIndex: 'amount', sorter: true, key: 'amount', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblRepName.key), dataIndex: 'repName', sorter: true, key: 'repName', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblComments.key), dataIndex: 'comments', sorter: true, key: 'comments', width: 150, render: (text: string) => <div>{text}</div> },
    ];

    const columnsRenewal = [
        { title: L(LocalizationKeys.ERP_LblDate.key), dataIndex: 'date', sorter: true, key: 'date', width: 150, render: (text: string) => <div>{utils.formattedDate(text, "DD-MMM-YY")}</div> },
        { title: L(LocalizationKeys.ERP_LblAction.key), dataIndex: 'action', sorter: true, key: 'action', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblDonorName.key), dataIndex: 'donorName', sorter: true, key: 'donorName', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblOrphanIds.key), dataIndex: 'orphanId', sorter: true, key: 'orphanId', width: 150, render: (text: string) => <div dangerouslySetInnerHTML={{ __html: utils.splitToNewLineBySeperator(text, ',') }}></div> },
        { title: L(LocalizationKeys.ERP_LblCurrency.key), dataIndex: 'currency', sorter: true, key: 'currency', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblNoOfOrphans.key), dataIndex: 'quantity', sorter: true, key: 'quantity', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblAmount.key), dataIndex: 'amount', sorter: true, key: 'amount', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblRepName.key), dataIndex: 'repName', sorter: true, key: 'repName', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblComments.key), dataIndex: 'comments', sorter: true, key: 'comments', width: 150, render: (text: string) => <div>{text}</div> },
    ];

    const columnsEnded = [
        { title: L(LocalizationKeys.ERP_LblDate.key), dataIndex: 'creationTime', sorter: true, key: 'creationTime', width: 150, render: (text: string) => <div>{utils.formattedDate(text, "DD-MMM-YY")}</div> },
        { title: L(LocalizationKeys.ERP_LblAction.key), dataIndex: 'type', sorter: true, key: 'type', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblDonorName.key), dataIndex: 'supporterName', sorter: true, key: 'supporterName', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblOrphanId.key), dataIndex: 'orphanId', sorter: true, key: 'orphanId', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblRepName.key), dataIndex: 'username', sorter: true, key: 'username', width: 150, render: (text: string) => <div>{text}</div> },
    ];


    let tableOptionsNew = {
        "rowKey": (record: any) => record.orderId.toString(),
        "bordered": true,
        "columns": columnsNew,
        "pagination": { pageSize: 10, total: compStateNew.data === (undefined || null) ? 0 : compStateNew.data.totalCount, defaultCurrent: 1 },
        "loading": (compStateNew.data === undefined ? true : false),
        "dataSource": (compStateNew.data === (undefined || null) ? [] : compStateNew.data.items),
        "onChange": handleTableChangeNew,
        "getGridData": getAllNew,
        "enableSorting": true,

    }
    let tableOptionsRe = {
        "rowKey": (record: any) => record.orderId.toString(),
        "bordered": true,
        "columns": columnsRenewal,
        "pagination": { pageSize: 10, total: compStateRenewal.data === (undefined || null) ? 0 : compStateRenewal.data.totalCount, defaultCurrent: 1 },
        "loading": (compStateRenewal.data === undefined ? true : false),
        "dataSource": (compStateRenewal.data === (undefined || null) ? [] : compStateRenewal.data.items),
        "onChange": handleTableChangeRenew,
        "getGridData": getAllRenewal,
        "enableSorting": true,

    }

    let tableOptionsEnd = {
        "rowKey": (record: any) => record.id.toString(),
        "bordered": true,
        "columns": columnsEnded,
        "pagination": { pageSize: 10, total: compStateEnd.data === (undefined || null) ? 0 : compStateEnd.data.totalCount, defaultCurrent: 1 },
        "loading": (compStateEnd.data === undefined ? true : false),
        "dataSource": (compStateEnd.data === (undefined || null) ? [] : compStateEnd.data.items),
        "onChange": handleTableChangeEnd,
        "getGridData": getAllEnd,
        "enableSorting": true,

    }

    let headerOptionsNew = {
        "createOrUpdateModalOpen": () => { },
        "headerTitle": L(LocalizationKeys.ERP_HdrOrphanNew.key),
        "enableButton": false
    }

    let headerOptionsRenew = {
        "createOrUpdateModalOpen": () => { },
        "headerTitle": L(LocalizationKeys.ERP_HdrOrphanRenewed.key),
        "enableButton": false
    }

    let headerOptionsEnd = {
        "createOrUpdateModalOpen": () => { },
        "headerTitle": L(LocalizationKeys.ERP_HdrOprhanEnded.key),
        "enableButton": false
    }

    let searchOptions = {
        "onSearch": () => { },
        "placeholder": L(LocalizationKeys.ERP_LblFilter.key),
        "enableSearch": false
    }



    return (
        <>
            <Card className="order-container report-container card-grid">

                <CustomRow>

                    <CustomCol md={{ span: 24, offset: 0 }}>

                        <Form form={formRef}>

                            <CustomRow>

                                <CustomCol
                                    xxl={{ span: 12 }}
                                    xl={{ span: 12 }}
                                    lg={{ span: 12 }}
                                    md={{ span: 12 }}
                                    sm={{ span: 12 }}>

                                    <CustomRow gutter={[24, 16]}>

                                        <CustomCol
                                            xxl={{ span: 12 }}
                                            xl={{ span: 16 }}
                                            lg={{ span: 14 }}
                                            md={{ span: 14 }}
                                            sm={{ span: 12 }}
                                        >

                                            {/* <CustomDatepickerInput {...datePickerProps} /> */}

                                            <CustomRangePickerInput {...RangePickerProps} />
                                        </CustomCol>

                                        <CustomCol
                                            xxl={{ span: 12 }}
                                            xl={{ span: 8 }}
                                            lg={{ span: 10 }}
                                            md={{ span: 10 }}
                                            sm={{ span: 12 }}>


                                            <CustomButton appearance={CustomButton.appearances.Generate} onClick={reloadReport}  >{L(LocalizationKeys.ERP_BtnGenerate.key)}</CustomButton>

                                        </CustomCol>

                                    </CustomRow>
                                </CustomCol>

                                <CustomCol
                                    xxl={{ span: 12 }}
                                    xl={{ span: 12 }}
                                    lg={{ span: 12 }}
                                    md={{ span: 12 }}
                                    sm={{ span: 12 }}>

                                    <CustomRow>

                                        <CustomCol
                                            xxl={{ span: 16 }}
                                            xl={{ span: 13 }}
                                            lg={{ span: 13 }}
                                            md={{ span: 13 }}
                                            sm={{ span: 13 }}>

                                        </CustomCol>

                                        <CustomCol
                                            xxl={{ span: 4 }}
                                            xl={{ span: 7 }}
                                            lg={{ span: 7 }}
                                            md={{ span: 7 }}
                                            sm={{ span: 7 }}>

                                        </CustomCol>

                                        <CustomCol
                                            xxl={{ span: 4 }}
                                            xl={{ span: 4 }}
                                            lg={{ span: 4 }}
                                            md={{ span: 4 }}
                                            sm={{ span: 4 }}>

                                            {(compStateNew.data.totalCount > 0 || compStateRenewal.data.totalCount > 0 || compStateEnd.data.totalCount > 0) && <DownloadCSV csvOptions={csvOptions}  ></DownloadCSV>}

                                        </CustomCol>

                                    </CustomRow>


                                </CustomCol>

                            </CustomRow>

                        </Form>


                        <Tabs defaultActiveKey={'0'} className='report-tabs'>
                            <Tabs.TabPane
                                tab={<span><i><UserAddOutlined /></i>{L(LocalizationKeys.ERP_LblNew.key)} ({compStateNew.data.totalCount ? compStateNew.data.totalCount : 0})</span>}
                                key={0}
                                forceRender={true}
                            >
                                <CustomTable
                                    options={tableOptionsNew}
                                    searchOptions={searchOptions}
                                    // csvOptions={csvOptions}
                                    headerOptions={headerOptionsNew}
                                />

                            </Tabs.TabPane>

                            <Tabs.TabPane
                                tab={<span><i><UserSwitchOutlined /></i>{L(LocalizationKeys.ERP_LblRenewal.key)} ({compStateRenewal.data.totalCount ? compStateRenewal.data.totalCount : 0}) </span>}
                                key={1}
                                forceRender={true}
                            >
                                <CustomTable
                                    options={tableOptionsRe}
                                    searchOptions={searchOptions}
                                    // csvOptions={csvOptions}
                                    headerOptions={headerOptionsRenew}
                                />
                            </Tabs.TabPane>


                            <Tabs.TabPane
                                tab={<span><i><UserDeleteOutlined /></i>{L(LocalizationKeys.ERP_LblEnded.key)} ({compStateEnd.data.totalCount ? compStateEnd.data.totalCount : 0}) </span>}
                                key={2}
                                forceRender={true}
                            >
                                <CustomTable
                                    options={tableOptionsEnd}
                                    searchOptions={searchOptions}
                                    // csvOptions={csvOptions}
                                    headerOptions={headerOptionsEnd}
                                />
                            </Tabs.TabPane>

                        </Tabs>

                    </CustomCol>

                </CustomRow>

            </Card>

        </>
    )
}

export default NREReport;