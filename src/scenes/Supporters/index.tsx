import React, { useEffect } from 'react';
import { EntityDto } from '../../services/dto/entityDto';
import { isGranted, L } from '../../lib/abpUtility';
import { useAppState, useAppStores, useCompState } from '../../hooks/appStoreHooks';
import { Button, Card, Col, Input, Modal, Row, Tag, message, Table } from 'antd';
import PointToPointTransferSore from '../../stores/pointToPointTransferSore';
import utils from '../../utils/utils';
import CustomCRUDComponent from '../../components/CustomCRUDComponent';
import AppConsts from '../../lib/appconst';
import { CustomButton } from '../../components/CustomControls';
import LocalizationKeys from '../../lib/localizationKeys';
import CustomAdvanceFilter from '../../components/CustomWebControls/CustomAdvanceFilter/customAdvanceFilter';
import ManageProductSettings from './components/manageProductSettings';
import './index.less';

export interface ISupportersState {
    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    transferId: number;
    filter: string;
    sorting: string
    viewModalVisible: boolean;
    parameters: any[];
    userId: Number;
    dataSource: string;
}

const Supporters = (props: any) => {

    const initialState: ISupportersState = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        transferId: 0,
        filter: '',
        sorting: 'Id DESC',
        viewModalVisible: false,
        parameters: [],
        userId: 0,
        dataSource: 'GetAllSupportersList'
    };

    const [compState, setCompState] = useCompState(initialState);


    const createOrUpdateModalOpen = async (item: any, actionName?: any) => {

        let entityDto: EntityDto = { id: item.userId };
        compState.userId = entityDto.id || 0
        displayModal(true, "Manage");
    }

    const displayModal = (isVisible: boolean, modelType?: string) => {
        if (modelType) {
            if (modelType == "Manage") {
                compState.modalVisible = isVisible;
                compState.viewModalVisible = !isVisible;
            }
            else if (modelType == "View") {
                compState.viewModalVisible = isVisible;
                compState.modalVisible = !isVisible;
            }
        }
        else {
            compState.modalVisible = compState.viewModalVisible = isVisible;
        }
        setCompState({ ...compState });
    };

    const isEditEnable = (record: any) => {
        return record.balanceAmounts && record.balanceAmounts != '' && isGranted(AppConsts.permissionNames.Cashout_Add) ? true : false
    }

    const columns = [


        { title: L(LocalizationKeys.ERP_LblSupporterCode.key), dataIndex: 'supporterCode', sorter: true, key: 'supporterCode', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblSupporterType.key), dataIndex: 'supporterType', sorter: true, key: 'supporterType', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblName.key), dataIndex: 'name', sorter: true, key: 'name', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblEmailAddress.key), dataIndex: 'email', sorter: true, key: 'email', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblContactNumber.key), dataIndex: 'contactNumber', sorter: true, key: 'contactNumber', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblCountry.key), dataIndex: 'country', sorter: true, key: 'country', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblSupporterLanguage.key), dataIndex: 'language', sorter: true, key: 'language', width: 150, render: (text: string) => <div>{text}</div> },

        // { title: L(LocalizationKeys.ERP_LblGender.key), dataIndex: 'gender', sorter: true, key: 'gender', width: 150, render: (text: string) => <div>{text}</div> },




    ];


    let actionsItem: any = [
        {
            "actionName": L(AppConsts.actionNames.PARTIAL_TRANSFER),
            "actionCallback": createOrUpdateModalOpen,
            "appearance": CustomButton.appearances.Edit
        }
    ];

    const handleSearch = (value: string) => {
        if (value) {
            let params = compState.parameters;
            params.push(
                {
                    "key": "QueryFilters",
                    "value": value
                });
            compState.parameters = params;
            setCompState({ ...compState });
        }
    };

    return (
        <div className='supporter-container'>
            <Card bordered={false} >

                <CustomCRUDComponent
                    hideHeading={true}
                    overrideActions={true}
                    isNewRecordDisable={true}
                    actionsList={actionsItem}
                    tableName='supporters'
                    tableColumns={columns}
                    enableDownloadCsv={false}
                    enableSearch={true}
                    parameters={compState.parameters}
                    refreshData={JSON.stringify(compState.parameters)}
                    customDataSource={compState.dataSource}
                    
                />

                <ManageProductSettings
                    visible={compState.modalVisible}
                    onCancel={() => {
                        displayModal(false);
                        compState.userId = 0;
                        setCompState({ ...compState });
                    }}
                    userId={compState.userId}

                />

            </Card>
        </div>
    )
}

export default Supporters;