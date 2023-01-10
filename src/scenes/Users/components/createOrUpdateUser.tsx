import React, { useEffect } from 'react';

import { Checkbox, Input, Modal, Tabs, Form } from 'antd';
import { GetRoles } from '../../../services/user/dto/getRolesOuput';
import { L } from '../../../lib/abpUtility';
import rules from './createOrUpdateUser.validation';
import { FormInstance } from 'antd/lib/form';
import CustomForm from '../../../components/CustomForm';
import { useAppState, useAppStores, useCompState } from '../../../hooks/appStoreHooks';
import UserStore from '../../../stores/userStore';
import createUserForm from '../json/createUserForm.json';
import updateUserForm from '../json/updateUserForm.json';
import { CustomModal } from '../../../components/CustomControls';
import LocalizationKeys from '../../../lib/localizationKeys';
import { ContentRequestDto } from '../../../services/Content/dto/contentRequestDto';

export interface ICreateOrUpdateUserProps {
  visible?: boolean;
  onCancel: any;
  modalType?: string;
  onCreate: any;
  roles: GetRoles[];
  formRef?: React.RefObject<FormInstance>;
}

const CreateOrUpdateUser = (props: ICreateOrUpdateUserProps) => {

  const [formList, setFormList] = useCompState({});

  const { contentStore } = useAppStores();

  const [editUser] = useAppState(UserStore.AppStateKeys.EDIT_USER);

  useEffect(() => {
    populateFormFields();
  }, [editUser]);

  useEffect(() => {
    getRoles();
  }, []);


  const getRoles = async () => {

    let requestObj: ContentRequestDto = {
      ComponentIdOrName: 'GetAllPagedData',
      Parameters: [
        {
          key: "Table",
          value: "Roles"
        },
        {
          "key": "SkipCount",
          "value": 0
        },
        {
          "key": "Sorting",
          "value": "displayName ASC"
        },
        {
          "key": "MaxResultCount",
          "value": 500
        },
        {
          "key":"SelectFields",
          "value":"normalizedName,displayName"
        },
        {
          "key": "QueryFilters",
          "value": {
            "fieldName": "",
            "operator": "AND",
            "filters": [
              {
                "fieldName": "isDeleted",
                "operator": "=",
                "value": false
              },
              {
                "fieldName": "TenantId",
                "operator": "=",
                "value": 1
              }
            ]
          }
        }
      ]
    }

    let res = await contentStore.GetComponentData(requestObj);

    let roleDataItems: any = [];

    res && res.items && res.items.length > 0 && res.items.map((item: any, index: any) => {
      roleDataItems.push({ key: item.normalizedName, value: item.displayName });
    });

    let roleFieldNewForm = createUserForm.formFields.find((item: any) => item.internalName == "roleNames");
    let roleFieldUpdateForm = updateUserForm.formFields.find((item: any) => item.internalName == "roleNames");

    if (roleFieldUpdateForm) {
      roleFieldUpdateForm.dataItems = roleDataItems;
    }
    if (roleFieldNewForm) {
      roleFieldNewForm.dataItems = roleDataItems;
    }
  }

  const populateFormFields = () => {
    if (editUser != undefined && editUser.id != 0) {
      Object.keys(editUser).forEach(function (key) {
        let field = updateUserForm.formFields.find((item: any) => item.internalName == key);
        if (field)
          field.defaultValue = editUser[key];
      });
      setFormList(updateUserForm);
    }
    else {
      setFormList(createUserForm);
    }
  }

  const { visible, onCreate, onCancel } = props;

  let modalOptions = {

    "visible": visible,
    "width": '35%',
    "title": L(LocalizationKeys.ERP_LblUser.key),
    "destroyOnClose": true,
    "onCancel": onCancel,
    "footer": null,
    theme: "danger"

  }

  return <CustomModal {...modalOptions}>
    <CustomForm onSubmit={onCreate} onCancel={onCancel}  {...formList} ></CustomForm>
  </CustomModal>
}

export default CreateOrUpdateUser;
