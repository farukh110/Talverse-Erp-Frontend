import React, { useEffect, useRef } from 'react';
import { Button, Card, Col, Input, Modal, Row, Tag } from 'antd';
import { L } from '../../../../lib/abpUtility';
import { useAppState, useAppStores, useCompState } from '../../../../hooks/appStoreHooks';
import CustomCRUDComponent from '../../../../components/CustomCRUDComponent';
import './index.less';
import CustomAdvanceFilter from '../../../../components/CustomWebControls/CustomAdvanceFilter/customAdvanceFilter';
import LocalizationKeys from '../../../../lib/localizationKeys';
import utils from '../../../../utils/utils';
import createProgramForm from './json/createProgramForm.json';
import updateProgramForm from './json/updateProgramForm.json';
import viewProgramForm from './json/viewProgramForm.json';
import programAdvanceFilterForm from './json/programAdvanceFilterForm.json';

const Programs = (props: any) => {

  let params = [
    {
      key: "SelectFields",
      value: "Id,IsActive,StartDate,EndDate,IsFeatured,DisplayOrder,HierarchyLevel,FK_programs.ID_ProgramTranslation_CoreId_Name_programName,FK_programs.ID_ProgramTranslation_CoreId_Description_programDescription,FK_programs.ProgramCategoryId_ProgramCategoryTranslation_CoreId_Name_programCategoryName,LastModificationTime,CreationTime,FK_programs.creatorUserId_Users_id_Name_creatorUserId,FK_programs.lastModifierUserId_Users_id_Name_lastModifierUserId"
    }
  ];

  const [compState, setCompState] = useCompState({ parameters: params });

  const columns = [
    { title: L(LocalizationKeys.ERP_LblProgramCategory.key), dataIndex: 'programCategoryName', sorter: true, key: 'programCategoryName', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblName.key), dataIndex: 'programName', sorter: true, key: 'programName', width: 150, render: (text: string) => <div>{text}</div> },
    //{ title: L('Description'), dataIndex: 'programDescription', sorter: true, key: 'programDescription', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblStartDate.key), dataIndex: 'startDate', sorter: true, key: 'startDate', width: 150, render: (text: string) => <div> {utils.formattedDate(text)} </div> },
    { title: L(LocalizationKeys.ERP_LblEndDate.key), dataIndex: 'endDate', sorter: true, key: 'endDate', width: 150, render: (text: string) => <div> {utils.formattedDate(text)} </div> },
    {
      title: L(LocalizationKeys.ERP_LblIsFeatured.key),
      dataIndex: 'isFeatured',
      sorter: true,
      key: 'isFeatured',
      width: 150,
      render: (text: boolean) => (text === true ? <Tag color="#2db7f5">{L(LocalizationKeys.ERP_LblYes.key)}</Tag> : <Tag color="red">{L(LocalizationKeys.ERP_LblNo.key)}</Tag>),
    },
    { title: L(LocalizationKeys.ERP_LblDisplayOrder.key), dataIndex: 'displayOrder', sorter: true, key: 'displayOrder', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblHierarchyLevel.key), dataIndex: 'hierarchyLevel', sorter: true, key: 'hierarchyLevel', width: 150, render: (text: string) => <div>{text}</div> },
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
    <div className='programs-container'>
      <Card className='card-grid'>

        <CustomCRUDComponent
          hideHeading={true}
          tableName='Programs'
          tableColumns={columns}
          parameters={compState.parameters}
          enableDownloadCsv={false}
          enableSearch={false}
          formFields={createProgramForm.formFields}
          formFieldsForEdit={updateProgramForm.formFields}
          formFieldsForView={viewProgramForm.formFields}
          refreshData={JSON.stringify(compState.parameters)}
          isWithTranslation={true}
          translationTableName='ProgramTranslation'
          modalTitle={L(LocalizationKeys.ERP_LblProgram.key)}
          titleFieldName='programName'
          advanceFilterFields={programAdvanceFilterForm}
          enableAdvanceFilter={true}
        />


      </Card>
    </div>
  )
}

export default Programs; 
