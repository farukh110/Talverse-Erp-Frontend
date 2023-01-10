import React, { useEffect, useRef } from 'react';
import { L } from '../../../lib/abpUtility';
import { FormInstance } from 'antd/lib/form';
import { useAppStores, useCompState } from '../../../hooks/appStoreHooks';
import { CustomModal } from '../../../components/CustomControls';
import CustomItemSelector from '../../../components/CustomWebControls/CustomItemSelector/customItemSelector';
// import '../index.less';
import { ContentRequestDto, SavedRequestDto } from '../../../services/Content/dto/contentRequestDto';
import LocalizationKeys from '../../../lib/localizationKeys';
import { UpdateUserProductSettingsOutput } from '../../../services/supporters/dto/supportersDto';



export interface IManageBalanceAmounts {
  visible?: boolean;
  onCancel: () => void;
  onCreate: any;
  userId: Number;
}

const ManageProductSettings = (props: any) => {
  const customItemSelectorRef = useRef<FormInstance>();
  const { supportersStore, contentStore } = useAppStores();
  const [saveSelectedItems, setSaveSelectedItems] = useCompState([]);
  const [currencyList, setCurrencyList] = useCompState([]);


  const { visible, onCreate, onCancel, userId } = props;

  useEffect(() => {
    populateFormFields();
  }, [userId]);


  const populateFormFields = async () => {
    if (userId && userId != 0) {
      let requestObj: ContentRequestDto = {
        ComponentIdOrName: 'GetAllPagedData',
        Parameters: [
          {
            key: "Table",
            value: "UserSettings"
          }, {
            key: "SkipCount",
            value: 0
          },
          {
            key: "Sorting",
            value: "Id"
          },
          {
            key: "MaxResultCount",
            value: 500
          },
          {
            key: "SelectFields",
            value: "Id,UserId,Value"
          },
          {
            key: "QueryFilters",
            value: {
              fieldName: "UserId",
              operator: "=",
              value: userId
            }
          }


        ]
      }
      let res = await contentStore.GetComponentData(requestObj);

      if (res && res.items && res.items.length > 0) {
        let userSettingValue = res.items[0].value && res.items[0].value != "" ? JSON.parse(res.items[0].value) : null;
        if (userSettingValue && userSettingValue.ProductSettings && userSettingValue.ProductSettings.length > 0) {


          let requestObjj: ContentRequestDto = {
            ComponentIdOrName: 'GetAllPagedData',
            Parameters: [
              {
                key: "Table",
                value: "Products"
              }, {
                key: "SkipCount",
                value: 0
              },
              {
                key: "Sorting",
                value: "Id"
              },
              {
                key: "MaxResultCount",
                value: 500
              },
              {
                key: "SelectFields",
                value: "Id,Code,FK_Products.Id_ProductTranslation_CoreId_Name_ProductName"
              }
            ]
          }
          let response = await contentStore.GetComponentData(requestObjj);
          let products = response && response.items ? response.items : [];
          let tempItems = userSettingValue.ProductSettings;
          for (let i = 0; i < tempItems.length; i++) {

            let product = products.find((item: any) => item.id == tempItems[i].Id);

            saveSelectedItems.push({
              "id": tempItems[i].Id,
              "code": product.code,//tempItems[i].currencyCode,
              "productName": product.productName,//tempItems[i].currencySymbol,
              "isPartialPaymentAllowed": tempItems[i].IsPartialPaymentAllowed,
              "isDeleted": false,
              "isEditable": false
            });
          }
        }

      }
      setSaveSelectedItems([...saveSelectedItems]);
    }
  }

  const onUpdateRow = async (row: any) => {
    try {
      const formRef = customItemSelectorRef.current;
      let reqObj: UpdateUserProductSettingsOutput = {
        isPartialPaymentAllowed: formRef!.getFieldValue('customItemSelector_isPartialPaymentAllowed_' + row.id), // row.isPartialPaymentAllowed,  //  use formrefValueHere 
        productId: row.id,
        supporterUserId: userId,
      }
      let result = await supportersStore.updateUserProductSettings(reqObj);
      return result.success;
    }
    catch (ex) {
      console.log(`error: ${ex}`);
      return false;
    }
  }

  const onDeleteRow = async (row: any) => {
    try {
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
            value: userId
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
    "width": '50%',
    "title": L(LocalizationKeys.ERP_LblPartialTransferManagement.key),
    "destroyOnClose": true,
    "onCancel": onClose,
    "footer": null,
    theme: "danger"

  }

  const columns = [
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
      "internalName": "productName",
      "displayName": L(LocalizationKeys.ERP_LblName.key),
      "value": ""
    },
    {
      "mode": "Edit",
      "size": "Small",
      "validations": null,
      "type": "Checkbox",
      "defaultValue": false,
      "visible": true,
      "internalName": "isPartialPaymentAllowed",
      "displayName": L(LocalizationKeys.ERP_LblIsPartialPaymentAllowed.key),
      "value": ""
    }
  ];




  // add selected Fields support 
  let componentOption = {
    "name": "ctrlSupporter",
    "dataSource": "GetAllPagedData",
    "dataTextField": "productName",
    "dataValueField": "id",
    "parameters": [{
      key: "Table",
      value: "Products"
    }, {
      key: "SkipCount",
      value: 0
    },
    {
      key: "Sorting",
      value: "ProductName"
    },
    {
      key: "MaxResultCount",
      value: 500
    },
    {
      key: "SelectFields",
      value: "Id,Code,IsSupporterNameRequired ,FK_Products.Id_ProductTranslation_CoreId_Name_ProductName"
    }

    ],
    "placeholder": L(LocalizationKeys.ERP_Error_FieldPleaseSelectProduct.key),
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
      isDeleteActionVisible={false}
    />
  </CustomModal>



  )
}

export default ManageProductSettings;