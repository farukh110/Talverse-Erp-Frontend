import React, { useEffect, useRef } from 'react';
import { Card, Input, Modal, Tooltip } from 'antd';

import { EntityDto } from '../../services/dto/entityDto';
import { isGranted, L } from '../../lib/abpUtility';
import { useAppState, useAppStores, useCompState } from '../../hooks/appStoreHooks';
import { FormInstance } from 'antd/lib/form';
import OrdersStore from '../../stores/ordersStore';
import { CustomTable } from '../../components/CustomGrid';

import { CustomButton } from '../../components/CustomControls';
import utils from '../../utils/utils';
import CreateOrUpdateOrder from './components/createOrUpdateOrder';

import createOrderForm from './json/createOrderForm.json';
import updateOrderForm from './json/updateOrderForm.json';
import formUtils from '../../utils/formUtils';
import './index.less';
import { InsertOrderInput, UpdateDonationInput, UpdateOrderInput } from '../../services/orders/dto/ordersDto';
import ViewOrder from './components/viewOrder';
import { ContentRequestDto, SavedRequestDto } from '../../services/Content/dto/contentRequestDto';
import AppConsts from '../../lib/appconst';
import InvoiceGenerator from './components/invoiceGenerator';
import LocalizationKeys from '../../lib/localizationKeys';
import CustomAdvanceFilter from '../../components/CustomWebControls/CustomAdvanceFilter/customAdvanceFilter';
import orderAdvanceFilterForm from './json/orderAdvanceFilterForm.json';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { CommentOutlined } from '@ant-design/icons';

export interface IOrderState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  orderId: number;
  filter: string;
  sorting: string
  showInvoiceModal: boolean;
}

const confirm = Modal.confirm;
const Search = Input.Search;

