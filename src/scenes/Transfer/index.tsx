import React, { useEffect, useRef } from 'react';
import { Button, Card, Col, Input, Modal, Row, Tag, message } from 'antd';


import { EntityDto } from '../../services/dto/entityDto';
import { isGranted, L } from '../../lib/abpUtility';
import { useAppState, useAppStores, useCompState } from '../../hooks/appStoreHooks';
import { FormInstance } from 'antd/lib/form';
import { CustomTable } from '../../components/CustomGrid';
import { CustomButton } from '../../components/CustomControls';
import TransferStore from '../../stores/transferStore';
import CreateOrUpdateTransfer from './components/createOrUpdateTransfer';
import { ContentRequestDto } from '../../services/Content/dto/contentRequestDto';
import utils from '../../utils/utils';
import View from './components/view';
import AppConsts from '../../lib/appconst';
import LocalizationKeys from '../../lib/localizationKeys';
import CustomAdvanceFilter from '../../components/CustomWebControls/CustomAdvanceFilter/customAdvanceFilter';

import transferAdvanceFilterForm from './json/transferAdvanceFilterForm.json';

export interface ITransferState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  transferId: number;
  filter: string;
  sorting: string
}

const confirm = Modal.confirm;
const Search = Input.Search;

const Transfer = (props: any) => {

  const formRef = useRef<FormInstance>(null);

  const initialState: ITransferState = {
    modalVisible: false,
    maxResultCount: 100,
    skipCount: 0,
    transferId: 0,
    filter: '',
    sorting: 'Id DESC'
  };

  const { transferStore } = useAppStores();
  const [compState, setCompState] = useCompState(initialState);
  const [transfer] = useAppState(TransferStore.AppStateKeys.TRANSFER, {});

  useEffect(() => {
    getAllTransfer();
  }, [compState.filter]);


  const getAllTransfer = async () => {

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
      ComponentIdOrName: 'TransferList',
      Parameters: params
    }

    await transferStore.GetComponentData(requestObj, 'GetAll');

  }

  const getAllCSVData = async () => {

    let requestObj: ContentRequestDto = {
      ComponentIdOrName: 'TransferList',
      Parameters: [{
        key: "SkipCount",
        value: 0
      },
      {
        key: "Sorting",
        value: 'Id DESC'
      },
      {
        key: "MaxResultCount",
        value: 5000
      }]
    }


    if (compState.filter) {
      requestObj!.Parameters!.push({
        "key": "QueryFilters",
        "value": compState.filter
      });
    }
    
    let resp = await transferStore.GetComponentData(requestObj, '');

    let items = resp ? resp.items : [];

    if (items.length > 0) {
      for (let i = 0; i < items.length; i++) {

        items[i].transferDetails = utils.splitObjectItemsByPipe(items[i].transferDetails);
      }
    }

    return items;

  }

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    compState.maxResultCount = pagination.pageSize;
    compState.skipCount = (pagination.current - 1) * compState.maxResultCount!
    compState.sorting = sorter && sorter.field ? sorter.field + " " + (sorter.order == "descend" ? "DESC" : "ASC") : 'Id DESC';
    setCompState(compState);
    getAllTransfer();
  };


  const isEditEnable = (record: any) => {
    return record.code == AppConsts.transferStatuses.PENDING_ACK_CODE ? true : false
  }
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


    let entityDto: EntityDto = { id: item.id };
    if (entityDto.id === 0) {
      await transferStore.createTransfer();
    } else if (entityDto.id > 0 && actionName == L(AppConsts.actionNames.EDIT)) {

      let requestObj: ContentRequestDto = {
        ComponentIdOrName: 'TransferEdit',
        Parameters: [{
          key: 'TransferId',
          value: entityDto.id
        }]
      }
      await transferStore.GetComponentData(requestObj, L(AppConsts.actionNames.EDIT));
    }
    else if (entityDto.id > 0 && actionName == L(AppConsts.actionNames.DETAIL_VIEW)) {
      // make parameters 
      // then call
      let requestObj: ContentRequestDto = {
        ComponentIdOrName: 'TransferView',
        Parameters: [{
          key: 'TransferId',
          value: entityDto.id
        }]
      }
      await transferStore.GetComponentData(requestObj, L(AppConsts.actionNames.DETAIL_VIEW));
    }

    compState.transferId = entityDto.id || 0
    displayModal(true, compState.transferId == 0 || actionName == L(AppConsts.actionNames.EDIT) ? "Manage" : "View");
  }

  const deleteProduct = (item: any) => {
    let input: EntityDto = { id: item.id };
    confirm({
      title: L(LocalizationKeys.ERP_MsgConfirmDeleteRecord.key),
      onOk() {
        transferStore.delete(input);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const acknowledgeTransfer = (item: any) => {
    try {

      confirm({
        title: L(LocalizationKeys.ERP_MsgConfirmAcknowledgePaymentTransfer.key),
        onOk() {
          performAcknowledgeTransfer(item.id);
        },
        onCancel() {
          console.log('Cancel');
        },
      });

    } catch (ex) {
      console.log(`error: ${ex}`);
    }
  }

  const performAcknowledgeTransfer = async (transferId: Number) => {
    try {
      await transferStore.acknowledgeTransfer(transferId);
      await getAllTransfer();
    } catch (ex) {
      console.log(`error: ${ex}`);
    }
  }

  const handleCreate = async (values: any) => {
    await getAllTransfer();
    displayModal(false);
  };
  const handleSearch = (value: string) => {

    compState.skipCount = 0;
    compState.filter = value;
    setCompState({ ...compState });
  };
  const columns = [
    { title: L(LocalizationKeys.ERP_LblTransferDate.key), dataIndex: 'transferDate', sorter: true, key: 'transferDate', width: 150, render: (text: string) => <div>{utils.formattedDate(text)}</div> },
    { title: L(LocalizationKeys.ERP_LblTrackingNumber.key), dataIndex: 'trackingNumber', sorter: true, key: 'trackingNumber', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblOrigin.key), dataIndex: 'origin', sorter: true, key: 'origin', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblDestination.key), dataIndex: 'destination', sorter: true, key: 'destination', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblTransferPointType.key), dataIndex: 'tranferPointType', sorter: true, key: 'tranferPointType', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblTransferContents.key), dataIndex: 'transferDetails', sorter: true, key: 'transferDetails', width: 150, render: (text: string) => <div dangerouslySetInnerHTML={{ __html: utils.splitObjectItemsForEachLine(text) }}></div> },
    { title: L(LocalizationKeys.ERP_LblStatus.key), dataIndex: 'status', sorter: true, key: 'status', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblAcknowlegedBy.key), dataIndex: 'acknowledgedBy', sorter: true, key: 'acknowledgedBy', width: 150, render: (text: string) => <div>{text ? text : '--'}</div> },
    { title: L(LocalizationKeys.ERP_LblAcknowledgedDate.key), dataIndex: 'acknowledgedDate', sorter: true, key: 'acknowledgedDate', width: 150, render: (text: string) => <div>{text ? utils.formattedDate(text) : '--'}</div> },
    { title: L(LocalizationKeys.ERP_LblCreatedOn.key), dataIndex: 'creationTime', sorter: true, key: 'creationTime', width: 150, render: (text: string) => <div> {utils.formattedDateAndTime(text)} </div> },
    { title: L(LocalizationKeys.ERP_LblCreatorUserId.key), dataIndex: 'creatorUser', sorter: true, key: 'creatorUser', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblLastModificationTime.key), dataIndex: 'lastModificationTime', sorter: true, key: 'lastModificationTime', width: 150, render: (text: string) => <div>{utils.formattedDateAndTime(text)}</div> },
    { title: L(LocalizationKeys.ERP_LblLastModifierUserId.key), dataIndex: 'lastModifierUser', sorter: true, key: 'lastModifierUser', width: 150, render: (text: string) => <div>{text}</div> }
  ];

  let csvOptions = {
    "getCSVData": getAllCSVData,
    "headers": [

      { label: L(LocalizationKeys.ERP_LblTransferDate.key), key: "transferDate" },
      { label: L(LocalizationKeys.ERP_LblTrackingNumber.key), key: "trackingNumber" },
      { label: L(LocalizationKeys.ERP_LblOrigin.key), key: "origin" },
      { label: L(LocalizationKeys.ERP_LblDestination.key), key: "destination" },

      { label: L(LocalizationKeys.ERP_LblTransferPointType.key), key: "tranferPointType" },
      { label: L(LocalizationKeys.ERP_LblTransferContents.key), key: "transferDetails" },
      { label: L(LocalizationKeys.ERP_LblStatus.key), key: "status" },
      { label: L(LocalizationKeys.ERP_LblAcknowlegedBy.key), key: "acknowledgedBy" },
      { label: L(LocalizationKeys.ERP_LblAcknowledgedDate.key), key: "acknowledgedDate" },
      { label: L(LocalizationKeys.ERP_LblCreatedOn.key), key: "creationTime" },
      { label: L(LocalizationKeys.ERP_LblCreatorUserId.key), key: "creatorUser" },
      { label: L(LocalizationKeys.ERP_LblLastModificationTime.key), key: "lastModificationTime" },
      { label: L(LocalizationKeys.ERP_LblLastModifierUserId.key), key: "lastModifierUser" }

    ],
    "fileName": "allTransferList.csv",
    "enableExport": true
  }

  let tableOptions = {
    "rowKey": (record: any) => record.id.toString(),
    "bordered": true,
    "columns": columns,
    "pagination": { pageSize: compState.maxResultCount, total: transfer === (undefined || null) ? 0 : transfer.totalCount, defaultCurrent: 1 },
    "loading": (transfer === undefined ? true : false),
    "dataSource": (transfer === (undefined || null) ? [] : transfer.items),
    "onChange": handleTableChange,
    "actionsList": [{
      "actionName": L(AppConsts.actionNames.EDIT),
      "actionCallback": createOrUpdateModalOpen,
      "appearance": CustomButton.appearances.Edit,
      "isVisible": (record: any) => {
        return (isGranted(AppConsts.permissionNames.Transfer_Edit) && isEditEnable(record))
      }
    },
    {
      "actionName": L(AppConsts.actionNames.DETAIL_VIEW),
      "actionCallback": createOrUpdateModalOpen,
      "appearance": CustomButton.appearances.Detail,
      "isVisible": (record: any) => {
        return (isGranted(AppConsts.permissionNames.Transfer_View))
      }
    },
    {
      "actionName": L(AppConsts.actionNames.ACKNOWLEDGE_TRANSFER),
      "actionCallback": acknowledgeTransfer,
      "appearance": CustomButton.appearances.Check,
      "isVisible": (record: any) => {
        return (isGranted(`TP.${record.transferToId}.ACK`) && isEditEnable(record))
      }
    }

    ],
    "getGridData": getAllTransfer,
    "enableSorting": true,

  }

  let headerOptions = {
    "createOrUpdateModalOpen": createOrUpdateModalOpen,
    "enableButton": isGranted(AppConsts.permissionNames.Transfer_Add)
  }

  let searchOptions = {
    "onSearch": handleSearch,
    "placeholder": L(LocalizationKeys.ERP_LblFilter.key),
    "enableSearch": false,
    "advanceFilterFields": transferAdvanceFilterForm,
    "enableAdvanceSearch": true
  }

  return (
    <>
      <Card className='card-grid'>

        <Row style={{ marginTop: 0 }}>
          <Col
            xs={{ span: 24, offset: 0 }}
            sm={{ span: 24, offset: 0 }}
            md={{ span: 24, offset: 0 }}
            lg={{ span: 24, offset: 0 }}
            xl={{ span: 24, offset: 0 }}
            xxl={{ span: 24, offset: 0 }}
          >
            <CustomTable
              options={tableOptions}
              searchOptions={searchOptions}
              csvOptions={csvOptions}
              headerOptions={headerOptions}
            />

          </Col>
        </Row>

        <CreateOrUpdateTransfer
          visible={compState.modalVisible}
          onCancel={() => {
            displayModal(false);
            setTimeout(() => {
              getAllTransfer();
            }, 250);

          }}
          modalType={compState.transferId === 0 ? 'create' : 'edit'}
          onCreate={handleCreate}
        />

        <View
          visible={compState.viewModalVisible}
          onCancel={() => { getAllTransfer(); displayModal(false); }}
        />

      </Card>
    </>
  )
}

export default Transfer;