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
import createOrUpdateOrphanSponsorshipCancellation from './createOrUpdateOrphanSponsorshipCancellation';
import CreateOrUpdateOrphanSponsorshipCancellation from './createOrUpdateOrphanSponsorshipCancellation';
import { oprhanSponsorshipCancellationRequestDto } from '../../services/orphanSponsorShipCanellation/dto/orphanSponsorshipCancellationRequestDto';
import LocalizationKeys from '../../lib/localizationKeys';

export interface INreReporttate {
    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    transferId: number;
    filter: string;
    sorting: string
    data: any;
    dataFields: [];
}

const confirm = Modal.confirm;
const Search = Input.Search;

const OrphanSponsorshipCancellation = (props: any) => {


    const initialState: INreReporttate = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        transferId: 0,
        filter: '',
        sorting: '',
        data: [],
        dataFields: []
    };


    const { orphanSposnorshipCancellationStore, contentStore } = useAppStores();
    const [compState, setCompState] = useCompState(initialState);



    useEffect(() => {
        getAll();
    }, [compState.filter]);

    const getAll = async () => {

        let requestObj: ContentRequestDto = {
            ComponentIdOrName: 'OrphanSponsorshipCancellationViewERP ',
            Parameters: [{
                key: "SkipCount",
                value: compState.skipCount
            },
            {
                key: "MaxResultCount",
                value: compState.maxResultCount
            }]
        }

        let res = await contentStore.GetComponent(requestObj);
        if (res) {
            compState.data = res.data;
            compState.dataFields = res.dataFields
        }
        setCompState({ ...compState });
        getSupporterList();

    }

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

    const createOrUpdateModalOpen = async (item: any, actionName?: any) => {

        let entityDto: EntityDto = { id: item?.orderId || 0 };
        if (entityDto.id === (0 || undefined)) {

        } else if (entityDto.id > 0 && actionName == L(AppConsts.actionNames.EDIT)) {
            //await ordersStore.get(entityDto);
        }

        compState.orderId = entityDto.id || 0;

        displayModal(true, compState.orderId == 0 || actionName == L(AppConsts.actionNames.EDIT) ? "Manage" : "View");

    }

    const handleCreate = async (values: any) => {
        if (compState.orderId === 0) {
            let dtoObj: oprhanSponsorshipCancellationRequestDto = {
                supporterName: values.SupporterName,
                orphanId: values.OrphanId,
                type: 'OrphanSponsorship',
                requesterId: values.supporter
            };
            await orphanSposnorshipCancellationStore.submitCancellationRequest(dtoObj);
        }

        await getAll();
        displayModal(false);
    };


    const handleTableChangeNew = (pagination: any, filters: any, sorter: any) => {
        compState.skipCount = (pagination.current - 1) * compState.maxResultCount!
        compState.sorting = sorter && sorter.field ? sorter.field + " " + (sorter.order == "descend" ? "DESC" : "ASC") : 'o.Id DESC';
        setCompState(compState);
        getAll();
    };

    const getSupporterList = async () => {
        let requestObj: ContentRequestDto = {
            ComponentIdOrName: 'GetAllSupportersIncludingMe'
        }
        const supportersList = await contentStore.GetComponentData(requestObj);

        let dataItemsRep: any = [];
        supportersList && supportersList.items && supportersList.items.map((supporterItem: any) => {
            dataItemsRep.push({ key: supporterItem.userId, value: supporterItem.name });
        });


        if (compState.dataFields && compState.dataFields.length > 0) {
            let field = compState.dataFields.find((f: any) => f.internalName == 'supporter');
            if (field) {
                field.dataItems = dataItemsRep;
                setCompState({ ...compState });
            }

        }
    }


    const columns = [
        { title: L(LocalizationKeys.ERP_LblDate.key), dataIndex: 'text4', sorter: true, key: 'text4', width: 150, render: (text: string) => <div>{utils.formattedDate(text)}</div> },
        { title: L(LocalizationKeys.ERP_LblDonorName.key), dataIndex: 'text1', sorter: true, key: 'text1', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblOrphanId.key), dataIndex: 'text2', sorter: true, key: 'text2', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblType.key), dataIndex: 'text3', sorter: true, key: 'text3', width: 150, render: (text: string) => <div>{text}</div> }, ,
    ]

    let tableOptions = {
        "rowKey": (record: any) => record.text2.toString(),
        "bordered": true,
        "columns": columns,
        "pagination": { pageSize: 10, total: compState.data === (undefined || null) ? 0 : compState.data.totalCount, defaultCurrent: 1 },
        "loading": (compState.data === undefined ? true : false),
        "dataSource": (compState.data === (undefined || null) ? [] : compState.data.items),
        "onChange": handleTableChangeNew,
        "getGridData": getAll,
        "enableSorting": true,

    }


    let headerOptions = {
        "createOrUpdateModalOpen": createOrUpdateModalOpen,
        "enableButton": true
    }


    let searchOptions = {
        "onSearch": () => { },
        "placeholder": L(LocalizationKeys.ERP_LblFilter.key),
        "enableSearch": false
    }

    return (
        <>
            <Card className="order-container card-grid">

                <CustomTable
                    options={tableOptions}
                    searchOptions={searchOptions}
                    // csvOptions={csvOptions}
                    headerOptions={headerOptions}
                />

                <CreateOrUpdateOrphanSponsorshipCancellation
                    visible={compState.modalVisible}
                    onCancel={() => {
                        displayModal(false);
                    }}
                    modalType={compState.orderId === 0 ? 'create' : 'edit'}
                    onCreate={handleCreate}
                    dataFields={compState.dataFields}
                />

            </Card>

        </>
    )
}

export default OrphanSponsorshipCancellation;