import React, { useEffect, useRef } from 'react';

import { GetRoles } from '../../../services/user/dto/getRolesOuput';
import { L } from '../../../lib/abpUtility';
import { FormInstance } from 'antd/lib/form';
import { useAppState, useAppStores, useCompState } from '../../../hooks/appStoreHooks';
import { CustomButton, CustomCol, CustomModal } from '../../../components/CustomControls';
import CustomItemSelector from '../../../components/CustomWebControls/CustomItemSelector/customItemSelector';

import '../index.less';
import { ContentRequestDto } from '../../../services/Content/dto/contentRequestDto';
import { AuthorizeCampaignRequestDto } from '../../../services/campaigns/dto/updateCampaignOutput';
import CustomMultipleItemSelector from '../../../components/CustomWebControls/CustomPermissionManager';
import LocalizationKeys from '../../../lib/localizationKeys';

const ManageParticipants = (props: any) => {

  const customItemSelectorRef = useRef<FormInstance>();
  const customMultiItemSelectorRef = useRef<FormInstance>();
  const [formList, setFormList] = useCompState({});
  const { campaignsStore } = useAppStores();

  const [saveSelectedItems, setSaveSelectedItems] = useCompState([]);

  const { visible, onCreate, onCancel, campaignId } = props;

  useEffect(() => {
    populateFormFields();
  }, [campaignId]);


  const populateFormFields = async () => {

    if (campaignId && campaignId > 0) {
      let requestObj: ContentRequestDto = {
        ComponentIdOrName: 'GetUserSettingsByCampaignIdBasedOnPermission',
        Parameters: [
          {
            key: "CampaignId",
            value: campaignId
          }]
      }
      let res = await campaignsStore.getComponentData(requestObj);
      if (res) {
        let tempItems = res.items;
        for (let i = 0; i < res.items.length; i++) {
          saveSelectedItems.push({
            "id": tempItems[i].id,
            "name": tempItems[i].supporterName,
            "userId": tempItems[i].userId,
            "myTarget": tempItems[i].value.find((elem: any) => elem.id == campaignId)?.myTarget,
            "additionalTarget": tempItems[i].value.find((elem: any) => elem.id == campaignId)?.additionalTargets ? tempItems[i].value.find((elem: any) => elem.id == campaignId)?.additionalTargets : 0,
            "supporterId": tempItems[i].supporterId,
            // "comment":JSON.stringify( tempItems[i].value.find((elem: any) => elem.id == campaignId)?.commentsHistory )  ,
            "isDeleted": false,
            "isEditable": false
          });
        }
      }
      setSaveSelectedItems([...saveSelectedItems]);
    }
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
      requestobj.additionalTarget = formRef!.getFieldValue('customItemSelector_additionalTarget_' + row.id);
      requestobj.supporterTarget = formRef!.getFieldValue('customItemSelector_myTarget_' + row.id);
      requestobj.supporterUserId = row.userId;
      requestobj.comments = formRef!.getFieldValue('customItemSelector_comment_' + row.id);

      return requestobj;
    }
    catch (ex) {
      console.log(`error: ${ex}`);
      return requestobj;
    }
  }



  const onClose = () => {
    setSaveSelectedItems([...[]]);
    onCancel();
  }
  const saveSelectedItemsOld = [{
    "id": 7,
    "name": "Test Rep",
    "contactNumber": "123456786",
    "countryId": 1,
    "dateOfBirth": "2021-11-04T06:47:50.22",
    "userId": 2,
    "supporterTypeId": 2,
    "myTarget": 200,
    "additionalTarget": 110,
    "supporterId": 1007,
    "creationTime": "2021-11-04T06:47:50.22",
    "isDeleted": false
  }]

  const onSubmit = () => {

    customItemSelectorRef.current!.validateFields().then(async (values: any) => {
    })
  }
  let modalOptions = {

    "visible": visible,
    "width": '60%',
    "title": L(LocalizationKeys.ERP_LblIsCampaignParticipants.key),
    "destroyOnClose": true,
    "onCancel": onClose,
    "footer": null,
    "onOk": onSubmit,
    "okText": L(LocalizationKeys.ERP_LblSave.key),
    theme: "danger"

  }
  const columns = [{
    "mode": "Display",
    "size": "Small",
    "validations": null,
    "type": "Textbox",
    "defaultValue": "",
    "visible": true,
    "internalName": "supporterId",
    "displayName": "Id",
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
    "displayName": LocalizationKeys.ERP_LblName.key,
    "value": ""
  },
  {
    "mode": "Edit",
    "size": "Small",
    "validations": null,
    "type": "Number",
    "defaultValue": "",
    "visible": true,
    "internalName": "myTarget",
    "displayName": LocalizationKeys.ERP_LblMyTarget.key,
    "value": ""
  },
  {
    "mode": "Edit",
    "size": "Small",
    "validations": null,
    "type": "Number",
    "defaultValue": "",
    "visible": true,
    "internalName": "additionalTarget",
    "displayName": LocalizationKeys.ERP_LblAdditionalTarget.key,
    "value": ""
  },
  {
    "mode": "Edit",
    "size": "Small",
    "validations": null,
    "type": "Text",
    "defaultValue": "",
    "visible": true,
    "internalName": "comment",
    "displayName": LocalizationKeys.ERP_LblComment.key,
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
    "placeholder": "Please select supporter",
    "heading": L(LocalizationKeys.ERP_LblSupporter.key)
  }

  const onSubmitClick = () => {
    try {
      customMultiItemSelectorRef.current!.validateFields().then(async (values: any) => {
        campaignsStore.updateMultiplePermissions({
          permissions: values.ctrlCustomPermissionSelectorDropdown ? values.ctrlCustomPermissionSelectorDropdown : [],
          roles: values.ctrlCustomRolesSelectorDropdown ? values.ctrlCustomRolesSelectorDropdown : [],
          users: values.ctrlCustomUserSelectorDropdown ? values.ctrlCustomUserSelectorDropdown : []
        });


      })

    } catch (ex) {
      
      console.log(`error: ${ex}`);

    }
  }
  return (<CustomModal className='participants-modal' {...modalOptions}>

    <CustomItemSelector {...props}
      ref={customItemSelectorRef}
      componentOptions={componentOption}
      dataSourceColumns={columns}
      savedSelectedItems={saveSelectedItems}
      onUpdateRow={onUpdateRow}
      onDeleteRow={onDeleteRow}
    >

    </CustomItemSelector>


    {/* Currently Commented to avoid feature confusion as feature is incomplete  */}
    {/* <br></br>


    <CustomMultipleItemSelector {...props}
      ref={customMultiItemSelectorRef}
      permissionSelectedItems={["C5", "C6"]}
      rolesSelectedItems={[]}
      userSelectedItems={['2', '3']}
      permissionsSelectorMode='ReadOnly'
      rolesSelectorMode='Edit'
      userSelectorMode='Edit'

    >

    </CustomMultipleItemSelector>


    <CustomButton appearance={CustomButton.appearances.Save} onClick={onSubmitClick} > Save </CustomButton> */}



  </CustomModal>
  )
}

export default ManageParticipants;