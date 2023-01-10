import React, { useEffect } from 'react';
import { CustomCol, CustomRow } from '../../../../components/CustomControls';
import '../../index.less';
import { L } from '../../../../lib/abpUtility';
import CustomDropdownInput from '../../../../components/CustomWebControls/CustomDropdown/customDropdownInput';
import { useAppState, useAppStores, useCompState } from '../../../../hooks/appStoreHooks';
import { ContentRequestDto } from '../../../../services/Content/dto/contentRequestDto';
import TransferStore from '../../../../stores/transferStore';
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
        sorting: ''
    };

    const { validations, editData, formRef } = props;

    const { supportersStore, contentStore } = useAppStores();
    const [compState, setCompState] = useCompState(initialState);

    const [destinationList,setDestinationList] = useAppState(TransferStore.AppStateKeys.ASSOCIATED_DESTINATION_LIST,[]);

    const onLoad = () => {
        getAllSupporters();
        getDestinationList(editData.transferFromId != 0 ? editData.transferFromId : formRef && formRef.getFieldValue('selectOrigin') ? formRef.getFieldValue('selectOrigin') : 0);
    }

    useEffect(onLoad, []);

    const getAllSupporters = async () => {
        let originsList: any = [];
        let requestObj: ContentRequestDto = {
            ComponentIdOrName: 'GetAllSupportersIncludingMe'
        }
        const supporterList = await contentStore.GetComponentData(requestObj);


        supporterList.items.map((supporterItem: any, index: any) => {
            originsList.push({ key: supporterItem.userId, value: supporterItem.name });
        });
        compState.originsList = originsList;
        setCompState({ ...compState });
    }


    const getDestinationList = async (repUserId: Number) => {


        // console.log(formRef?.getFieldsValue(true),"REF STATEs");

        // if(formRef){
        //     let obj = {};
        //     obj['selectDestination'] = null;
        //     formRef.setFieldsValue(obj);
        // }

        let requestObj: ContentRequestDto = {
            ComponentIdOrName: 'GetTransferPointsByUserId',
            Parameters: [{
                key: 'CurrentUserId',
                value: repUserId
            },]
        }
        const dataList = await contentStore.GetComponentData(requestObj);
        let destinationList: any = [];

        dataList && dataList.items.map((item: any, index: any) => {
            destinationList.push({ key: item.id, value: item.name });
        });
        compState.destinationList = destinationList;
        setCompState({ ...compState });

        setDestinationList(destinationList);
    }

    const onOriginChange = (selectedItem: any) => {
        getDestinationList(selectedItem.key);
    }
    return (
        <>
            <CustomRow>

                <CustomCol span={24}>

                    <CustomRow gutter={[16, 16]}>

                        <CustomCol span={12}>

                            <CustomDropdownInput
                                dataItems={compState.originsList}
                                label={L(LocalizationKeys.ERP_LblSelectOrigin.key)}
                                name={TransferStore.AppStateKeys.originOrDestination.SELECT_ORIGIN}
                                rules={validations.selectOrigin} value={editData.transferFromId != 0 ? editData.transferFromId : null} disable={editData && editData.transferFromId}
                                onChange={onOriginChange} />

                        </CustomCol>

                        <CustomCol span={12}>

                            <CustomDropdownInput
                                dataItems={compState.destinationList}
                                label={L(LocalizationKeys.ERP_LblSelectDestination.key)}
                                name={TransferStore.AppStateKeys.originOrDestination.SELECT_DESTINATION}
                                rules={validations.selectDestination} value={editData.transferToId != 0 ? editData.transferToId : null} />

                        </CustomCol>

                    </CustomRow>

                </CustomCol>

            </CustomRow>

        </>
    )
}

export default StartOriginOrDestination;
