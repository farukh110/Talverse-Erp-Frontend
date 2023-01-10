import React, { useRef } from 'react';
import { Card, FormInstance, Input, Modal, Tag } from 'antd';
import './index.less';
import { useCompState } from '../../../../hooks/appStoreHooks';
import { L } from '../../../../lib/abpUtility';
import CustomAdvanceFilter from '../../../../components/CustomWebControls/CustomAdvanceFilter/customAdvanceFilter';
import CustomCRUDComponent from '../../../../components/CustomCRUDComponent';
import htmlAdvanceFilterForm from './json/htmlAdvanceFilterForm.json';
import utils from '../../../../utils/utils';
import createHtmlTemplateForm from './json/createHtmlTemplateForm.json';
import updateHtmlTemplateForm from './json/updateHtmlTemplateForm.json';
import viewHtmlTemplateForm from './json/viewHtmlTemplateForm.json';
import LocalizationKeys from '../../../../lib/localizationKeys';

export interface IHtmlTemplatesState {

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

const HtmlTemplates = (props: any) => {

    const formRef = useRef<FormInstance>(null);

    const initialState: IHtmlTemplatesState = {

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
            value: "Id,Code,Type,LastModificationTime,CreationTime,IsDeleted,FK_HtmlTemplates.Id_HtmlTemplateTranslation_CoreId_Name_name,FK_HtmlTemplates.creatorUserId_Users_id_Name_creatorUserId,FK_HtmlTemplates.creatorUserId_Users_id_Name_creatorUser,FK_HtmlTemplates.lastModifierUserId_Users_id_Name_lastModifierUser"
        }
    ];

    const [compState, setCompState] = useCompState({ parameters: params });

    const columns = [

        { title: L(LocalizationKeys.ERP_LblCode.key), dataIndex: 'code', sorter: true, key: 'code', width: 150, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblName.key), dataIndex: 'name', sorter: true, key: 'name', width: 150, render: (text: string) => <div>{text}</div> },
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
        <div className='html-templates-container'>
            <Card className='card-grid'>

                <CustomCRUDComponent
                    hideHeading={true}
                    tableName='HtmlTemplates'
                    tableColumns={columns}
                    parameters={compState.parameters}
                    enableDownloadCsv={false}
                    enableSearch={false}
                    formFields={createHtmlTemplateForm.formFields}
                    formFieldsForEdit={updateHtmlTemplateForm.formFields}
                    formFieldsForView={viewHtmlTemplateForm.formFields}
                    refreshData={JSON.stringify(compState.parameters)}
                    isWithTranslation={true}
                    translationTableName='HtmlTemplateTranslation'
                    modalWidth={modalWidth}
                    modalTitle={L(LocalizationKeys.ERP_LblHTMLTemplate.key)}
                    titleFieldName='name'
                    advanceFilterFields={htmlAdvanceFilterForm}
                    enableAdvanceFilter={true}
                     />

            </Card>
        </div>
    );

};

export default HtmlTemplates;

