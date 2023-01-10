import { Card, FormInstance, Input, Modal, Tag } from 'antd';
import React, { useRef } from 'react';
import CustomAdvanceFilter from '../../../../components/CustomWebControls/CustomAdvanceFilter/customAdvanceFilter';
import { useCompState } from '../../../../hooks/appStoreHooks';
import countriesAdvanceFilterForm from './json/countriesAdvanceFilterForm.json';
import './index.less';
import CustomCRUDComponent from '../../../../components/CustomCRUDComponent';
import { L } from '../../../../lib/abpUtility';
import utils from '../../../../utils/utils';
import createCountryForm from './json/createCountryForm.json';
import updateCountryForm from './json/updateCountryForm.json';
import viewCountryForm from './json/viewCountryForm.json';
import LocalizationKeys from '../../../../lib/localizationKeys';

export interface ICountriesState {

    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    countriesId: number;
    pageTitle: string;
    filter: string;
    sorting: string
}

const confirm = Modal.confirm;
const Search = Input.Search;

const Countries = (props: any) => {

    const formRef = useRef<FormInstance>(null);

    const initialState: ICountriesState = {

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
            value: "Id,Code,Latitude,Longitude,LastModificationTime,CreationTime,IsDeleted,IconUrl,FK_Countries.Id_CountryTranslation_CoreId_Name_name,FK_countries.creatorUserId_Users_id_Name_creatorUser,FK_countries.lastModifierUserId_Users_id_Name_lastModifierUser"
        }
    ];

    const [compState, setCompState] = useCompState({ parameters: params });

    const columns = [

        { title: L(LocalizationKeys.ERP_LblCode.key), dataIndex: 'code', sorter: true, key: 'code', width: 100, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblName.key), dataIndex: 'name', sorter: true, key: 'name', width: 130, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblLatitude.key), dataIndex: 'latitude', sorter: true, key: 'latitude', width: 120, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblLongitude.key), dataIndex: 'longitude', sorter: true, key: 'longitude', width: 120, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblIconUrl.key), dataIndex: 'iconUrl', sorter: true, key: 'iconUrl', width: 120, render: (text: string) => <div> {text} </div> },
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
        <div className='countries-container'>
            <Card className='card-grid'>

                <CustomCRUDComponent
                    hideHeading={true}
                    tableName='Countries'
                    tableColumns={columns}
                    parameters={compState.parameters}
                    enableDownloadCsv={false}
                    enableSearch={false}
                    formFields={createCountryForm.formFields}
                    formFieldsForEdit={updateCountryForm.formFields}
                    formFieldsForView={viewCountryForm.formFields}
                    refreshData={JSON.stringify(compState.parameters)}
                    isWithTranslation={true}
                    translationTableName='CountryTranslation'
                    modalWidth={modalWidth}
                    modalTitle={L(LocalizationKeys.ERP_LblCountry.key)}
                    titleFieldName='name'
                    advanceFilterFields={countriesAdvanceFilterForm}
                    enableAdvanceFilter={true}
                />

            </Card>
        </div>
    );

};

export default Countries;

