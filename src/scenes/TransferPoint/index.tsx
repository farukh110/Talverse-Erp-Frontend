import React, { useEffect, useRef } from 'react';
import { Card, FormInstance, Input, Modal } from 'antd';
import { useAppState, useAppStores, useCompState } from '../../hooks/appStoreHooks';
import TransferStore from '../../stores/transferStore';
import { ContentRequestDto } from '../../services/Content/dto/contentRequestDto';
import AppConsts from '../../lib/appconst';
import { EntityDto } from '../../services/dto/entityDto';
import { CustomButton, CustomCol, CustomRow } from '../../components/CustomControls';
import { isGranted, L } from '../../lib/abpUtility';
import utils from '../../utils/utils';
import View from '../PointToPointTransfer/components/view';
import CreateOrUpdateTransfer from '../PointToPointTransfer/components/createOrUpdateTransfer';
import { CustomTable } from '../../components/CustomGrid';
import CustomCRUDComponent from '../../components/CustomCRUDComponent';
import ManageTransferPoints from './components/manageTransferPoints';
import createTransferPointForm from './json/createTransferPointForm.json';
import updateTransferPointForm from './json/updateTransferPointForm.json';
import viewTransferPointForm from './json/viewTransferPointForm.json';
import LocalizationKeys from '../../lib/localizationKeys';
import ManageBalanceAmounts from './components/manageBalanceAmounts';
import CustomAdvanceFilter from '../../components/CustomWebControls/CustomAdvanceFilter/customAdvanceFilter';
import transferPointAdvanceFilterForm from './json/transferPointAdvanceFilterForm.json';
import ViewTransferPointsBalance from './components/viewTransferPointsBalance';

export interface ITransferPointState {
    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    transferPointId: number;
    filter: string;
    sorting: string;
    transferPointName: string;
}

const confirm = Modal.confirm;
const Search = Input.Search;

