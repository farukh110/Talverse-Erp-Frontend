import React, { useEffect } from 'react';
import { Card, Col, Input, Modal, Row, Tag } from 'antd';

import { EntityDto } from '../../services/dto/entityDto';
import { isGranted, L } from '../../lib/abpUtility';
import { useAppState, useAppStores, useCompState } from '../../hooks/appStoreHooks';
import CampaignsStore from '../../stores/campaignsStore';
import createCampaignForm from './json/createCampaignForm.json';
import updateCampaignForm from './json/updateCampaignForm.json';
import viewCampaignForm from './json/viewCampaignForm.json';
import { CustomButton } from '../../components/CustomControls';
import ManageParticipants from './components/manageParticipants';
import { useHistory } from 'react-router-dom';
import AppConsts from '../../lib/appconst';
import LocalizationKeys from '../../lib/localizationKeys';
import { FormModes } from '../../components/CustomForm';
import CustomCRUDComponent from '../../components/CustomCRUDComponent';
import CustomAdvanceFilter from '../../components/CustomWebControls/CustomAdvanceFilter/customAdvanceFilter';
import campaignAdvanceFilterForm from './json/campaignAdvanceFilterForm.json';
import utils from '../../utils/utils';

export interface ICampaignState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  campaignId: number;
  pageTitle: string;
  filter: string;
  sorting: string
}

const Search = Input.Search;

