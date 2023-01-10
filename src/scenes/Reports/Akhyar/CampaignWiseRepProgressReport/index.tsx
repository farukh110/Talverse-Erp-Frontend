import React, { useEffect, useRef } from 'react';
import { Card, FormInstance, Table } from 'antd';
import './index.less';
import { useAppStores, useCompState } from '../../../../hooks/appStoreHooks';
import { ContentRequestDto } from '../../../../services/Content/dto/contentRequestDto';
import campaignsFilterForm from './json/campaignsFilterForm.json';
import formUtils from '../../../../utils/formUtils';
import { CustomButton, CustomCol, CustomRow } from '../../../../components/CustomControls';
import CustomForm, { FormModes } from '../../../../components/CustomForm';
import { useReactToPrint } from 'react-to-print';
import { CSVLink } from 'react-csv';
import utils from '../../../../utils/utils';
import { L } from '../../../../lib/abpUtility';
import LocalizationKeys from '../../../../lib/localizationKeys';

export interface ICampaignWiseRepProgressReportState {

    campaignsList: [],
    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    campaignsRepProgressReportId: number;
    filter: string;
    sorting: string;

}

const CampaignWiseRepProgressReport = (props: any) => {

    const formRef = useRef<FormInstance>(null);

    const initialState: ICampaignWiseRepProgressReportState = {
        campaignsList: [],
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        campaignsRepProgressReportId: 0,
        filter: '',
        sorting: 'CampaignsRepProgressReportId DESC'
    };

    const [compState, setCompState] = useCompState(initialState);
    const [repProgressReportData, setRepProgressReportData] = useCompState([]);
    const [reportDataFileName, setReportDataFileName] = useCompState([]);
    const { contentStore } = useAppStores();
    const [loadingState, setLoadingState] = useCompState(false);

    const [fields, setFields] = useCompState([]);

    useEffect(() => {
        getAllRepProgressReport();
    }, [compState.campaignsRepProgressReportId]);

    useEffect(() => {
        getCampaignsList();
    }, []);

    const getAllRepProgressReport = async () => {

        let requestObj: ContentRequestDto = {
            ComponentIdOrName: 'CampaignWiseRepProgressReport',
            Parameters: [
                {
                    key: "CampaignId",
                    value: compState.campaignsRepProgressReportId
                }]
        }
        let res = await contentStore.GetComponentData(requestObj);
        if (res && res.items)
        setRepProgressReportData(res.items);
        setLoadingState(false);
    }

    const columns = [

        {
            title: L(LocalizationKeys.ERP_LblType.key),
            dataIndex: 'supporterType',
            key: 'supporterType',
        },
        {
            title: L(LocalizationKeys.ERP_LblName.key),
            dataIndex: 'supporterName',
            key: 'supporterName',
        },
        {
            title: L(LocalizationKeys.ERP_LblIcManager.key),
            dataIndex: 'supporterManager',
            key: 'supporterManager',
        },
        {
            title: L(LocalizationKeys.ERP_LblTargetAssigned.key),
            dataIndex: 'targetAssigned',
            key: 'targetAssigned',
        },
        {
            title: L(LocalizationKeys.ERP_LblTargetAchieved.key),
            dataIndex: 'targetAchieved',
            key: 'targetAchieved',
        },
        {
            title: L(LocalizationKeys.ERP_LblTargetAchievedPercentage.key),
            dataIndex: 'targetAchievedPercentage',
            key: 'targetAchievedPercentage',
        },
        {
            title: L(LocalizationKeys.ERP_LblRemainingTarget.key),
            dataIndex: 'remainingTarget',
            key: 'remainingTarget',
        }
    ];

    const headers = [
        {
            label: L(LocalizationKeys.ERP_LblType.key),
            key: 'supporterType',
        },
        {
            label: L(LocalizationKeys.ERP_LblName.key),
            key: 'supporterName',
        },
        {
            label: L(LocalizationKeys.ERP_LblIcManager.key),
            key: 'supporterManager',
        },
        {
            label: L(LocalizationKeys.ERP_LblTargetAssigned.key),
            key: 'targetAssigned',
        },
        {
            label: L(LocalizationKeys.ERP_LblTargetAchieved.key),
            key: 'targetAchieved',
        },
        {
            label: L(LocalizationKeys.ERP_LblTargetAchievedPercentage.key),
            key: 'targetAchievedPercentage',
        },
        {
            label: L(LocalizationKeys.ERP_LblRemainingTarget.key),
            key: 'remainingTarget',
        }
    ];


    const componentRef: any = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const getCampaignsList = async () => {

        let requestObj: ContentRequestDto = {

            ComponentIdOrName: 'GetAllPagedData',
            Parameters: [
                {
                    "key": "Table",
                    "value": "Campaigns"
                },
                {
                    "key": "SkipCount",
                    "value": 0
                },
                {
                    "key": "Sorting",
                    "value": "campaignName ASC"
                },
                {
                    "key": "MaxResultCount",
                    "value": 100
                },
                {
                    "key": "SelectFields",
                    "value": "Id,FK_campaigns.ID_CampaignTranslation_CoreId_Name_campaignName"
                }
            ]
        };
        //loop through fields
        let response = await contentStore.GetComponentData(requestObj);

        // compState.campaignList
        let campaignDataItems: any = [];

        response && response.items && response.items.length > 0 && response.items.map((campaignItem: any, index: any) => {
            campaignDataItems.push({ key: campaignItem.id, value: campaignItem.campaignName });
        });
        campaignsFilterForm.formFields = formUtils.setFieldDataItems(campaignsFilterForm, "supporterId", campaignDataItems);
        setFields(campaignsFilterForm.formFields);
    }

    const changeSelectedValue = (val: any) => {

        if (val) {
            setLoadingState(true);
            compState.campaignsRepProgressReportId = val?.selectedItem?.key;
            setRepProgressReportData([]);
            setCompState({ ...compState });
            setReportDataFileName(val?.selectedItem?.value);
        }
    }

    return (
        <>

            <Card>
                <CustomRow>
                    <CustomCol
                        xs={{ span: 12, offset: 0 }}
                        sm={{ span: 12, offset: 0 }}
                        md={{ span: 12, offset: 0 }}
                        lg={{ span: 12, offset: 0 }}
                        xl={{ span: 12, offset: 0 }}
                        xxl={{ span: 12, offset: 0 }}>

                        <CustomRow>

                            <CustomCol
                                xs={{ span: 12, offset: 0 }}
                                sm={{ span: 12, offset: 0 }}
                                md={{ span: 12, offset: 0 }}
                                lg={{ span: 12, offset: 0 }}
                                xl={{ span: 12, offset: 0 }}
                                xxl={{ span: 12, offset: 0 }}>


                                <CustomForm
                                    formFields={fields}
                                    formMode={FormModes.Add}
                                    onCancel={() => { }}
                                    onChangeCallback={changeSelectedValue}
                                    onSubmit={() => { }}
                                    hideButtons>

                                </CustomForm>

                            </CustomCol>

                        </CustomRow>

                    </CustomCol>

                </CustomRow>

                <br />
                <div>

                    <CustomRow>

                        <CustomCol span={24}>

                            <CustomRow>

                                <CustomCol span={24}>

                                    {
                                        repProgressReportData && repProgressReportData.length > 0 &&
                                        
                                        <div className='actions-content'>

                                        <CustomButton appearance={CustomButton.appearances.ExportPdf} onClick={handlePrint}>

                                        </CustomButton>

                                        <CSVLink
                                            filename={`${reportDataFileName} ${utils.formattedDate(new Date())}.csv`}
                                            headers={headers}
                                            data={repProgressReportData}>

                                            <CustomButton appearance={CustomButton.appearances.Download}>
                                            </CustomButton>

                                        </CSVLink>


                                    </div>

                                    }

                                </CustomCol>

                            </CustomRow>

                        </CustomCol>

                    </CustomRow>

                    <Table
                        ref={componentRef}
                        rowKey={(record: any) => record.userSettingId.toString()}
                        columns={columns}
                        dataSource={repProgressReportData}
                        pagination={false}
                        loading={loadingState}
                    />

                </div>

            </Card>

        </>
    )
}

export default CampaignWiseRepProgressReport;