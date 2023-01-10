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
import CreateOrUpdateCashOut from './createOrUpdateCashOut';
import ViewCashOutHistory from './viewCashOutHistory';
import LocalizationKeys from '../../lib/localizationKeys';
import CustomAdvanceFilter from '../../components/CustomWebControls/CustomAdvanceFilter/customAdvanceFilter';
import cashoutAdvanceFilterForm from './json/cashoutAdvanceFilterForm.json';
import './index.less';

export interface ICashOutState {
    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    transferId: number;
    filter: string;
    sorting: string
    viewModalVisible: boolean;
    refreshString: string;
}

const CashOut = (props: any) => {


    const initialState: ICashOutState = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        transferId: 0,
        filter: '',
        sorting: 'Id DESC',
        viewModalVisible: false,
        refreshString: ''
    };

    let params = [
        {
            key: "SelectFields",
            value: "Id, Code,BalanceAmounts,FK_transferPoints.TransferPointTypeId_TransferPointTypeTranslation_CoreId_Name_transferPointTypeId,FK_transferPoints.ID_TransferPointTranslation_CoreId_Name_TransferPointName"
        }
    ];

    const [compState, setCompState] = useCompState({ parameters: params });


    useEffect(() => {
    }, [compState.filter]);


    const createOrUpdateModalOpen = async (item: any, actionName?: any) => {

        compState.balanceAmounts = item?.balanceAmounts;
        let entityDto: EntityDto = { id: item.id };
        compState.transferPointId = entityDto.id || 0
        displayModal(true, compState.transferPointId == 0 || actionName == L(AppConsts.actionNames.CREATE_CASHOUT) ? "Manage" : "View");
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
        { title: L(LocalizationKeys.ERP_LblCode.key), dataIndex: 'code', sorter: true, key: 'code', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblTransferPointType.key), dataIndex: 'transferPointTypeId', sorter: true, key: 'transferPointTypeId', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblTransferPointName.key), dataIndex: 'transferPointName', sorter: true, key: 'transferPointName', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblBalanceAmounts.key), dataIndex: 'balanceAmounts', sorter: true, key: 'balanceAmounts', width: 150, render: (text: string) => <div dangerouslySetInnerHTML={{ __html: utils.splitBalanceAmountsForEachLine(text) }}></div> }
    ];


    let actionsItem = [
        {
            "actionName": L(AppConsts.actionNames.CREATE_CASHOUT),
            "actionCallback": createOrUpdateModalOpen,
            "appearance": CustomButton.appearances.Money,
            "isVisible": isEditEnable
        },
        {
            "actionName": L(AppConsts.actionNames.VIEW_HISTORY),
            "actionCallback": createOrUpdateModalOpen,
            "appearance": CustomButton.appearances.History
        }
    ];

    const handleSearch = (value: string) => {
        compState.refreshString = new Date();
        if (value) {
            params.push(
                {
                    "key": "QueryFilters",
                    "value": value
                });
        }
        compState.parameters = params;
        setCompState({ ...compState });
    };

    return (
        <>

            <Card className='cashout-container card-grid'>

                <CustomCRUDComponent
                    hideHeading={true}
                    overrideActions={true}
                    isNewRecordDisable={true}
                    actionsList={actionsItem}
                    tableName='transferPoints'
                    tableColumns={columns}
                    enableDownloadCsv={false}
                    enableSearch={false}
                    parameters={compState.parameters}
                    refreshData={JSON.stringify(compState.refreshString)}
                    advanceFilterFields={cashoutAdvanceFilterForm}
                    enableAdvanceFilter={true}
                />

                <CreateOrUpdateCashOut
                    balanceAmount={compState.balanceAmounts}
                    visible={compState.modalVisible}
                    onCancel={() => {
                        displayModal(false);
                        compState.refreshString = new Date();
                        setCompState({ ...compState });
                    }}
                    transferPointId={compState.transferPointId}
                />

                <ViewCashOutHistory
                    transferPointId={compState.transferPointId}
                    visible={compState.viewModalVisible}
                    onCancel={() => { displayModal(false); }}
                />
            </Card>
        </>
    )
}

export default CashOut;