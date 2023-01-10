import React, { useEffect, useRef } from 'react';
import { FormInstance } from 'antd/lib/form';
import CustomItemSelector from '../../../components/CustomWebControls/CustomItemSelector/customItemSelector';
import { useAppStores, useCompState } from '../../../hooks/appStoreHooks';
import { AuthorizeCampaignRequestDto } from '../../../services/campaigns/dto/updateCampaignOutput';
import { ContentRequestDto } from '../../../services/Content/dto/contentRequestDto';
import './index.less';
import { CustomButton, CustomCol, CustomModal, CustomRow } from '../../../components/CustomControls';
import { Card, Tag } from 'antd';
import CustomForm from '../../../components/CustomForm';
import { L } from '../../../lib/abpUtility';
import addAdditionalTargetForm from '../json/addAdditionalTargetForm.json';
import { CustomTable } from '../../../components/CustomGrid';
import utils from '../../../utils/utils';
import LocalizationKeys from '../../../lib/localizationKeys';

const Participants = (props: any) => {

    const customItemSelectorRef = useRef<FormInstance>();

    const { location } = props;
    const { state } = location;
    const { campaignId, pageTitle } = state;

    const [saveSelectedItems, setSaveSelectedItems] = useCompState([]);

    const [formList, setFormList] = useCompState({});

    const [isModalVisible, setIsModalVisible] = useCompState(false);

    const [currentModalRecord, setCurrentModalRecord] = useCompState({});

    const { campaignsStore } = useAppStores();

    useEffect(() => {
        populateFormFields();
    }, [campaignId]);


    const showModal = (rec: any) => {

        setIsModalVisible(true);
        setFormList(addAdditionalTargetForm);
        setCurrentModalRecord({ ...rec });
    };
    const closeModal = () => {

        setIsModalVisible(false);
    };


    const saveForm = async (values: any) => {

        const formRef = customItemSelectorRef.current;
        // create call here
        let requestobj: AuthorizeCampaignRequestDto = {
            campaignId: 0,
            additionalTarget: 0,
            supporterTarget: 0,
            supporterUserId: 0,
            comments: ''
        };
        requestobj.campaignId = campaignId;
        requestobj.additionalTarget = values.target;
        requestobj.supporterTarget = formRef!.getFieldValue('customItemSelector_myTarget_' + currentModalRecord.id);
        requestobj.supporterUserId = currentModalRecord.userId;
        requestobj.comments = values.additionalInfo;
        let result = await campaignsStore.updateCampaignAdditionalTarget(requestobj);
        if (result && result.success) {
            await populateFormFields();
            setIsModalVisible(false);
        }

    };


    const populateFormFields = async () => {
        let requestObj: ContentRequestDto = {
            ComponentIdOrName: 'GetUserSettingsByCampaignIdBasedOnPermission',
            Parameters: [
                {
                    key: "CampaignId",
                    value: campaignId
                }]
        }
        let res = await campaignsStore.getComponentData(requestObj);
        let saveItems = saveSelectedItems;
        if (res) {
            let tempItems = res.items;
            saveItems = [];
            for (let i = 0; i < res.items.length; i++) {
                let commentshistory = tempItems[i].value.find((elem: any) => elem.id == campaignId)?.commentsHistory;
                if (commentshistory) {
                    commentshistory.splice(0, 1);
                }
                saveItems.push({
                    "id": tempItems[i].id,
                    "name": tempItems[i].supporterName,
                    "userId": tempItems[i].userId,
                    "myTarget": tempItems[i].value.find((elem: any) => elem.id == campaignId)?.myTarget,
                    "additionalTarget": tempItems[i].value.find((elem: any) => elem.id == campaignId)?.additionalTargets ? tempItems[i].value.find((elem: any) => elem.id == campaignId)?.additionalTargets : 0,
                    "supporterId": tempItems[i].supporterId,
                    "comment": commentshistory,
                    "isDeleted": false,
                    "isEditable": false
                });
            }
        }
        setSaveSelectedItems([...saveItems]);
    }

    const columns = [
    //     {
    //     "mode": "Display",
    //     "size": "Small",
    //     "validations": null,
    //     "type": "Textbox",
    //     "defaultValue": "",
    //     "visible": false,
    //     "internalName": "supporterId",
    //     "displayName": "Id",
    //     "value": ""
    // },
    {
        "mode": "Display",
        "size": "Small",
        "validations": null,
        "type": "Checkbox",
        "defaultValue": "",
        "visible": true,
        "internalName": "name",
        "displayName": "Name",
        "value": ""
    },
    {
        "mode": "Label",
        "size": "Small",
        "validations": null,
        "type": "Number",
        "defaultValue": "",
        "visible": true,
        "internalName": "additionalTarget",
        "displayName": " Additional Target Achieved",
        "value": "",
        render: (text: any, record: any) => {
            return <div>
                
                <Tag> {text} </Tag>
                 <CustomButton onClick={() => showModal(record)} appearance={CustomButton.appearances.MoreInfo
            } /> </div>
        }
    },
    {
        "mode": "Edit",
        "size": "Small",
        "validations": null,
        "type": "Number",
        "defaultValue": "",
        "visible": true,
        "internalName": "myTarget",
        "displayName": "My Target",
        "value": ""
    }
    ];
    let componentOption = {
        "name": "ctrlSupporter",
        "dataSource": "GetAllNonDonorSupporters",
        "dataTextField": "name",
        "dataValueField": "userId",
        "parameters": [
            {
                key: "CampaignId",
                value: campaignId
            }],
        "placeholder": "Please select participants",
        "heading": L(LocalizationKeys.ERP_LblSupporter.key)
    }

    const onUpdateRow = async (row: any) => {
        try {
            let result = await campaignsStore.authorizeCampaignToSupporter(await createRequestObj(row));
            return result.success;
        }
        catch (ex) {
            console.log(`error: ${ex}`);
            return null;
        }
    }

    const onDeleteRow = async (row: any) => {
        try {
            let result = await campaignsStore.revokeCampaignfromSupporter(await createRequestObj(row));
            return (result.success && result.result);
        }
        catch (ex) {
            console.log(`error: ${ex}`);
            return null;
        }

    }

    const createRequestObj = async (row: any) => {
        let requestobj: AuthorizeCampaignRequestDto = {
            campaignId: 0,
            additionalTarget: 0,
            supporterTarget: 0,
            supporterUserId: 0,
            comments: ''
        };
        try {
            const formRef = customItemSelectorRef.current;
            requestobj.campaignId = campaignId;
            requestobj.additionalTarget = row.additionalTarget;
            requestobj.supporterTarget = formRef!.getFieldValue('customItemSelector_myTarget_' + row.id);
            requestobj.supporterUserId = row.userId;
            requestobj.comments = "Assigning My Target";

            return requestobj;
        }
        catch (ex) {
            console.log(`error: ${ex}`);
            return requestobj;
        }
    }


    let modalOptions = {

        "visible": isModalVisible,
        "width": '45%',
        "title": L(LocalizationKeys.ERP_LblAdditionalTarget.key),
        "destroyOnClose": true,
        "onCancel": closeModal,
        "footer": null,
        theme: "danger"

    }

    const commentHistoryolumns = [
        { title: L(LocalizationKeys.ERP_LblDate.key), dataIndex: 'date', sorter: true, key: 'date', width: 150, render: (text: string) => <div>{utils.formattedDate(text)}</div> },
        { title: L(LocalizationKeys.ERP_LblName.key), dataIndex: 'name', sorter: true, key: 'name', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblComments.key), dataIndex: 'comments', sorter: true, key: 'comments', width: 150, render: (text: string) => <div>{text}</div> },

    ];


    let tableOptions = {
        "rowKey": (record: any) => record.date.toString(),
        "bordered": true,
        "columns": commentHistoryolumns,
        // "pagination": { pageSize: compState.maxResultCount, total: orders === (undefined || null) ? 0 : orders.totalCount, defaultCurrent: 1 },
        // "loading": (currentModalRecord.comment === undefined ? true : false),
        "dataSource": (currentModalRecord.comment === (undefined || null) ? [] : currentModalRecord.comment),
        "onChange": currentModalRecord.comment,
        "actionsList": [],
        // "getGridData": getAllOrderDetail,
        "enableSorting": true,

    }

    let headerOptions = {
        // "createOrUpdateModalOpen": createOrUpdateModalOpen,
        "enableButton": false
    }

    let searchOptions = {
        "enableSearch": false
    }

    return (
        <>
            <div className='general-participants'>

                <Card>

                    <CustomRow>

                        <CustomCol span={20}>

                            <CustomItemSelector {...props}
                                ref={customItemSelectorRef}
                                pageTitle={pageTitle}
                                componentOptions={componentOption}
                                dataSourceColumns={columns}
                                savedSelectedItems={saveSelectedItems}
                                onUpdateRow={onUpdateRow}
                                onDeleteRow={onDeleteRow}
                            />

                        </CustomCol>

                    </CustomRow>

                </Card>
            </div>

            <CustomModal {...modalOptions}>
                <CustomForm onSubmit={saveForm} onCancel={closeModal} {...formList} >
                </CustomForm>

                {commentHistoryolumns && commentHistoryolumns.length > 0 && <CustomTable
                    options={tableOptions}
                    searchOptions={searchOptions}
                    headerOptions={headerOptions}
                />}
            </CustomModal>
        </>
    )
}

export default Participants;
