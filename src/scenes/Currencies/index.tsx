import React, { useEffect, useRef } from 'react';
import { Button, Card, Col, Input, Modal, Row, Tag } from 'antd';
import { isGranted, L } from '../../lib/abpUtility';
import CustomCRUDComponent from '../../components/CustomCRUDComponent';
import './index.less';
import LocalizationKeys from '../../lib/localizationKeys';
import CustomAdvanceFilter from '../../components/CustomWebControls/CustomAdvanceFilter/customAdvanceFilter';
import { useCompState } from '../../hooks/appStoreHooks';

import updateCurrency from './json/updateCurrency.json';
import viewCurrency from './json/viewCurrency.json';

const Currencies = (props: any) => {

  let params = [
    {
      key: "SelectFields",
      value: "Id,Code,Rate"
    },
    {
      "key": "QueryFilters",
      "value": {
        "fieldName": "",
        "operator": "AND",
        "filters": [
          {
            "fieldName": "isDeleted",
            "operator": "=",
            "value": false
          }]
      }
    }
  ];

  const [compState, setCompState] = useCompState({ parameters: params });

  const columns = [
    { title: L('Code'), dataIndex: 'code', sorter: true, key: 'code', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L('Rate'), dataIndex: 'rate', sorter: true, key: 'rate', width: 150, render: (text: string) => <div>{text}</div> },
  ];

  let modalWidth: any = '25%';

  const handleSearch = (value: string) => {
    if (value) {
      params.push(
        {
          "key": "QueryFilters",
          "value": value
        });
      compState.parameters = params;
      setCompState({ ...compState });
    }
  };

  return (
    <div className='currency-container'>
      <Card className='card-grid'>


        <CustomCRUDComponent
          isNewRecordDisable={true}
          hideHeading={true}
          tableName='Currencies'
          tableColumns={columns}
          parameters={compState.parameters}
          enableDownloadCsv={true}
          enableSearch={true}
          formFieldsForEdit={updateCurrency.formFields}
          formFieldsForView={viewCurrency.formFields}
          refreshData={JSON.stringify(compState.parameters)}
          isWithTranslation={false}
          modalWidth={modalWidth}
          modalTitle={L(LocalizationKeys.ERP_LblCurrencyRate.key)}
          titleFieldName='code'
          formFields={updateCurrency.formFields}
        />


      </Card>
    </div>
  )
}
export default Currencies;
