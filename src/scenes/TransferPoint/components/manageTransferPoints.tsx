import { GlobalOutlined, UserAddOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { FormInstance, Switch, Tabs } from 'antd';
import React, { useEffect, useRef } from 'react';
import { CustomCol, CustomModal, CustomRow } from '../../../components/CustomControls';
import CustomCheckboxInput from '../../../components/CustomWebControls/CustomCheckbox/customCheckboxInput';
import CustomItemSelector from '../../../components/CustomWebControls/CustomItemSelector/customItemSelector';
import { useAppStores, useCompState } from '../../../hooks/appStoreHooks';
import { L } from '../../../lib/abpUtility';
import LocalizationKeys from '../../../lib/localizationKeys';
import { ContentRequestDto, SavedRequestDto } from '../../../services/Content/dto/contentRequestDto';
import { GrantTransferPointPermission } from '../../../services/permission/dto/permissionDto';

import '../index.less';

const ManageTransferPoints = (props: any) => {

    const customItemSelectorRefAccessMembers = useRef<FormInstance>();
    const customItemSelectorRefAccessCountries = useRef<FormInstance>();
    const customItemSelectorRefAcknowledgeMembers = useRef<FormInstance>();
    const { visible, onCreate, onCancel, transferPointId, transferPointName, permission } = props;

    // state for permissions
    let [permissionsArray, setPermissionsArray] = useCompState([]);

    const [saveSelectedItemsAccess, setSaveSelectedItemsAccess] = useCompState([]);
    const [saveSelectedItemsAck, setSaveSelectedItemsAck] = useCompState([]);

    // state for country
    const [saveSelectedItemsCountry, setSaveSelectedItemsCountry] = useCompState([]);

    // state for checkbox
    const [isChecked, setIsChecked] = useCompState(false);

    const { contentStore, permissionStore } = useAppStores();
    const sourceAcess = 'Acess';
    const sourceAck = 'Ack';
    const sourceCountry = 'Country';

    useEffect(() => {
        getTPPermissions();
        getAccessMembers();
        getAcknowledgeMembers();
    }, [transferPointId]); // transferPointId

    // useEffect(() => {

    //     if (permission && permission != "") {

    //         try {
    //             let permissionObj = JSON.parse(permission);
    //             if (permissionObj) {

    //                 permissionsArray = permissionObj;
    //                 setPermissionsArray(permissionsArray);
    //                 setIsChecked(true);
    //                 getSecuredCountries();
    //             }
    //         } catch (ex) {
    //             console.log(`error: ${ex}`);
    //         }
    //     }
    //     else {
    //         setIsChecked(false);
    //     }

    // }, []); // permission

    const getTPPermissions = async () => {
        if (transferPointId && transferPointId > 0) {
            let parameters = [{
                key: 'Id',
                value: transferPointId
            },
            {
                key: 'Table',
                value: "TransferPoints"
            }];

            let requestObj: ContentRequestDto = {

                ComponentIdOrName: 'GetData',
                Parameters: parameters
            }
            //get TP data by id
            var tpData = await contentStore.GetComponentData(requestObj);
            //check if it has permissions IOW, is it secured or not
            if (tpData && tpData.permissions && tpData.permissions != "") {
                try {
                    let permissionObj = JSON.parse(tpData.permissions);
                    if (permissionObj) {
                        setIsChecked(true);
                    }
                } catch (ex) {
                    console.log(`error: ${ex}`);
                }
            }
            else {
                setIsChecked(false);
            }
        }
    }
    const getAccessMembers = async () => {
        if (transferPointId && transferPointId > 0) {
            let requestObj: ContentRequestDto = {
                ComponentIdOrName: 'GetTransferPointAccessPermissionByTPId',
                Parameters: [
                    {
                        key: "TransferPointId",
                        value: transferPointId
                    }]
            }
            let res = await contentStore.GetComponentData(requestObj);
            if (res) {
                let tempItems = res.items;
                for (let i = 0; i < res.items.length; i++) {
                    saveSelectedItemsAccess.push({
                        "id": tempItems[i].id,
                        "name": tempItems[i].supporterName,
                        "isDeleted": false,
                        "isEditable": false,
                        "supporterCode": tempItems[i].supporterCode,
                        "source": sourceAcess,
                        "userId": tempItems[i].userId
                    });
                }
            }
            setSaveSelectedItemsAccess([...saveSelectedItemsAccess]);
        }
    }

    const getAcknowledgeMembers = async () => {
        if (transferPointId && transferPointId > 0) {
            let requestObj: ContentRequestDto = {
                ComponentIdOrName: 'GetTransferPointAcknowledgePermissionByTPId',
                Parameters: [
                    {
                        key: "TransferPointId",
                        value: transferPointId
                    }]
            }
            let res = await contentStore.GetComponentData(requestObj);
            if (res) {
                let tempItems = res.items;
                for (let i = 0; i < res.items.length; i++) {
                    saveSelectedItemsAck.push({
                        "id": tempItems[i].id,
                        "name": tempItems[i].supporterName,
                        "isDeleted": false,
                        "isEditable": false,
                        "supporterCode": tempItems[i].supporterCode,
                        "source": sourceAck,
                        "userId": tempItems[i].userId
                    });
                }
            }
            setSaveSelectedItemsAck([...saveSelectedItemsAck]);
        }
    }

    // get secured countries
    // const getSecuredCountries = async () => {
    //     if (transferPointId && transferPointId > 0) {
    //         let requestObj: ContentRequestDto = {
    //             ComponentIdOrName: 'GetAllPagedData',
    //             Parameters: [
    //                 {
    //                     key: "Table",
    //                     value: "Countries"
    //                 },
    //                 {
    //                     key: "SkipCount",
    //                     value: 0
    //                 },
    //                 {
    //                     key: "Sorting",
    //                     value: "countryName"
    //                 },
    //                 {
    //                     key: "MaxResultCount",
    //                     value: 5000
    //                 },
    //                 {
    //                     key: "SelectFields",
    //                     value: "Id,Code,FK_Countries.Id_CountryTranslation_CoreId_Name_CountryName"
    //                 }
    //             ]
    //         };

    //         let res = await contentStore.GetComponentData(requestObj);

    //         console.log("countries res : ---- ", res);
    //         console.log("permissionsArray : ---- ", permissionsArray);

    //         // console.log(res, 'RESPONSE COUN', permissionsArray);

    //         if (res) {

    //             let countryPermission = permissionsArray.filter((item: any) => item.startsWith('CTR.'));

    //             console.log('YEH MILA :', countryPermission);

    //             let tempItems = res.items;
    //             for (let i = 0; i < countryPermission.length; i++) {

    //                 let savedCountry = countryPermission[i].split('.');

    //                 console.log(savedCountry, 'SAVED COUNTRY');

    //                 let country = tempItems.find((country: any) => country.id == savedCountry[1]);

    //                 if (country) {

    //                     saveSelectedItemsCountry.push({
    //                         "id": country.id,
    //                         "countryName": country.countryName,
    //                         "code": country.code,
    //                         "isDeleted": false,
    //                         "isEditable": false,
    //                         "source": sourceCountry,
    //                     });
    //                 }
    //             }
    //         }
    //         setSaveSelectedItemsCountry([...saveSelectedItemsCountry]);
    //         console.log(saveSelectedItemsCountry, 'COUNTYR SAVED');
    //     }
    // }

    const onClose = () => {
        setSaveSelectedItemsAccess([...[]]);
        setSaveSelectedItemsAck([...[]]);
        //setSaveSelectedItemsCountry([...[]]);
        setIsChecked(isChecked);
        onCancel();
    }

    let modalOptions = {

        "visible": visible,
        "width": '55%',
        "title": ` ${L(LocalizationKeys.ERP_HdrTransferPointParticipants.key)} : ${transferPointName}  `,
        "destroyOnClose": true,
        "onCancel": onClose,
        "footer": null,
        //"onOk": onSubmit,
        "okText": L(LocalizationKeys.ERP_LblSave.key),
        theme: "danger"

    }

    const columns = [
        {
            "mode": "Display",
            "size": "Small",
            "validations": null,
            "type": "Number",
            "defaultValue": "",
            "visible": true,
            "internalName": "supporterCode",
            "displayName": L(LocalizationKeys.ERP_LblSupporterCode.key),
            "value": ""
        },
        {
            "mode": "Display",
            "size": "Small",
            "validations": null,
            "type": "Checkbox",
            "defaultValue": "",
            "visible": true,
            "internalName": "name",
            "displayName": L(LocalizationKeys.ERP_LblName.key),
            "value": ""
        },
    ];
    let componentOption = {
        "name": "ctrlSupporter",
        "dataSource": "GetAllSupportersList",
        "dataTextField": "name",
        "dataValueField": "userId",
        "parameters": [
            {
                key: "SkipCount",
                value: 0
            },
            {
                key: "Sorting",
                value: "Name"
            },
            {
                key: "MaxResultCount",
                value: 500
            }
        ],
        "placeholder": L(LocalizationKeys.ERP_Error_FieldPleaseSelectSupporter.key),
        "heading": "Supporter"
    }

    const columnsCountry = [
        {
            "mode": "Display",
            "size": "Small",
            "validations": null,
            "type": "Number",
            "defaultValue": "",
            "visible": true,
            "internalName": "code",
            "displayName": L(LocalizationKeys.ERP_LblCountryCode.key),
            "value": ""
        },
        {
            "mode": "Display",
            "size": "Small",
            "validations": null,
            "type": "Checkbox",
            "defaultValue": "",
            "visible": true,
            "internalName": "countryName",
            "displayName": L(LocalizationKeys.ERP_LblCountryName.key),
            "value": ""
        },
    ];
    let componentOptionCountry = {
        "name": "ctrlCountries",
        "dataSource": "GetAllPagedData",
        "dataTextField": "countryName",
        "dataValueField": "id",
        "parameters": [
            {
                key: "Table",
                value: "Countries"
            },
            {
                key: "SkipCount",
                value: 0
            },
            {
                key: "Sorting",
                value: "countryName"
            },
            {
                key: "MaxResultCount",
                value: 5000
            },
            {
                key: "SelectFields",
                value: "Id,Code,FK_Countries.Id_CountryTranslation_CoreId_Name_CountryName"
            }
        ],
        "placeholder": L(LocalizationKeys.ERP_Error_FieldPleaseSelectSupporter.key),
        "heading": "Country"
    }

    const onUpdateRow = async (row: any) => {
        try {
            let reqObj: GrantTransferPointPermission = {
                isAcessPermission: false,
                supporterUserId: row.userId,
                transferPointId: transferPointId
            };
            if (row.source === sourceAcess || row.source === sourceAck) {
                if (row.source == sourceAcess)
                    reqObj.isAcessPermission = true

                let result = await permissionStore.grantTransferPointPermission(reqObj);
                return result.success;
            }

            else if (row.source === sourceCountry) {
                // make api call , add this country in permission array 
                //(append in current permissions array ? and update permission array )

                permissionsArray.push(`CTR.${row.id}`);
                // update state permission Array
                return true;

            }
            // return true;
        }
        catch (ex) {
            console.log(`error: ${ex}`);
            return null;
        }
    }

    const onDeleteRow = async (row: any) => {
        try {

            if (row.isEditable)
                return true;

            let reqObj: GrantTransferPointPermission = {
                isAcessPermission: false,
                supporterUserId: row.userId,
                transferPointId: transferPointId
            };
            if (row.source === sourceAcess || row.source === sourceAck) {
                if (row.source == sourceAcess)
                    reqObj.isAcessPermission = true

                let result = await permissionStore.revokeTransferPointPermission(reqObj);
                return (result.success && result.result);
            }

            else if (row.source === sourceCountry) {
                // make api call , add this country in permission array 
                //(append in current permissions array ? and update permission array )

                // permissionsArray.push(`CTR.${row.id}`);

                // let ctrArr = permissionsArray.filter((item: any) => item.id !== row.id)

                // console.log("ctrArr .....", ctrArr);

                let ctrArr = permissionsArray.filter((item: any) => item.startsWith('CTR.'));

                for (let i = 0; i < ctrArr.length; i++) {

                    let removedCountry = ctrArr[i].split('.');

                    //  let country = permissionsArray.find((country: any) => country.id == removedCountry[1]);

                    console.log('removedCountry', removedCountry);

                    // let country = tempItems.find((country: any) => country.id == removedCountry[1]);

                }
                return true;
            }
        }
        catch (ex) {
            console.log(`error: ${ex}`);
            return null;
        }

    }

    const checkboxHandler = async (e: any) => {
        setIsChecked(!isChecked);
        if (transferPointId) {
            let permissions: any = null;

            if (!isChecked) {
                let permissionsArr = [];
                permissionsArr.push(`TP.${transferPointId}`);
                permissionsArr.push(`TP.${transferPointId}.ACK`);
                permissions = JSON.stringify(permissionsArr);
            }

            let requestObj: SavedRequestDto = {
                tableName: "TransferPoints",
                Parameters: [
                    {
                        key: "Id",
                        value: transferPointId
                    },
                    {
                        key: "Permissions",
                        value: permissions
                    }
                ]
            }
            contentStore.createNewComponent(requestObj);
        }
    }
    return (<CustomModal className='transfer-point-modal' {...modalOptions}>


        <CustomRow>

            <CustomCol span={24}>
                <Tabs defaultActiveKey={'0'} className='report-tabs'>
                    <Tabs.TabPane
                        tab={<span><i><UsergroupAddOutlined /></i>{L(LocalizationKeys.ERP_LblAccessMembers.key)}</span>}
                        key={0}
                        forceRender={true}>
                        <CustomCheckboxInput checked={isChecked} onChange={checkboxHandler}>
                            {L(LocalizationKeys.ERP_LblIsSecured.key)}
                        </CustomCheckboxInput>
                        {!isChecked && <div><b>"{transferPointName}"</b> {L(LocalizationKeys.ERP_MsgAllMembersReps.key)} </div>}
                        {isChecked &&
                            <>
                                <div><b>"{transferPointName}"</b> {L(LocalizationKeys.ERP_MsgAccessMembersReps.key)} </div>
                                <CustomItemSelector {...props}
                                    ref={customItemSelectorRefAccessMembers}
                                    componentOptions={componentOption}
                                    dataSourceColumns={columns}
                                    savedSelectedItems={saveSelectedItemsAccess}
                                    isEditActionVisible={false}
                                    onUpdateRow={onUpdateRow}
                                    onDeleteRow={onDeleteRow}
                                    source={sourceAcess}
                                />
                            </>
                        }
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab={<span><i><UsergroupAddOutlined /></i>{L(LocalizationKeys.ERP_LblAcknowledgeMembers.key)}</span>}
                        key={2}
                        forceRender={true}>
                        <div> { L(LocalizationKeys.ERP_MsgMembersPermission.key) } <b>"{transferPointName}"</b></div>
                        <CustomItemSelector {...props}
                            ref={customItemSelectorRefAcknowledgeMembers}
                            componentOptions={componentOption}
                            dataSourceColumns={columns}
                            savedSelectedItems={saveSelectedItemsAck}
                            isEditActionVisible={false}
                            onUpdateRow={onUpdateRow}
                            onDeleteRow={onDeleteRow}
                            source={sourceAck}
                        />
                    </Tabs.TabPane>
                    {/* <Tabs.TabPane
                            tab={<span><i><GlobalOutlined /></i>{L(LocalizationKeys.ERP_LblAccessCountries.key)}</span>}
                            key={1}
                            forceRender={true}>

                            <CustomItemSelector {...props}
                                ref={customItemSelectorRefAccessCountries}
                                componentOptions={componentOptionCountry}
                                dataSourceColumns={columnsCountry}
                                savedSelectedItems={saveSelectedItemsCountry}
                                isEditActionVisible={false}
                                onUpdateRow={onUpdateRow}
                                onDeleteRow={onDeleteRow}
                                source={sourceCountry}
                            />
                        </Tabs.TabPane> */}

                </Tabs>

            </CustomCol>

        </CustomRow>


        {/* end secure controls */}

        <CustomRow>

            <CustomCol span={24}>

                <Tabs defaultActiveKey={'0'} className='report-tabs'>

                    
                </Tabs>

            </CustomCol>

        </CustomRow>

    </CustomModal>
    )
}

export default ManageTransferPoints;
