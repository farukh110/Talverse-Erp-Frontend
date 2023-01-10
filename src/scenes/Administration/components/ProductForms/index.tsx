import React, { useEffect, useRef } from 'react';
import { Button, Card, Col, Input, Modal, Row, Tag } from 'antd';
import { L } from '../../../../lib/abpUtility';
import { useAppState, useAppStores, useCompState } from '../../../../hooks/appStoreHooks';
import CustomCRUDComponent from '../../../../components/CustomCRUDComponent';
import './index.less';
import CustomAdvanceFilter from '../../../../components/CustomWebControls/CustomAdvanceFilter/customAdvanceFilter';
import LocalizationKeys from '../../../../lib/localizationKeys';
import utils from '../../../../utils/utils';
import createProductForm from './json/createProductForm.json';
import updateProductForm from './json/updateProductForm.json';
import viewProductForm from './json/viewProductForm.json';
import productFormAdvanceFilterForm from './json/productFormAdvanceFilterForm.json';

const Programs = (props: any) => {

  let params = [
    {
      key: "SelectFields",
      value: "Id,IsActive,CreationTime,LastModificationTime,FK_productForms.ID_ProductFormTranslation_CoreId_Name_productFormName,FK_productForms.ID_ProductFormTranslation_CoreId_Description_productFormDescription,FK_productForms.ProductId_ProductTranslation_CoreId_Name_productName,FK_productForms.creatorUserId_Users_id_Name_creatorUserId,FK_productForms.lastModifierUserId_Users_id_Name_lastModifierUserId"
    }
  ];

  const [compState, setCompState] = useCompState({ parameters: params });

  const columns = [
    { title: L(LocalizationKeys.ERP_LblProductName.key), dataIndex: 'productName', sorter: true, key: 'productName', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblName.key), dataIndex: 'productFormName', sorter: true, key: 'productFormName', width: 150, render: (text: string) => <div>{text}</div> },
    // { title: L('Description'), dataIndex: 'productFormDescription', sorter: true, key: 'productFormDescription', width: 150, render: (text: string) => <div>{text}</div> },
    {
      title: L(LocalizationKeys.ERP_LblIsActive.key),
      dataIndex: 'isActive',
      sorter: true,
      key: 'isActive',
      width: 150,
      render: (text: boolean) => (text === true ? <Tag color="#2db7f5">{L(LocalizationKeys.ERP_LblYes.key)}</Tag> : <Tag color="red">{L(LocalizationKeys.ERP_LblNo.key)}</Tag>),
    },
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
    <div className='product-form-container'>
      <Card className='card-grid'>

        <CustomCRUDComponent
          hideHeading={true}
          tableName='ProductForms'
          tableColumns={columns}
          parameters={compState.parameters}
          enableDownloadCsv={false}
          enableSearch={false}
          formFields={createProductForm.formFields}
          formFieldsForEdit={updateProductForm.formFields}
          formFieldsForView={viewProductForm.formFields}
          refreshData={JSON.stringify(compState.parameters)}
          isWithTranslation={true}
          translationTableName='ProductFormTranslation'
          modalTitle={L(LocalizationKeys.ERP_LblProductForm.key)}
          titleFieldName='productFormName'
          advanceFilterFields={productFormAdvanceFilterForm}
          enableAdvanceFilter={true}
        />


      </Card>
    </div>
  )
}

export default Programs; 
