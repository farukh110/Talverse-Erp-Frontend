import React, { useEffect, useRef } from 'react';
import { Button, Card, Col, Input, Modal, Row, Tag } from 'antd';

import { L } from '../../../../lib/abpUtility';
import { useAppState, useAppStores, useCompState } from '../../../../hooks/appStoreHooks';
import CustomCRUDComponent from '../../../../components/CustomCRUDComponent';
import './index.less';
import CustomAdvanceFilter from '../../../../components/CustomWebControls/CustomAdvanceFilter/customAdvanceFilter';
import programCategoryAdvanceFilterForm from './json/programCategoryAdvanceFilterForm.json';
import createProgramCategoryForm from './json/createProgramCategoryForm.json';
import updateProgramCategoryForm from './json/updateProgramCategoryForm.json';
import viewProgramCategoryForm from './json/viewProgramCategoryForm.json';
import utils from '../../../../utils/utils';
import LocalizationKeys from '../../../../lib/localizationKeys';

const ProgramCategories = (props: any) => {

  let params = [
    {
      key: "SelectFields",
      value: "Id,Code,IsActive,DisplayOrder,FK_programCategories.ID_ProgramCategoryTranslation_CoreId_Name_programCategoryName,FK_programCategories.ID_ProgramCategoryTranslation_CoreId_Description_programCategoryDescription,LastModificationTime,CreationTime,FK_programCategories.creatorUserId_Users_id_Name_creatorUserId,FK_programCategories.lastModifierUserId_Users_id_Name_lastModifierUserId"
    }
  ];

  const [compState, setCompState] = useCompState({ parameters: params });

  const columns = [
    { title: L(LocalizationKeys.ERP_LblCode.key), dataIndex: 'code', sorter: true, key: 'code', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblName.key), dataIndex: 'programCategoryName', sorter: true, key: 'programCategoryName', width: 150, render: (text: string) => <div>{text}</div> },
    //{ title: L('Description'), dataIndex: 'programCategoryDescription', sorter: true, key: 'programCategoryDescription', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblIsActive.key), dataIndex: 'isActive', sorter: true, key: 'isActive', width: 150, render: (text: boolean) => (text === true ? <Tag className='btn-success'>{L('Yes')}</Tag> : <Tag color="red">{L('No')}</Tag>) },
    { title: L(LocalizationKeys.ERP_LblDisplayOrder.key), dataIndex: 'displayOrder', sorter: true, key: 'displayOrder', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblCreatedOn.key), dataIndex: 'creationTime', sorter: true, key: 'creationTime', width: 150, render: (text: string) => <div> {utils.formattedDateAndTime(text)} </div> },
    { title: L(LocalizationKeys.ERP_LblCreatorUserId.key), dataIndex: 'creatorUserId', sorter: true, key: 'creatorUserId', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblLastModificationTime.key), dataIndex: 'lastModificationTime', sorter: true, key: 'lastModificationTime', width: 150, render: (text: string) => <div>{utils.formattedDateAndTime(text)}</div> },
    { title: L(LocalizationKeys.ERP_LblLastModifierUserId.key), dataIndex: 'lastModifierUserId', sorter: true, key: 'lastModifierUserId', width: 150, render: (text: string) => <div>{text}</div> },

  ];

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
    <div className='program-categories-container'>
      <Card className='card-grid'>

        <CustomCRUDComponent
          hideHeading={true}
          tableName='ProgramCategories'
          tableColumns={columns}
          parameters={compState.parameters}
          enableDownloadCsv={false}
          enableSearch={false}
          formFields={createProgramCategoryForm.formFields}
          formFieldsForEdit={updateProgramCategoryForm.formFields}
          formFieldsForView={viewProgramCategoryForm.formFields}
          refreshData={JSON.stringify(compState.parameters)}
          isWithTranslation={true}
          translationTableName='ProgramCategoryTranslation'
          modalTitle={L(LocalizationKeys.ERP_LblProgramCategory.key)}
          titleFieldName='programCategoryName'
          advanceFilterFields={programCategoryAdvanceFilterForm}
          enableAdvanceFilter={true}

        />


      </Card>
    </div>
  )
}

export default ProgramCategories; 