const Campaigns = (props: any) => {

  const initialState: ICampaignState = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    campaignId: 0,
    pageTitle: '',
    filter: '',
    sorting: ''
  };


  const { campaignsStore } = useAppStores();

  let params = [
    {
      key: "SelectFields",
      value: "Id,StartDate,EndDate,IsMainCampaign,Target,TargetAchieved,FK_Campaigns.Id_CampaignTranslation_CoreId_Name_name,FK_Campaigns.Id_CampaignTranslation_CoreId_Description_description"
    }
  ];


  // const [compState, setCompState] = useCompState(initialState);

  const [compState, setCompState] = useCompState({ parameters: params });

  const [campaigns] = useAppState(CampaignsStore.AppStateKeys.CAMPAIGNS, {});

  const history = useHistory();

  useEffect(() => {
    getAllCampaigns();
    // getAllProducts();
  }, [compState.filter]);

  const getAllCampaigns = async () => {
    return await campaignsStore.getAllCampaigns({
      maxResultCount: 500,//compState.maxResultCount,
      skipCount: 0,//compState.skipCount,
      keyword: compState.filter,
      sorting: compState.sorting
    });

  }

  const getAllCSVData = async () => {

    return await campaignsStore.getAllCSVData();

  }

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    compState.skipCount = (pagination.current - 1) * compState.maxResultCount!
    compState.sorting = sorter.field + " " + (sorter.order == "descend" ? "DESC" : "ASC")
    setCompState(compState);
    getAllCampaigns();
  };

  const displayModal = (isVisible: boolean, modelType?: string) => {

    if (modelType) {
      if (modelType == "Manage") {
        compState.formMode = FormModes.Edit;
      }
      else if (modelType == "View") {
        compState.formMode = FormModes.Display;
      }
    }
    // else {
    compState.modalVisible = isVisible;
    //}
    setCompState({ ...compState });

  };


  const openNewParticipantsPage = async (item: any, actionName: any) => {
    history.push(
      {
        pathname: "/campaigns/participants",
        state: { campaignId: item.id, pageTitle: item.name }
      }
    );
  }

  // start view editable form

  const [app, setFormState] = useCompState(false);


  // end view editable form

  const deleteCampaign = (item: any) => {
    let input: EntityDto = { id: item.id };
    Modal.confirm({
      title: L(LocalizationKeys.ERP_MsgConfirmDeleteRecord.key),
      onOk() {
        campaignsStore.delete(input);
      },
      onCancel() {
      },
    });
  }

  const handleCreate = async (values: any) => {
    if (compState.campaignId === 0) {
      await campaignsStore.create(values);
    } else {
      await campaignsStore.update({ ...values, id: compState.campaignId });
    }
    await getAllCampaigns();
    displayModal(false);
  };



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

  const columns = [
    { title: L(LocalizationKeys.ERP_LblName.key), dataIndex: 'name', sorter: true, key: 'name', width: 150, render: (text: string) => <div>{text}</div> },
    //{ title: L(LocalizationKeys.ERP_LblDescription.key), dataIndex: 'description', sorter: true, key: 'description', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblStartDate.key), dataIndex: 'startDate', sorter: true, key: 'startDate', width: 150, render: (text: string) => <div> {utils.formattedDate(text)} </div> },
    { title: L(LocalizationKeys.ERP_LblEndDate.key), dataIndex: 'endDate', sorter: true, key: 'endDate', width: 150, render: (text: string) => <div> {utils.formattedDate(text)} </div> },
    {
      title: L(LocalizationKeys.ERP_LblIsMainCampaign.key),
      dataIndex: 'isMainCampaign',
      sorter: true,
      key: 'isMainCampaign',
      width: 150,
      render: (text: boolean) => (text === true ? <Tag color="#2db7f5">{L(LocalizationKeys.ERP_LblYes.key)}</Tag> : <Tag color="red">{L(LocalizationKeys.ERP_LblNo.key)}</Tag>),
    },
    { title: L(LocalizationKeys.ERP_LblTarget.key), dataIndex: 'target', sorter: true, key: 'target', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblTargetAchieved.key), dataIndex: 'targetAchieved', sorter: true, key: 'targetAchieved', width: 150, render: (text: string) => <div>{text}</div> },

  ];

  let csvOptions = {
    "getCSVData": getAllCSVData,
    "headers": [{ label: L(LocalizationKeys.ERP_LblName.key), key: "name" },
    { label: L(LocalizationKeys.ERP_LblDescription.key), key: "description" },
    { label: L(LocalizationKeys.ERP_LblTarget.key), key: "target" },
    { label: L(LocalizationKeys.ERP_LblIsMainCampaign.key), key: "isMainCampaign" }],
    "fileName": "allCampaignsList.csv",
    "enableExport": true
  }

  let actionsItem = [
    {
      "actionName": L(AppConsts.actionNames.DELETE),
      "actionCallback": deleteCampaign,
      "appearance": CustomButton.appearances.Delete,
      "isVisible": (record: any) => {
        return (isGranted(AppConsts.permissionNames.Campaign_Delete))
      }
    },
    {
      "actionName": L(AppConsts.actionNames.UPDATE_CAMPAIGN),
      "actionCallback": openNewParticipantsPage,
      "appearance": CustomButton.appearances.UserGroup,
      "isVisible": (record: any) => {
        return (isGranted(AppConsts.permissionNames.Campaign_Participant))
      }
    }

  ];

  return (
    <div className="campaign-container">

      <Card className='card-grid'>

        <Row style={{ marginTop: 0 }}>
          <Col
            xs={{ span: 24, offset: 0 }}
            sm={{ span: 24, offset: 0 }}
            md={{ span: 24, offset: 0 }}
            lg={{ span: 24, offset: 0 }}
            xl={{ span: 24, offset: 0 }}
            xxl={{ span: 24, offset: 0 }}
          >

            <CustomCRUDComponent
              hideHeading={true}
              tableName="Campaigns"
              tableColumns={columns}
              parameters={compState.parameters}
              enableDownloadCsv={true}
              actionsList={actionsItem}
              enableSearch={false}
              formFields={createCampaignForm.formFields}
              formFieldsForEdit={updateCampaignForm.formFields}
              formFieldsForView={viewCampaignForm.formFields}
              refreshData={JSON.stringify(compState.parameters)}
              isWithTranslation={true}
              titleFieldName="name"
              modalTitle={L(LocalizationKeys.ERP_LblCampaign.key)}
              // newRecordCallBack={createOrUpdateModalOpen}
              translationTableName='CampaignTranslation'
              advanceFilterFields={campaignAdvanceFilterForm}
              enableAdvanceFilter={true}
              isEditVisible={isGranted(AppConsts.permissionNames.Campaign_Edit)}
              isNewRecordDisable={!isGranted(AppConsts.permissionNames.Campaign_Add)}
            />

          </Col>
        </Row>

        <ManageParticipants
          visible={compState.manageParticipantsModalVisible}
          onCancel={() => {
            displayModal(false);
            compState.campaignId = 0;
            setCompState({ ...compState });
          }}
          onCreate={handleCreate}
          campaignId={compState.campaignId}
        />

      </Card>
    </div>
  )
}

export default Campaigns;