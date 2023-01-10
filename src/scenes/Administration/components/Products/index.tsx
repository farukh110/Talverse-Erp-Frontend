import React, { useEffect, useRef } from 'react';
import { Button, Card, Col, Input, Modal, Row, Tag } from 'antd';
import { isGranted, L } from '../../../../lib/abpUtility';
import { FormInstance } from 'antd/lib/form';
import CustomCRUDComponent from '../../../../components/CustomCRUDComponent';
import './index.less';
import LocalizationKeys from '../../../../lib/localizationKeys';
import CustomAdvanceFilter from '../../../../components/CustomWebControls/CustomAdvanceFilter/customAdvanceFilter';
import productAdvanceFilterForm from './json/productAdvanceFilterForm.json';
import { useCompState } from '../../../../hooks/appStoreHooks';
import utils from '../../../../utils/utils';

import createProductForm from './json/createProductForm.json';
import updateProductForm from './json/updateProductForm.json';
import viewProductForm from './json/viewProductForm.json';
export interface IProductState {
  modalVisible: boolean;
  maxResultCount: number;

  skipCount: number;
  productId: number;
  filter: string;
  sorting: string
}

const confirm = Modal.confirm;
const Search = Input.Search;

const Products = (props: any) => {

  const formRef = useRef<FormInstance>(null);

  const initialState: IProductState = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    productId: 0,
    filter: '',
    sorting: ''
  };

  let params = [
    {
      key: "SelectFields",
      value: "Id,Code,IsActive,IsSupporterNameRequired,DisplayOrder,FK_products.ID_ProductTranslation_CoreId_Name_productName,FK_products.ID_ProductTranslation_CoreId_UnitNameSingular_UnitNameSingular,FK_products.ID_ProductTranslation_CoreId_UnitNamePlural_UnitNamePlural,FK_products.ProgramId_ProgramTranslation_CoreId_Name_ProgramName,ProgramId,LastModificationTime,CreationTime,FK_products.creatorUserId_Users_id_Name_creatorUserId,FK_products.lastModifierUserId_Users_id_Name_lastModifierUserId"
    }
  ];

  const [compState, setCompState] = useCompState({ parameters: params });

  const columns = [
    { title: L(LocalizationKeys.ERP_LblProgram.key), dataIndex: 'programName', sorter: true, key: 'programName', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblCode.key), dataIndex: 'code', sorter: true, key: 'code', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblName.key), dataIndex: 'productName', sorter: true, key: 'productName', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblIsSupporterNameRequired.key), dataIndex: 'isSupporterNameRequired', sorter: true, key: 'isSupporterNameRequired', width: 150, render: (text: boolean) => (text === true ? <Tag className='btn-success'>{L('Yes')}</Tag> : <Tag color="red">{L('No')}</Tag>) },
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
    <div className='product-container'>
      <Card className='card-grid'>

        <CustomCRUDComponent
          hideHeading={true}
          tableName='Products'
          tableColumns={columns}
          parameters={compState.parameters}
          enableDownloadCsv={true}
          enableSearch={false}
          formFields={createProductForm.formFields}
          formFieldsForEdit={updateProductForm.formFields}
          formFieldsForView={viewProductForm.formFields}
          refreshData={JSON.stringify(compState.parameters)}
          isWithTranslation={true}
          translationTableName='ProductTranslation'
          modalTitle={L(LocalizationKeys.ERP_LblProduct.key)}
          titleFieldName='productName'
          advanceFilterFields={productAdvanceFilterForm}
          enableAdvanceFilter={true}
        />

      </Card>
    </div>
  )
}

export default Products;