const TransferPoint = (props: any) => {

    const initialState: ITransferPointState = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        transferPointId: 0,
        filter: '',
        sorting: 'Id DESC',
        transferPointName: ''
    };

    let params = [
        {
            key: "SelectFields",
            value: "Id,Code,FK_transferPoints.TransferPointTypeId_TransferPointTypeTranslation_CoreId_Name_transferPointTypeId,FK_transferPoints.ID_TransferPointTranslation_CoreId_Name_TransferPointName,LastModificationTime,CreationTime,FK_transferPoints.creatorUserId_Users_id_Name_creatorUser,FK_transferPoints.lastModifierUserId_Users_id_Name_lastModifierUser"
        }
    ];


    // const [compState, setCompState] = useCompState(initialState);

    const [compState, setCompState] = useCompState({ parameters: params });

    const [transferPointForm, setTransferPointForm] = useCompState({});

    const [manBalAmountVisible, setManBalAmountVisible] = useCompState(false);
    useEffect(() => {

        setTransferPointForm(createTransferPointForm);

    }, []);

    const displayModal = (isVisible: boolean, modelType?: string) => {

        if (modelType) {
            if (modelType == "View") {
                compState.modalVisible = isVisible;
            }
            else if (modelType == "Manage") {
                compState.manageTransferPointsModalVisible = isVisible;
            }
        }
        else {
            compState.modalVisible = compState.manageTransferPointsModalVisible = isVisible;
        }
        setCompState({ ...compState });

    };

    const handleCreate = async (values: any) => {
        // await getAllTransferPoint();
        displayModal(false);
    };

    const handleSearch = (value: string) => {
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

    const createOrUpdateModalOpen = (item: any, actionName?: any) => {

        let modelType = "Manage";
        compState.transferPointId = item?.id;
        compState.transferPointName = item?.transferPointName;
        if (L(AppConsts.actionNames.MANAGE_BALANCE_AMOUNTS) == actionName) {

            compState.manageTransferPointsModalVisible = false;
            setCompState({ ...compState })
            setManBalAmountVisible(true);
        }
        else if (L(AppConsts.actionNames.VIEW_BALANCE_AMOUNT) == actionName) {
            compState.manageTransferPointsModalVisible = false;
            setManBalAmountVisible(false);
            modelType = "View";
            displayModal(true, modelType);
        }
        else {
            displayModal(true, modelType);
        }

    }

    // start delete item

    const deleteItem = (item: any) => {
        let input: EntityDto = { id: item.id };
        confirm({
            title: L(LocalizationKeys.ERP_MsgConfirmDeleteRecord.key),
            onOk() {
                // contentStore.delete(input);
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    }

    let actionsItem = [
        {
            "actionName": L(LocalizationKeys.ERP_BtnManageTransferPointUsers.key),
            "actionCallback": createOrUpdateModalOpen,
            "appearance": CustomButton.appearances.UserGroup,
            "isVisible": () => {
                return (isGranted(AppConsts.permissionNames.Transfer_Point_Manage_Users))
            }
        },
        {
            "actionName": L(AppConsts.actionNames.MANAGE_BALANCE_AMOUNTS),
            "actionCallback": createOrUpdateModalOpen,
            "appearance": CustomButton.appearances.Cash,
            "isVisible": () => {
                return (isGranted(AppConsts.permissionNames.Transfer_Point_Manage_Balance_Amount))
            }
        },
        {
            "actionName": L(AppConsts.actionNames.VIEW_BALANCE_AMOUNT),
            "actionCallback": createOrUpdateModalOpen,
            "appearance": CustomButton.appearances.Detail,
            "isVisible": (record: any) => {
                return (isGranted(`TP.${record.id}.ACK`))
            }
        }

    ];

    const columns = [
        // { title: L(LocalizationKeys.ERP_LblId.key), dataIndex: 'id', sorter: true, key: 'id', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblCode.key), dataIndex: 'code', sorter: true, key: 'code', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblTransferPointType.key), dataIndex: 'transferPointTypeId', sorter: true, key: 'transferPointTypeId', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblTransferPointName.key), dataIndex: 'transferPointName', sorter: true, key: 'transferPointName', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblCreatedOn.key), dataIndex: 'creationTime', sorter: true, key: 'creationTime', width: 150, render: (text: string) => <div> {utils.formattedDateAndTime(text)} </div> },
        { title: L(LocalizationKeys.ERP_LblCreatorUserId.key), dataIndex: 'creatorUser', sorter: true, key: 'creatorUser', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblLastModificationTime.key), dataIndex: 'lastModificationTime', sorter: true, key: 'lastModificationTime', width: 150, render: (text: string) => <div>{utils.formattedDateAndTime(text)}</div> },
        { title: L(LocalizationKeys.ERP_LblLastModifierUserId.key), dataIndex: 'lastModifierUser', sorter: true, key: 'lastModifierUser', width: 150, render: (text: string) => <div>{text}</div> }
        // { title: L(LocalizationKeys.ERP_LblDate.key), dataIndex: 'creationTime', sorter: true, key: 'creationTime', width: 150, render: (text: string) => <div> {utils.formattedDate(text)} </div> },
    ];

    let modalWidth: any = '45%';

    return (
        <>
            <Card className='transfer-point-container' bordered={false}>

                <CustomCRUDComponent
                    hideHeading={true}
                    actionsList={actionsItem}
                    tableName='transferPoints'
                    isWithTranslation={true}
                    translationTableName='TransferPointTranslation'
                    tableColumns={columns}
                    isNewRecordDisable={!isGranted(AppConsts.permissionNames.Transfer_Point_Add)}
                    enableSearch={false}
                    enableDownloadCsv={false}
                    formFields={createTransferPointForm.formFields}
                    formFieldsForEdit={updateTransferPointForm.formFields}
                    formFieldsForView={viewTransferPointForm.formFields}
                    overrideActions={false}
                    parameters={compState.parameters}
                    refreshData={JSON.stringify(compState.parameters)}
                    advanceFilterFields={transferPointAdvanceFilterForm}
                    enableAdvanceFilter={true}
                    modalWidth={modalWidth}
                    modalTitle={L(LocalizationKeys.ERP_LblTransferPoint.key)}
                    titleFieldName='transferPointName'
                    customDataSource={"GetAllSecuredPagedData"}
                    isEditVisible={isGranted(AppConsts.permissionNames.Transfer_Point_Edit)}
                    isViewVisible={isGranted(AppConsts.permissionNames.Transfer_Point_View)}

                />

                <ManageTransferPoints
                    visible={compState.manageTransferPointsModalVisible}
                    onCancel={() => {
                        compState.transferPointId = 0;
                        displayModal(false);
                    }}
                    onCreate={handleCreate}
                    transferPointId={compState.transferPointId}
                    transferPointName={compState.transferPointName}
                />
                <ManageBalanceAmounts
                    transferPointId={compState.transferPointId}
                    transferPointName={compState.transferPointName}
                    onCancel={() => {
                        setManBalAmountVisible(false);
                        compState.transferPointId = 0;
                        compState.manageTransferPointsModalVisible = false;
                        setCompState({ ...compState });
                    }}
                    onCreate={() => { }}
                    visible={manBalAmountVisible}
                />

                <ViewTransferPointsBalance
                    visible={compState.modalVisible}
                    transferPointId={compState.transferPointId}
                    transferPointName={compState.transferPointName}
                    onCancel={() => {
                        compState.transferPointId = 0;
                        displayModal(false);
                    }}
                />
            </Card>
        </>
    )
}

export default TransferPoint;
