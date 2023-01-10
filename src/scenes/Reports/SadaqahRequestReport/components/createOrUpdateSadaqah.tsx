import React, { useEffect } from 'react';
import { FormInstance } from 'antd';
import { useAppState, useAppStores, useCompState } from '../../../../hooks/appStoreHooks';
import OrdersStore from '../../../../stores/ordersStore';
import updateRemarksForm from '../json/updateRemarksForm.json';
import LocalizationKeys from '../../../../lib/localizationKeys';
import { L } from '../../../../lib/abpUtility';
import { CustomModal } from '../../../../components/CustomControls';
import CustomForm from '../../../../components/CustomForm';
import ReportsStore from '../../../../stores/reportsStore';


export interface ICreateOrUpdateSadaqahProps {
  visible?: boolean;
  onCancel: any;
  modalType?: string;
  onCreate(values: any, allFormFields?: any): any;
  formRef?: React.RefObject<FormInstance>;
  orderNumber?: any;
}

const CreateOrUpdateSadaqah = (props: ICreateOrUpdateSadaqahProps) => {

  const [formList, setFormList] = useCompState({});
  const [editOrderSadaqah] = useAppState(ReportsStore.AppStateKeys.REMARKS_ORDER);

  useEffect(() => {
    populateFormFields();
  }, [editOrderSadaqah]);

  const populateFormFields = () => {

    if (editOrderSadaqah != undefined && editOrderSadaqah.id != 0) {

      Object.keys(editOrderSadaqah).forEach(function (key) {

        let field = updateRemarksForm.formFields.find((item: any) => item.internalName == key);
        if (field) {

          field.defaultValue = editOrderSadaqah[key];
          console.log(" field.internalName ", field.internalName);
        }
      });
      setFormList(updateRemarksForm);
    }
    else {
      setFormList(updateRemarksForm);
    }
  }

  const { visible, onCreate, onCancel } = props;

  let modalOptions = {

    "visible": visible,
    "width": '40%',
    "title": L(LocalizationKeys.ERP_HdrRemarksOrder.key),
    "destroyOnClose": true,
    "onCancel": onCancel,
    "footer": null,
    theme: "danger",
  }

  return (<CustomModal {...modalOptions}>
    <CustomForm onSubmit={onCreate} onCancel={onCancel}  {...formList} ></CustomForm>
  </CustomModal>
  )
}

export default CreateOrUpdateSadaqah;