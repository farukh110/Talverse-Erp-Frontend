import React, { useEffect, useRef } from 'react';
import { L } from '../../../lib/abpUtility';
import { FormInstance } from 'antd/lib/form';
import { useAppStores, useCompState } from '../../../hooks/appStoreHooks';
import { CustomModal } from '../../../components/CustomControls';
import CustomItemSelector from '../../../components/CustomWebControls/CustomItemSelector/customItemSelector';
import '../index.less';
import { ContentRequestDto, SavedRequestDto } from '../../../services/Content/dto/contentRequestDto';
import LocalizationKeys from '../../../lib/localizationKeys';


export interface IManageBalanceAmounts {
  visible?: boolean;
  onCancel: () => void;
  onCreate: any;
  transferPointId: Number;
  transferPointName: string;

}

const ManageBalanceAmounts = (props: IManageBalanceAmounts) => {

  const customItemSelectorRef = useRef<FormInstance>();
  const { campaignsStore, contentStore } = useAppStores();
  const [saveSelectedItems, setSaveSelectedItems] = useCompState([]);
  const [currencyList, setCurrencyList] = useCompState([]);


  const { visible, onCreate, onCancel, transferPointId, transferPointName } = props;

  useEffect(() => {
    populateFormFields();
  }, [transferPointId]);


  const populateFormFields = async () => {
    let requestObj: ContentRequestDto = {
      ComponentIdOrName: 'GetTransferPointBalanceAmounts',
      Parameters: [
        {
          key: "TransferPointId",
          value: transferPointId
        }]
    }
    let res = await campaignsStore.getComponentData(requestObj);

    setCurrencyList(res ? res.currencyList : []);

    if (res && res.balanceAmount) {
      let tempItems = res.balanceAmount;
      for (let i = 0; i < tempItems.length; i++) {
        saveSelectedItems.push({
          "id": tempItems[i].currencyId,
          "code": tempItems[i].currencyCode,
          "symbol": tempItems[i].currencySymbol,
          "amount": tempItems[i].amount,
          "name": res.currencyList.find((cur: any) => cur.coreId == tempItems[i].currencyId)?.name,
          "isDeleted": false,
          "isEditable": false
        });
      }
    }
    setSaveSelectedItems([...saveSelectedItems]);
  }

  const onUpdateRow = async (row: any) => {
    try {
      return true;
    }
    catch (ex) {
      console.log(`error: ${ex}`);
      return false;
    }
  }

  const onDeleteRow = async (row: any) => {
    try {
      let values = customItemSelectorRef.current!.getFieldsValue(true);
      delete values[`customItemSelector_amount_${row.id}`];
      customItemSelectorRef!.current!.setFieldsValue(values);
      return true;
    }
    catch (ex) {
      console.log(`error: ${ex}`);
      return false;
    }

  }

  const onClose = () => {
    setSaveSelectedItems([...[]]);
    onCancel();
  }


  const onSubmit = () => {

    customItemSelectorRef.current!.validateFields().then(async (values: any) => {
      let balanceAmount: any = [];
      Object.keys(values).forEach(function (key) {
        if (key.startsWith('customItemSelector_amount_')) {
          let splitedKey = key.split('_');
          console.log(splitedKey, 'SPLITTED KEY');
          if (splitedKey.length === 3) {
            let code = currencyList.find((item: any) => item.coreId == splitedKey[2])?.code;
            let obj = {
              CurrencyId: splitedKey[2],
              CurrencyCode: code,
              CurrencySymbol: code,
              Amount: values[key]
            }
            balanceAmount.push(obj);

          }
        }
      });

      let requestObj: SavedRequestDto = {
        tableName: "TransferPoints",
        Parameters: [
          {
            key: "Id",
            value: transferPointId
          },
          {
            key: "BalanceAmounts",
            value: JSON.stringify(balanceAmount)
          }
        ]
      }
      await contentStore.createNewComponent(requestObj);
      onClose();



    })
  }

  let modalOptions = {

    "visible": visible,
    "width": '60%',
    "title": `${L(LocalizationKeys.ERP_HdrManageBalanceAmount.key)} : ${transferPointName}  `,
    "destroyOnClose": true,
    "onCancel": onClose,
    //"footer": null,
    "onOk": onSubmit,
    "okText": L(LocalizationKeys.ERP_LblSave.key),
    theme: "danger"

  }

  const columns = [
    //   {
    //   "mode": "Display",
    //   "size": "Small",
    //   "validations": null,
    //   "type": "Text",
    //   "defaultValue": "",
    //   "visible": false,
    //   "internalName": "id",
    //   "displayName": "Id",
    //   "value": ""
    // },
    {
      "mode": "Display",
      "size": "Small",
      "validations": null,
      "type": "Text",
      "defaultValue": "",
      "visible": true,
      "internalName": "code",
      "displayName": L(LocalizationKeys.ERP_LblCode.key),
      "value": ""
    },
    {
      "mode": "Display",
      "size": "Small",
      "validations": null,
      "type": "Text",
      "defaultValue": "",
      "visible": true,
      "internalName": "name",
      "displayName": L(LocalizationKeys.ERP_LblName.key),
      "value": ""
    },
    {
      "mode": "Edit",
      "size": "Small",
      "validations": null,
      "type": "Number",
      "defaultValue": "",
      "visible": true,
      "internalName": "amount",
      "displayName": L(LocalizationKeys.ERP_LblAmount.key),
      "value": ""
    }
  ];




  let componentOption = {
    "name": "ctrlSupporter",
    "dataSource": "GetCurrenciesList",
    "dataTextField": "displayName",
    "dataValueField": "id",
    "parameters": [
    ],
    "placeholder": L(LocalizationKeys.ERP_Error_FieldPleaseSelectCurrency.key),
    "heading": L(LocalizationKeys.ERP_LblSupporter.key),
    pageTitle: ''
  }



  return (<CustomModal className='participants-modal' {...modalOptions}>
    <CustomItemSelector {...props}
      ref={customItemSelectorRef}
      pageTitle={""}
      componentOptions={componentOption}
      dataSourceColumns={columns}
      savedSelectedItems={saveSelectedItems}
      onUpdateRow={onUpdateRow}
      onDeleteRow={onDeleteRow}
    />
  </CustomModal>
  )
}

export default ManageBalanceAmounts;