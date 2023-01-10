import React, { useEffect } from 'react';
import { GetRoles } from '../../../services/user/dto/getRolesOuput';
import { L } from '../../../lib/abpUtility';
import { FormInstance } from 'antd/lib/form';
import CustomForm from '../../../components/CustomForm';
import { useAppState, useAppStores, useCompState } from '../../../hooks/appStoreHooks';
import createCampaignForm from '../json/createCampaignForm.json';
import updateCampaignForm from '../json/updateCampaignForm.json';
import CampaignsStore from '../../../stores/campaignsStore';
import { CustomCol, CustomModal } from '../../../components/CustomControls';
import LocalizationKeys from '../../../lib/localizationKeys';

export interface ICreateOrUpdateCampaignProps {
  visible?: boolean;
  onCancel: any;
  modalType?: string;
  onCreate: any;
  roles?: GetRoles[];
  formRef?: React.RefObject<FormInstance>;
  formMode?:string;
}

const CreateOrUpdateCampaign = (props: ICreateOrUpdateCampaignProps) => {

  const [formList, setFormList] = useCompState({})
  const [editCampaign] = useAppState(CampaignsStore.AppStateKeys.EDIT_CAMPAIGN)
  useEffect(() => {
    populateFormFields();
  }, [editCampaign]);

  const populateFormFields = async () => {
    if (editCampaign != undefined && editCampaign.id != 0) {
      Object.keys(editCampaign).forEach(function (key) {
        let field = updateCampaignForm.formFields.find((item: any) => item.internalName == key);
        if (field) {
          if (field.internalName == 'additionalInfo') {
            field.defaultValue = editCampaign[key] ?  JSON.stringify(editCampaign[key]) : '';
          } else {
            field.defaultValue = editCampaign[key];
          }
        }
      });
      setFormList(updateCampaignForm);
    }
    else {
      setFormList(createCampaignForm);
    }
  }

  const { visible, onCreate, onCancel,formMode } = props;

  let modalOptions = {

    "visible": visible,
    "width": '45%',
    "title": L(LocalizationKeys.ERP_LblCampaign.key),
    "destroyOnClose": true,
    "onCancel": onCancel,
    "footer": null,
    theme: "danger"

  }

  return (<CustomModal {...modalOptions}>
    <CustomForm onSubmit={onCreate} onCancel={onCancel} formMode={formMode} {...formList} >
    </CustomForm>

  </CustomModal>
  )
}

export default CreateOrUpdateCampaign;