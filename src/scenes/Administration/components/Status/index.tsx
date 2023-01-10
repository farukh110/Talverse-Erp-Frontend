import { Card, FormInstance, Input, Modal, Tag } from 'antd';
import React, { useRef } from 'react';
import CustomCRUDComponent from '../../../../components/CustomCRUDComponent';
import CustomAdvanceFilter from '../../../../components/CustomWebControls/CustomAdvanceFilter/customAdvanceFilter';
import { useCompState } from '../../../../hooks/appStoreHooks';
import { L } from '../../../../lib/abpUtility';
import LocalizationKeys from '../../../../lib/localizationKeys';
import utils from '../../../../utils/utils';
import statusAdvanceFilterForm from './json/statusAdvanceFilterForm.json';
import createStatusForm from './json/createStatusForm.json';
import updateStatusForm from './json/updateStatusForm.json';
import viewStatusForm from './json/viewStatusForm.json';

import './index.less';

export interface IStatusState {

  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  statusId: number;
  pageTitle: string;
  filter: string;
  sorting: string;
}

const confirm = Modal.confirm;
const Search = Input.Search;

const Status = (props: any) => {

  const formRef = useRef<FormInstance>(null);

  const initialState: IStatusState = {

    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    statusId: 0,
    pageTitle: '',
    filter: '',
    sorting: ''
  };

  let params = [
    {
      key: "SelectFields",
      value: "LastModificationTime,Id,Code,Type,IsDeleted,CreationTime,FK_Statuses.creatorUserId_Users_id_Name_creatorUser,FK_Statuses.lastModifierUserId_Users_id_Name_lastModifierUser"
    }
  ];

  const [compState, setCompState] = useCompState({ parameters: params });

  const columns = [

    { title: L(LocalizationKeys.ERP_LblCode.key), dataIndex: 'code', sorter: true, key: 'code', width: 100, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblType.key), dataIndex: 'type', sorter: true, key: 'type', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblCreatedOn.key), dataIndex: 'creationTime', sorter: true, key: 'creationTime', width: 150, render: (text: string) => <div> {utils.formattedDateAndTime(text)} </div> },
    { title: L(LocalizationKeys.ERP_LblCreatorUserId.key), dataIndex: 'creatorUser', sorter: true, key: 'creatorUser', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblLastModificationTime.key), dataIndex: 'lastModificationTime', sorter: true, key: 'lastModificationTime', width: 150, render: (text: string) => <div>{utils.formattedDateAndTime(text)}</div> },
    { title: L(LocalizationKeys.ERP_LblLastModifierUserId.key), dataIndex: 'lastModifierUser', sorter: true, key: 'lastModifierUser', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblIsDeleted.key), dataIndex: 'isDeleted', sorter: true, key: 'isDeleted', width: 100, render: (text: boolean) => (text === true ? <Tag color="#2db7f5">{L(LocalizationKeys.ERP_LblYes.key)}</Tag> : <Tag color="red">{L(LocalizationKeys.ERP_LblNo.key)}</Tag>) },

  ];

  let modalWidth: any = '35%';

  const handleSearch = (value: string) => {
    if (value) {
      params.push(
        {
          "key": "QueryFilters",
          "value": value
        });
    }
    compState.parameters = params;
    setCompState({ ...compState });
  };


  return (
    <div className='status-container'>

      <Card className='card-grid'>

        <CustomCRUDComponent
          hideHeading={true}
          tableName='Statuses'
          tableColumns={columns}
          parameters={compState.parameters}
          enableDownloadCsv={false}
          enableSearch={false}
          formFields={createStatusForm.formFields}
          formFieldsForEdit={updateStatusForm.formFields}
          formFieldsForView={viewStatusForm.formFields}
          refreshData={JSON.stringify(compState.parameters)}
          isWithTranslation={true}
          translationTableName='StatusTranslation'
          modalTitle={L(LocalizationKeys.ERP_LblStatus.key)}
          modalWidth={modalWidth}
          titleFieldName='name'
          advanceFilterFields={statusAdvanceFilterForm}
          enableAdvanceFilter={true}
        />

      </Card>

    </div>
  )
}

export default Status;