const Orders = (props: any) => {

  const formRef = useRef<FormInstance>(null);

  const initialState: IOrderState = {
    modalVisible: false,
    maxResultCount: 100,
    skipCount: 0,
    orderId: 0,
    filter: '',
    sorting: 'OrderId DESC',
    showInvoiceModal: false,
  };

  const { ordersStore, userStore, programCategoryStore } = useAppStores();
  const [compState, setCompState] = useCompState(initialState);
  const [orders] = useAppState(OrdersStore.AppStateKeys.ORDERS, {});
  const [editOrder, setEditOrder] = useAppState(OrdersStore.AppStateKeys.EDIT_ORDER, {});
  const COMMENT_FIELD_NAME = "comments";

  useEffect(() => {
    getAllOrderDetail();
    getAllSupporters();
    //getAllUsers();
    // getAllprogramsCategory();
  }, [compState.filter]);

  useEffect(() => {
    getAllOrderDetail();
  }, [compState.filter]);

  const getAllOrderDetail = async () => {
    let params = [{
      key: "SkipCount",
      value: compState.skipCount
    },
    {
      key: "Sorting",
      value: compState.sorting
    },
    {
      key: "MaxResultCount",
      value: compState.maxResultCount
    }];
    if (compState.filter) {
      params.push({
        "key": "QueryFilters",
        "value": compState.filter
      });
    }
    let requestObj: ContentRequestDto = {
      ComponentIdOrName: 'OrderList',
      Parameters: params
    }
    let res = await ordersStore.GetComponentData(requestObj, 'GetAll');

  }

  // get all supporters

  const getAllSupporters = async () => {
    let requestObj: ContentRequestDto = {
      ComponentIdOrName: 'GetAllSupportersIncludingMe'
    }
    const supportersList = await ordersStore.GetComponentData(requestObj, '');


    //loop through fields
    let dataItems: any = [];
    if (supportersList) {
      supportersList.items.map((supporterItem: any) => {
        dataItems.push({ key: supporterItem.id, value: supporterItem.name, countryCode: supporterItem.countryCode });
      });

      //get supporter id field to update dataitems
      createOrderForm.formFields = formUtils.setFieldDataItems(createOrderForm, "supporterId", dataItems);
      updateOrderForm.formFields = formUtils.setFieldDataItems(updateOrderForm, "supporterId", dataItems);
    }
  }

  // get all users

  const getAllUsers = async () => {

    const usersList = await userStore.getAll({
      maxResultCount: compState.maxResultCount,
      skipCount: compState.skipCount,
      keyword: compState.filter,
      sorting: compState.sorting,
    })

    //loop through fields
    let dataItems: any = [];
    if (usersList) {
      usersList.items.map((userItem: any) => {
        dataItems.push({ key: userItem.id, value: userItem.name });
      });

      //get supporter id field to update dataitems
      createOrderForm.formFields = formUtils.setFieldDataItems(createOrderForm, "userId", dataItems);
      updateOrderForm.formFields = formUtils.setFieldDataItems(updateOrderForm, "userId", dataItems);

    }

  }

  // get all programs category

  const getAllprogramsCategory = async () => {
    const programsCategoryList = await programCategoryStore.getAllProgramCategory({
      maxResultCount: 500,//compState.maxResultCount,
      skipCount: 0, // compState.skipCount,
      keyword: compState.filter,
      sorting: '',// compState.sorting,
    })
    //loop through fields
    let dataItems: any = [];
    if (programsCategoryList) {
      programsCategoryList.items.map((programsCategoryItem: any) => {
        dataItems.push({ key: programsCategoryItem.id, value: programsCategoryItem.name });
      });
      //get programs category id field to update dataitems
      createOrderForm.formFields = formUtils.setFieldDataItems(createOrderForm, "programCategoryId", dataItems);
      updateOrderForm.formFields = formUtils.setFieldDataItems(updateOrderForm, "programCategoryId", dataItems);
    }

  }

  const getAllCSVData = async () => {
    let params = [{
      key: "SkipCount",
      value: 0
    },
    {
      key: "Sorting",
      value: 'OrderId DESC'
    },
    {
      key: "MaxResultCount",
      value: 5000
    }];
    if (compState.filter) {
      params.push({
        "key": "QueryFilters",
        "value": compState.filter
      });
    }

    let requestObj: ContentRequestDto = {
      ComponentIdOrName: 'OrderList',
      Parameters: params
    }
    let resp = await ordersStore.GetComponentData(requestObj, '');

    return resp ? resp.items : [];
  }

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {

    compState.maxResultCount = pagination.pageSize;
    compState.skipCount = (pagination.current - 1) * compState.maxResultCount!
    compState.sorting = sorter && sorter.field ? sorter.field + " " + (sorter.order == "descend" ? "DESC" : "ASC") : 'OrderId DESC';

    setCompState(compState);
    getAllOrderDetail();
  };

  const displayModal = (isVisible: boolean, modelType?: string) => {
    if (modelType) {
      if (modelType == "Manage") {
        compState.modalVisible = isVisible;
      }
      else if (modelType == "View") {
        compState.viewModalVisible = isVisible;
      }
    }
    else {
      compState.modalVisible = compState.viewModalVisible = isVisible;
    }
    setCompState({ ...compState });
  };

  const createOrUpdateModalOpen = async (item: any, actionName?: any) => {

    compState.orderNumber = item?.orderNumber;
    let entityDto: EntityDto = { id: item?.orderId || 0 };
    if (entityDto.id === (0 || undefined)) {
      await ordersStore.createOrders();
    } else if (entityDto.id > 0 && actionName == L(AppConsts.actionNames.EDIT)) {
      //await ordersStore.get(entityDto);
      let requestObj: ContentRequestDto = {
        ComponentIdOrName: 'OrderEdit',
        Parameters: [{
          key: 'orderId',
          value: entityDto.id
        }]
      }
      await ordersStore.GetComponent(requestObj, L(AppConsts.actionNames.EDIT));
    }
    else if (entityDto.id > 0 && actionName == L(AppConsts.actionNames.DETAIL_VIEW)) {
      // make parameters 
      // then call
      let requestObj: ContentRequestDto = {
        ComponentIdOrName: 'OrderView',
        Parameters: [{
          key: 'orderId',
          value: entityDto.id
        }]
      }
      await ordersStore.GetComponent(requestObj, L(AppConsts.actionNames.DETAIL_VIEW));
    }
    compState.orderId = entityDto.id || 0;
    if (compState.orderId == 0) {
      //reset app store for edit order
      setEditOrder({});
    }
    //setCompState({ ...compState });
    displayModal(true, compState.orderId == 0 || actionName == L(AppConsts.actionNames.EDIT) ? "Manage" : "View");
    // setTimeout(() => {
    //   // formRef.current!.setFieldsValue({ ...campaignsStore.editUser });
    // }, 100);
  }


  const deleteOrder = (item: any) => {
    let input: EntityDto = { id: item.orderId };
    confirm({
      title: L(LocalizationKeys.ERP_MsgConfirmDeleteRecord.key),
      async onOk() {
        let requestObj: SavedRequestDto = {
          tableName: "Orders",
          Parameters: [{
            key: "Id",
            value: input.id
          },
          {
            key: "IsDeleted",
            value: 1
          }
          ]
        }

        await ordersStore.delete(input, requestObj);
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }

  const handleCreate = async (values: any, allFormFields: any) => {

    if (allFormFields) {
      Object.keys(values).forEach(function (key) {
        let tempKey = key;
        if (key.startsWith("ddl-"))
          tempKey = key.split("ddl-")[1];
        let field = allFormFields.find((item: any) => item.internalName == tempKey);
        if (field) {
          if (field.type == 'DatePicker') {
            let temp = utils.formattedDate(values[key], 'yyyy-MM-DD');
            field.value = temp;
          } else {
            field.value = values[key];
          }
        }
      });
    }
    if (compState.orderId === 0) {
      let dtoObj: InsertOrderInput = {
        campaignId: values.campaignId,
        formId: values.formId,
        productFormDetails: {
          formFields: allFormFields,
          id: values.formId,
          productFormDescription: ""
        },
        supporter: {
          id: values.donorId,
          name: values.donorName,//form[4].dataItems.find((item:any) => item.key ==values.supporterId  ).value,
          contactNumber: values.donorContact && isValidPhoneNumber(values.donorContact) ? values.donorContact : null,
          countryId:values.countryId
        },
        PlacedBy: {
          id: values.supporterId
        },
        OrderDate: new Date(values.orderDate),
        nameOnReceipt: values.nameOnReceipt
      };
      await ordersStore.createNewOrder(dtoObj);
    } else {
      let obj: UpdateDonationInput = {
        orderId: compState.orderId,
        productFormDetails: {
          id: values.formId,
          // name?:string
          // description?:string,
          formFields: allFormFields,
          //isSupporterNameRequired?:Boolean
        },
        supporter: {
          id: values.donorId,
          name: values.donorName,
          contactNumber: values.donorContact && isValidPhoneNumber(values.donorContact) ? values.donorContact : null,
          countryId:values.countryId
        },
        orderDate: new Date(values.orderDate),
        nameOnReceipt: values.nameOnReceipt
      }
      await ordersStore.updateOrderDonation(obj);

    }
    await getAllOrderDetail();
    displayModal(false);
  };

  const handleSearch = (value: string) => {
    compState.skipCount = 0;
    compState.filter = value;
    setCompState({ ...compState });
  };

  const invoiceGeneratorModalOpen = async (item: any, actionName?: any) => {
    compState.showInvoiceModal = true;
    compState.itemValues = item
    setCompState({ ...compState });
  }


  const columns = [
    { title: L(LocalizationKeys.ERP_LblOrderNumber.key), dataIndex: 'orderNumber', sorter: true, key: 'orderNumber', width: 150, render: (text: string, row: any) => <div> {text} {row[COMMENT_FIELD_NAME] && <Tooltip placement="top" title={row[COMMENT_FIELD_NAME]}> <CommentOutlined className='comment-icon' /> </Tooltip>} </div> },
    { title: L(LocalizationKeys.ERP_LblDate.key), dataIndex: 'orderDate', sorter: true, key: 'orderDate', width: 150, render: (text: string) => <div>{utils.formattedDate(text)}</div> },
    { title: L(LocalizationKeys.ERP_LblProduct.key), dataIndex: 'product', sorter: true, key: 'product', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblCategory.key), dataIndex: 'category', sorter: true, key: 'category', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblCampaign.key), dataIndex: 'campaign', sorter: true, key: 'campaign', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblDonorName.key), dataIndex: 'placedFor', sorter: true, key: 'placedFor', width: 150, render: (text: string) => <div> {text}  </div> },
    { title: L(LocalizationKeys.ERP_LblRepName.key), dataIndex: 'placedBy', sorter: true, key: 'placedBy', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblQuantity.key), dataIndex: 'quantity', sorter: true, key: 'quantity', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblCurrency.key), dataIndex: 'symbol', sorter: true, key: 'symbol', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblAmount.key), dataIndex: 'amount', sorter: true, key: 'amount', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblComments.key), dataIndex: 'comments', sorter: true, key: 'comments', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblCreatedOn.key), dataIndex: 'creationTime', sorter: true, key: 'creationTime', width: 150, render: (text: string) => <div> {utils.formattedDateAndTime(text)} </div> },
    { title: L(LocalizationKeys.ERP_LblCreatorUserId.key), dataIndex: 'creatorUser', sorter: true, key: 'creatorUser', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblLastModificationTime.key), dataIndex: 'lastModificationTime', sorter: true, key: 'lastModificationTime', width: 150, render: (text: string) => <div>{utils.formattedDateAndTime(text)}</div> },
    { title: L(LocalizationKeys.ERP_LblLastModifierUserId.key), dataIndex: 'lastModifierUser', sorter: true, key: 'lastModifierUser', width: 150, render: (text: string) => <div>{text}</div> },
  ];

  let csvOptions = {
    "getCSVData": getAllCSVData,
    "headers": [

      { label: L(LocalizationKeys.ERP_LblId.key), key: "orderId" },
      { label: L(LocalizationKeys.ERP_LblOrderNumber.key), key: "orderNumber" },
      { label: L(LocalizationKeys.ERP_LblOrderDate.key), key: "orderDate" },
      { label: L(LocalizationKeys.ERP_LblProductName.key), key: "product" },
      { label: L(LocalizationKeys.ERP_LblCategory.key), key: "category" },
      { label: L(LocalizationKeys.ERP_LblCampaignName.key), key: "campaign" },
      { label: L(LocalizationKeys.ERP_LblDonorName.key), key: "placedFor" },
      { label: L(LocalizationKeys.ERP_LblRepName.key), key: "placedBy" },
      { label: L(LocalizationKeys.ERP_LblQuantity.key), key: "quantity" },
      { label: L(LocalizationKeys.ERP_LblCurrency.key), key: "symbol" },
      { label: L(LocalizationKeys.ERP_LblAmount.key), key: "amount" },
      { label: L(LocalizationKeys.ERP_LblComments.key), key: "comments" },
      { label: L(LocalizationKeys.ERP_LblCreatedOn.key), key: "creationTime" },
      { label: L(LocalizationKeys.ERP_LblCreatorUserId.key), key: "creatorUser" },
      { label: L(LocalizationKeys.ERP_LblLastModificationTime.key), key: "lastModificationTime" },
      { label: L(LocalizationKeys.ERP_LblLastModifierUserId.key), key: "lastModifierUser" }],
    "fileName": "allOrdersList.csv",
    "enableExport": true
  }

  let tableOptions = {
    "rowKey": (record: any) => record.orderId.toString(),
    "bordered": true,
    "columns": columns,
    "pagination": { pageSize: compState.maxResultCount, total: orders === (undefined || null) ? 0 : orders.totalCount, defaultCurrent: 1 },
    "loading": (orders === undefined ? true : false),
    "dataSource": (orders === (undefined || null) ? [] : orders.items),
    "onChange": handleTableChange,
    "actionsList": [{
      "actionName": L(AppConsts.actionNames.DETAIL_VIEW),
      "actionCallback": createOrUpdateModalOpen,
      "appearance": CustomButton.appearances.Detail,
      "isVisible": (record: any) => {
        return (isGranted(AppConsts.permissionNames.Order_View))
      }
    },
    {
      "actionName": L(AppConsts.actionNames.EDIT),
      "actionCallback": createOrUpdateModalOpen,
      "appearance": CustomButton.appearances.Edit,
      "isVisible": (record: any) => {
        return (isGranted(AppConsts.permissionNames.Order_Edit))
      }
    },
    {
      "actionName": L(AppConsts.actionNames.INVOICE_GENERATOR),
      "actionCallback": invoiceGeneratorModalOpen,
      "appearance": CustomButton.appearances.Invoice,
      "isVisible": (record: any) => {
        return (isGranted(AppConsts.permissionNames.Order_GenerateInvoice))
      },
    },
    {
      "actionName": L(AppConsts.actionNames.DELETE),
      "actionCallback": deleteOrder,
      "appearance": CustomButton.appearances.Delete,
      "isVisible": (record: any) => {
        return (isGranted(AppConsts.permissionNames.Order_Delete))
      },
    }
    ],
    "getGridData": getAllOrderDetail,
    "enableSorting": true,

  }

  let headerOptions = {
    "createOrUpdateModalOpen": createOrUpdateModalOpen,
    "enableButton": isGranted(AppConsts.permissionNames.Order_Add)
  }

  let searchOptions = {
    "onSearch": handleSearch,
    "placeholder": L(LocalizationKeys.ERP_LblFilter.key),
    "enableSearch": false,
    "advanceFilterFields": orderAdvanceFilterForm,
    "enableAdvanceSearch": true
  }
  const getRowCss = (row: any) => {
    return row[COMMENT_FIELD_NAME] ? 'high-lighted-row' : 'data-row';
  }
  return (
    <>
      <Card className="order-container card-grid">

        <CustomTable
          options={tableOptions}
          searchOptions={searchOptions}
          csvOptions={csvOptions}
          headerOptions={headerOptions}
          getTableRowCSS={getRowCss}
        />

        <CreateOrUpdateOrder
          visible={compState.modalVisible}
          onCancel={() => {
            displayModal(false);
          }}
          modalType={compState.orderId === 0 ? 'create' : 'edit'}
          onCreate={handleCreate}
          orderNumber={compState.orderNumber}
        />

        <ViewOrder
          visible={compState.viewModalVisible}
          onCancel={() => {
            displayModal(false);
          }}
          orderNumber={compState.orderNumber}
        />


        <InvoiceGenerator
          visible={compState.showInvoiceModal}
          onCancel={() => {
            compState.showInvoiceModal = false;
            // compState.itemValues = null;
            setCompState({ ...compState });
          }}
          itemValues={compState.itemValues}
        />


      </Card>
    </>
  )
}

export default Orders;