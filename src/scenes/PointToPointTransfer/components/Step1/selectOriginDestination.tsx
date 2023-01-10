import React, { useEffect } from 'react';
import { CustomCol, CustomRow } from '../../../../components/CustomControls';
import '../../index.less';
import { L } from '../../../../lib/abpUtility';
import CustomDropdownInput from '../../../../components/CustomWebControls/CustomDropdown/customDropdownInput';
import { useAppState, useAppStores, useCompState } from '../../../../hooks/appStoreHooks';
import { ContentRequestDto } from '../../../../services/Content/dto/contentRequestDto';
import TransferStore from '../../../../stores/transferStore';
import { isNumber } from 'util';
import SessionStore from '../../../../stores/sessionStore';
import LocalizationKeys from '../../../../lib/localizationKeys';

export interface ISupporterState {
    originsList: [],
    destinationList: []
    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    supporterId: number;
    filter: string;
    sorting: string
    destinationTypeList: [];
    rawList: [];
    selectedOrigin: any;
    selectedTransferPoint: {};
}

const StartOriginOrDestination = (props: any) => {

    const initialState: ISupporterState = {
        originsList: [],
        destinationList: [],
        modalVisible: false,
        maxResultCount: 500,
        skipCount: 0,
        supporterId: 0,
        filter: '',
        sorting: '',
        destinationTypeList: [],
        rawList: [],
        selectedOrigin: null,
        selectedTransferPoint: {}

    };

    const { validations, editData, formRef } = props;

    const { supportersStore, contentStore } = useAppStores();
    const [compState, setCompState] = useCompState(initialState);

    const [currentLoginInfo] = useAppState(SessionStore.AppStateKeys.CURRENT_LOGIN);
    const onLoad = () => {
        getTransferPointTypes();
        getSupportersList();
    }
    useEffect(onLoad, []);

    const getSupportersList = async () => {
        try {
            let requestObj: ContentRequestDto = {
                ComponentIdOrName: 'GetTransferPointsByUserId',
                Parameters: []
            }
            const supporterList = await contentStore.GetComponentData(requestObj);
            compState.rawList = supporterList;
            setCompState({ ...compState });
        }
        catch (ex) {
            console.log(`error: ${ex}`);
        }
    }


    const getAllSupporters = (item: any) => {
        try {
            let originsList: any = [];
            compState.rawList.items && compState.rawList.items.map((supporterItem: any, index: any) => {
                if (supporterItem.transferPointTypeId == item) {
                    originsList.push({ key: supporterItem.id, value: supporterItem.name });
                }
            });
            compState.originsList = originsList;
            setCompState({ ...compState });
        }
        catch (ex) {
            console.log(`error: ${ex}`);
        }
    }


    const getDestinationList = () => {
        try {
            let destinationList: any = [];
            compState.rawList.items && compState.rawList.items.map((item: any) => {
                if (item.transferPointTypeId == compState.selectedTransferPoint) {
                    destinationList.push({ key: item.id, value: item.name });
                }
            });
            compState.destinationList = destinationList
            setCompState({ ...compState });
        }
        catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    const getTransferPointTypes = async () => {

        try {
            let requestObj: ContentRequestDto = {
                ComponentIdOrName: 'GetTransferPointTypes',
                Parameters: []
            }
            const dataList = await contentStore.GetComponentData(requestObj);
            let transferTypePointList: any = [];
            dataList && dataList.items.map((transferPtType: any, index: any) => {
                transferTypePointList.push({ key: transferPtType.coreId, value: transferPtType.name });
            });
            compState.destinationTypeList = transferTypePointList;
            setCompState({ ...compState });

            if (formRef && formRef.getFieldValue(TransferStore.AppStateKeys.originOrDestination.SELECT_ORIGIN + 'Type')) {
                getAllSupporters(formRef.getFieldValue(TransferStore.AppStateKeys.originOrDestination.SELECT_ORIGIN + 'Type'));
            }

            if (formRef && formRef.getFieldValue(TransferStore.AppStateKeys.originOrDestination.SELECT_DESTINATION + 'Type')) {
                compState.selectedTransferPoint = formRef.getFieldValue(TransferStore.AppStateKeys.originOrDestination.SELECT_DESTINATION + 'Type');
                compState.selectedOrigin = formRef.getFieldValue(TransferStore.AppStateKeys.originOrDestination.SELECT_ORIGIN);
                setCompState({ ...compState });
                getDestinationList();
            }

            if (editData && editData.selectOrigOrDestObj?.originId) {
                getAllSupporters(editData.selectOrigOrDestObj?.originTypeId);
            }

            if (editData && editData.selectOrigOrDestObj?.destinationId) {
                compState.selectedTransferPoint = editData.selectOrigOrDestObj?.destinationTypeId;
                compState.selectedOrigin = editData.selectOrigOrDestObj?.originId;
                setCompState({ ...compState });
                getDestinationList();
            }

        } catch (ex) {
            console.log(`error: ${ex}`);
        }

    }

    const onOriginChange = (selectedItem: any) => {
        compState.selectedOrigin = selectedItem.key;
        setCompState({ ...compState });
        getDestinationList();
    }

    const onDestinationTypeChange = (selectedItem: any) => {
        compState.selectedTransferPoint = selectedItem.key;
        setCompState({ ...compState });
        getDestinationList();
    }
    const onOriginTypeChange = (selectedItem: any) => {
        compState.selectedOrigin = null;
        setCompState({ ...compState });
        getAllSupporters(selectedItem.key);
    }


    return (
        <>
            <CustomRow>
                <CustomCol span={24}>
                    <CustomRow gutter={[16, 16]}>
                        <CustomCol span={12}>
                            <CustomDropdownInput
                                dataItems={compState.destinationTypeList}
                                label={LocalizationKeys.ERP_LblSelectOriginType.key}
                                name={TransferStore.AppStateKeys.originOrDestination.SELECT_ORIGIN + 'Type'}
                                rules={validations.selectOriginType}
                                disable={editData && editData.selectOrigOrDestObj?.originTypeId}
                                value={editData && editData.selectOrigOrDestObj?.originTypeId != 0 ? editData.selectOrigOrDestObj?.originTypeId : null}
                                onChange={onOriginTypeChange} />
                        </CustomCol>


                        <CustomCol span={12}>
                            <CustomDropdownInput
                                dataItems={compState.destinationTypeList}
                                label={L(LocalizationKeys.ERP_LblSelectDestinationType.key)}
                                name={TransferStore.AppStateKeys.originOrDestination.SELECT_DESTINATION + 'Type'}
                                rules={validations.selectDestinationType}
                                value={editData && editData.selectOrigOrDestObj?.destinationTypeId != 0 ? editData.selectOrigOrDestObj?.destinationTypeId : null}
                                onChange={onDestinationTypeChange} />
                        </CustomCol>
                    </CustomRow>

                    <CustomRow gutter={[16, 16]}>

                        <CustomCol span={12}>
                            <CustomDropdownInput
                                dataItems={compState.originsList}
                                label={L(LocalizationKeys.ERP_LblSelectOrigin.key)}
                                name={TransferStore.AppStateKeys.originOrDestination.SELECT_ORIGIN}
                                rules={validations.selectOrigin}
                                value={editData && editData.selectOrigOrDestObj?.originId ? editData.selectOrigOrDestObj?.originId : compState.selectedOrigin}
                                disable={editData && editData.selectOrigOrDestObj?.originId}
                                onChange={onOriginChange} />
                        </CustomCol>

                        <CustomCol span={12}>
                            <CustomDropdownInput
                                dataItems={compState.destinationList}
                                label={L(LocalizationKeys.ERP_LblSelectDestination.key)}
                                name={TransferStore.AppStateKeys.originOrDestination.SELECT_DESTINATION}
                                rules={validations.selectDestination} value={editData && editData.selectOrigOrDestObj?.destinationId != 0 ? editData.selectOrigOrDestObj?.destinationId : null} />

                        </CustomCol>
                    </CustomRow>
                </CustomCol>
            </CustomRow>

        </>
    )
}

export default StartOriginOrDestination;
