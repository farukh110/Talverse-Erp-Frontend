import React, { useEffect, useRef } from 'react';
import { Card, FormInstance, Table } from 'antd';
import './index.less';
import { useAppStores, useCompState } from '../../../../hooks/appStoreHooks';
import { L } from '../../../../lib/abpUtility';
import LocalizationKeys from '../../../../lib/localizationKeys';
import { CustomButton, CustomCol, CustomRow } from '../../../../components/CustomControls';
import { useReactToPrint } from 'react-to-print';
import { CSVLink, CSVDownload } from "react-csv";
import { ContentRequestDto } from '../../../../services/Content/dto/contentRequestDto';
import CustomForm, { FormModes } from '../../../../components/CustomForm';
import rankingAdvanceFilterForm from './json/rankingAdvanceFilterForm.json';
import formUtils from '../../../../utils/formUtils';


export interface ICampaignsReportState {

  campaignsList: [],
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  campaignsReportId: number;
  filter: string;
  sorting: string

}
const CampaignsReports = (props: any) => {

  const formRef = useRef<FormInstance>(null);

  const initialState: ICampaignsReportState = {
    campaignsList: [],
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    campaignsReportId: 0,
    filter: '',
    sorting: 'CampaignsReportId DESC'
  };

  const [compState, setCompState] = useCompState(initialState);
  const [rankingData, setRankingData] = useCompState([]);
  const { contentStore } = useAppStores();
  const [fields, setFields] = useCompState([]);
  const [loadingState, setLoadingState] = useCompState(false);
  
  const COMMENT_FIELD_NAME = "countryName";

  useEffect(() => {
    getAllRankings();

  }, [compState.campaignsReportId]);

  useEffect(() => {
    getCampaignsList();
  }, []);

  const getAllRankings = async () => {
    let requestObj: ContentRequestDto = {
      ComponentIdOrName: 'CampaignWiseCountriesRanking',
      Parameters: [
        {
          key: "CampaignId",
          value: compState.campaignsReportId
        }]
    }
    let res = await contentStore.GetComponentData(requestObj);
    if (res && res.items)
      setRankingData(res.items);
      setLoadingState(false);
  }

  const columns = [

    {
      title: L(LocalizationKeys.ERP_LblCountryRep.key),
      dataIndex: 'countryName',
      key: 'countryName',
      width: 250,
    },
    {
      title: L(LocalizationKeys.ERP_LblAchievedCount.key),
      dataIndex: 'achievedCount',
      key: 'achievedCount',
      width: 300
    },

  ];


  const expandedRowRender = (record: any) => {

    if (record.reps && record.reps.length > 0) {

      const columnschild = [


        {
          title: L(LocalizationKeys.ERP_LblName.key),
          dataIndex: 'name',
          key: 'name',
          width: 267
        },
        {
          title: L(LocalizationKeys.ERP_LblAchievedCount.key),
          dataIndex: 'achievedCount',
          key: 'achievedCount',
          width: 320
        }
      ];
      const dataChild: any = [];

      record.reps.forEach((element: any, index: any) => {
        dataChild.push({
          "key": index + element.name,
          "achievedCount": element.achievedCount,
          // "rank": element.rank,
          "name": element.name
        });

      });

      return <Table className='child-table' showHeader={false} columns={columnschild} dataSource={dataChild} pagination={false} />;

    }
    return null;
  };

  const exportedData: any = [];

  const convertRankingDataToCSVRows = () => {
    let newData = rankingData && rankingData.length > 0 ? rankingData.map((object: any) => ({ ...object })) : [];

    newData.forEach((element: any) => {
      let childElem: any = [];
      if (element.reps && element.reps.length > 0) {
        childElem = [...element.reps];
        delete element.reps;

      }

      exportedData.push(element);

      if (childElem && childElem.length > 0)
        childElem.forEach((element: any) => exportedData.push(element));
    });

  }
  convertRankingDataToCSVRows();
  const headers = [
    {
      label: L(LocalizationKeys.ERP_LblCountry.key),
      key: "countryName"
    },
    {
      label: L(LocalizationKeys.ERP_LblRepName.key),
      key: "name"
    },
    {
      label: L(LocalizationKeys.ERP_LblAchievedCount.key),
      key: "achievedCount"
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
    rankingAdvanceFilterForm.formFields = formUtils.setFieldDataItems(rankingAdvanceFilterForm, "supporterId", campaignDataItems);
    setFields(rankingAdvanceFilterForm.formFields);

  }

  const changeSelectedValue = (val: any) => {

    if (val) {
      setLoadingState(true);
      compState.campaignsReportId = val?.selectedItem?.key;
      setRankingData([]);
      setCompState({ ...compState });
    }

  }

  const getRowCss = (row: any) => {
    return row[COMMENT_FIELD_NAME] ? 'high-lighted-row' : 'data-row';
  }
  const getAllCountryIds = () => {
    const cIds = rankingData.map(function (item: any) {
      return item['countryId']?.toString();
    })
    return cIds;
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


          <CustomCol
            xs={{ span: 12, offset: 0 }}
            sm={{ span: 12, offset: 0 }}
            md={{ span: 12, offset: 0 }}
            lg={{ span: 12, offset: 0 }}
            xl={{ span: 12, offset: 0 }}
            xxl={{ span: 12, offset: 0 }}>

          </CustomCol>

        </CustomRow>

        <br/>

        <div>
            <CustomRow>

              <CustomCol span={24}>

                <CustomRow>

                  <CustomCol span={24}>

                    {
                      rankingData && rankingData.length > 0 && <div className='actions-content'>

                        <CustomButton appearance={CustomButton.appearances.ExportPdf} onClick={handlePrint}>

                        </CustomButton>

                        <CSVLink
                          filename={"CampaignsRakings.csv"}
                          headers={headers}
                          data={exportedData}>

                          <CustomButton appearance={CustomButton.appearances.Download}>
                          </CustomButton>

                        </CSVLink>


                      </div>
                        
                    }

                  </CustomCol>

                </CustomRow>
                <Table
                  className='parent-table'
                  ref={componentRef}
                  rowKey={(record: any) => record.countryId.toString()}
                  columns={columns}
                  expandedRowRender={expandedRowRender}
                  dataSource={rankingData}
                  expandable={{
                    rowExpandable: (record: any) => true //record.reps && record.reps!.length > 0
                  }}
                  expandedRowKeys={getAllCountryIds()}
                  defaultExpandAllRows={true}
                  pagination={false}
                  loading={loadingState}
                  rowClassName={(record: any) =>
                    getRowCss != undefined && typeof (getRowCss) == 'function' ? getRowCss(record) : ""
                  }
                />

              </CustomCol>
            </CustomRow>

        </div>
      </Card>
    </>

  )
}

export default CampaignsReports;