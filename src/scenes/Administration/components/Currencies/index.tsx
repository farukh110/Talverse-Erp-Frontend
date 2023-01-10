import { Card, FormInstance, Input, Modal, Tag } from 'antd';
import React, { useRef } from 'react';
import CustomCRUDComponent from '../../../../components/CustomCRUDComponent';
import CustomAdvanceFilter from '../../../../components/CustomWebControls/CustomAdvanceFilter/customAdvanceFilter';
import { useCompState } from '../../../../hooks/appStoreHooks';
import { L } from '../../../../lib/abpUtility';
import LocalizationKeys from '../../../../lib/localizationKeys';
import utils from '../../../../utils/utils';
import currencyAdvanceFilterForm from './json/currencyAdvanceFilterForm.json';
import createCurrencyForm from './json/createCurrencyForm.json';
import updateCurrencyForm from './json/updateCurrencyForm.json';
import viewCurrencyForm from './json/viewCurrencyForm.json';
import './index.less';

export interface ICurrenciesState {

    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    countriesId: number;
    pageTitle: string;
    filter: string;
    sorting: string;
}

const confirm = Modal.confirm;
const Search = Input.Search;


const Currencies = (props: any) => {

    const formRef = useRef<FormInstance>(null);

    const initialState: ICurrenciesState = {

        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        countriesId: 0,
        pageTitle: '',
        filter: '',
        sorting: ''
    };

    let params = [
        {
            key: "SelectFields",
            value: "Id,Code,DigitalCode,Symbol,Rate,LastModificationTime,CreationTime,IsDeleted,FK_Currencies.Id_CurrencyTranslation_CoreId_Name_name,FK_Currencies.creatorUserId_Users_id_Name_creatorUser,FK_Currencies.lastModifierUserId_Users_id_Name_lastModifierUser"
        }
    ];

    const [compState, setCompState] = useCompState({ parameters: params });

    const columns = [

        { title: L(LocalizationKeys.ERP_LblCode.key), dataIndex: 'code', sorter: true, key: 'code', width: 100, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblName.key), dataIndex: 'name', sorter: true, key: 'name', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblDigitalCode.key), dataIndex: 'digitalCode', sorter: true, key: 'digitalCode', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblSymbol.key), dataIndex: 'symbol', sorter: true, key: 'symbol', width: 100, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblRate.key), dataIndex: 'rate', sorter: true, key: 'rate', width: 100, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblCreatedOn.key), dataIndex: 'creationTime', sorter: true, key: 'creationTime', width: 150, render: (text: string) => <div> {utils.formattedDateAndTime(text)} </div> },
        { title: L(LocalizationKeys.ERP_LblCreatorUserId.key), dataIndex: 'creatorUser', sorter: true, key: 'creatorUser', width: 130, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblLastModificationTime.key), dataIndex: 'lastModificationTime', sorter: true, key: 'lastModificationTime', width: 150, render: (text: string) => <div>{utils.formattedDateAndTime(text)}</div> },
        { title: L(LocalizationKeys.ERP_LblLastModifierUserId.key), dataIndex: 'lastModifierUser', sorter: true, key: 'lastModifierUser', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblIsDeleted.key), dataIndex: 'isDeleted', sorter: true, key: 'isDeleted', width: 100, render: (text: boolean) => (text === true ? <Tag color="#2db7f5">{L(LocalizationKeys.ERP_LblYes.key)}</Tag> : <Tag color="red">{L(LocalizationKeys.ERP_LblNo.key)}</Tag>) },

    ];

    let modalWidth: any = '30%';

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
        <div className='currencies-container'>

            <Card className='card-grid'>

                <CustomCRUDComponent
                    hideHeading={true}
                    tableName='Currencies'
                    tableColumns={columns}
                    parameters={compState.parameters}
                    enableDownloadCsv={false}
                    enableSearch={false}
                    formFields={createCurrencyForm.formFields}
                    formFieldsForEdit={updateCurrencyForm.formFields}
                    formFieldsForView={viewCurrencyForm.formFields}
                    refreshData={JSON.stringify(compState.parameters)}
                    isWithTranslation={true}
                    translationTableName='CurrencyTranslation'
                    modalTitle={L(LocalizationKeys.ERP_LblCurrency.key)}
                    modalWidth={modalWidth}
                    titleFieldName='name'
                    advanceFilterFields={currencyAdvanceFilterForm}
                    enableAdvanceFilter={true}

                />

            </Card>
        </div>
    );

};

export default Currencies;

