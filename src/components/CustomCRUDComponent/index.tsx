import React, { useEffect, useRef } from 'react';
import { Card, Col, Input, Modal, Row, Tag, Tooltip } from 'antd';

import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import { useAppStores, useCompState } from '../../hooks/appStoreHooks';
import { CustomTable } from '../CustomGrid';
import { CustomButton, CustomModal } from '../CustomControls';
import FormView from './components/formView';
import { ContentRequestDto, SavedRequestDto } from '../../services/Content/dto/contentRequestDto';
import utils from '../../utils/utils';
import AppConsts from '../../lib/appconst';
import { FormModes } from '../CustomForm';
import ReactJson from 'react-json-view';
import './index.less';
import LocalizationKeys from '../../lib/localizationKeys';

export interface ICustomCRUDProps {
  tableColumns?: any[];
  tableName?: string;
  formFields?: any[];
  actionsList?: any[];
  overrideActions?: boolean;
  isNewRecordDisable?: boolean;
  tableHeading?: string;
  enableSearch?: boolean;
  enableDownloadCsv?: boolean;
  parameters?: any[];
  hideHeading?: boolean;
  className?: any;
  refreshData?: any;
  translationTableName?: string;
  isWithTranslation?: boolean;
  newRecordCallBack?: any;
  formFieldsForEdit?: any[];
  formFieldsForView?: any[];
  customDataSource?: string;
  modalWidth?: any;
  titleFieldName?: string;
  modalTitle?: string;
  advanceFilterFields?: any;
  enableAdvanceFilter?: boolean;
  isEditVisible?: boolean;
  isViewVisible?: boolean;
}

const confirm = Modal.confirm;
const Search = Input.Search;

const CustomCRUDComponent = (props: ICustomCRUDProps) => {

  let { tableName, tableColumns, formFields, actionsList, overrideActions, isNewRecordDisable, tableHeading, enableSearch, enableDownloadCsv, parameters, hideHeading, translationTableName, isWithTranslation, refreshData, newRecordCallBack, formFieldsForEdit, formFieldsForView, customDataSource, modalWidth, titleFieldName, modalTitle, advanceFilterFields, enableAdvanceFilter, isEditVisible, isViewVisible } = props;

  const { contentStore } = useAppStores();
  const [compState, setCompState] = useCompState({ columns: [], formFields: {}, formFieldsForEdit: {}, formFieldsForView: {} });
  const [compData, setCompData] = useCompState([]);
  const [isCustomFormFields, setIsCustomFormFields] = useCompState(false);

  const [jsonContent, setJSONContent] = useCompState(null);
  const [popupHeading, setHeading] = useCompState('');

  //console.log(" comp State in custom crud comp ::::::::: ", JSON.stringify(compState.formFields.formFields));

  const [gridOption, setGridOption] = useCompState({
    maxResultCount: 10,
    skipCount: 0,
    filter: '',
    sorting: 'Id DESC'
  });

  if (!tableName)
    tableName = window.location.search.split('q=')[1];//if no table name provided then check in query string param
  const isJSON = (text: any) => {
    if (typeof text !== "string") {
      return false;
    }
    try {
      var json = JSON.parse(text);
      return (typeof json === 'object');
    }
    catch (error) {
      return false;
    }
  }
  const getTextFieldRenderer = (text: any, heading: any) => {
    try {
      if (isJSON(text)) {
        let jsonContent = JSON.parse(text);

        return (
          <Tooltip placement="top" title={L(LocalizationKeys.ERP_LblViewDetails.key)}>
            <CustomButton appearance={CustomButton.appearances.View}
              onClick={() => { setJSONContent(jsonContent); setHeading(heading); }}>
            </CustomButton>
          </Tooltip>)
      }
    }
    catch (err) {

      console.log(`error:${err}`);
    }
    return text;
  }

  const onLoad = async () => {
    let requestObj: ContentRequestDto = {
      ComponentIdOrName: 'CRUDComponent',
      Parameters: [{
        key: 'TableName',
        value: tableName
      }]
    }

    let comp = await contentStore.GetComponent(requestObj);

    if (comp) {
      if (formFields && formFields.length > 0) {
        comp.formFields = formFields;
        setIsCustomFormFields(true);
      }

      //get all date fields
      comp.columns = comp.columns.map((col: any) => {

        const itemField = comp.formFields.find((field: any) =>
          field.internalName == col.dataIndex && (field.type == "DatePicker" || "Checkbox" || "Text")
        );

        switch (itemField?.type) {

          case "DatePicker":
            col.render = (text: boolean) => <div> {utils.formattedDate(text)} </div>;
            break;

          case "Checkbox":
            col.render = (text: boolean) => (text === true ? <Tag color="#2db7f5">{L(LocalizationKeys.ERP_LblYes.key)}</Tag> : <Tag color="red">{L(LocalizationKeys.ERP_LblNo.key)}</Tag>);
            break;

          case "Multiline":
          case "Text":
            try {
              col.render = (text: boolean) => getTextFieldRenderer(text, itemField.displayName);

            } catch (ex) {
              console.log(`error:${ex}`);
            }

            break;

          default:
            break;
        }
        return col;
      });

      if (!tableColumns) {
        tableColumns = comp.columns;
      }

      setCompState({ columns: tableColumns, formFields: { "formFields": comp.formFields }, defaultFormFields: { "formFields": comp.formFields.map((object: any) => ({ ...object })) } });

    }

    //getAllData();
  }
  useEffect(() => {
    onLoad();
  }, []);
  useEffect(() => {
    getAllData();
  }, [refreshData]);


  useEffect(() => {
    getAllData();
  }, [gridOption.filter]);

  const handleOk = () => {
    setJSONContent(null);
  };

  const handleCancel = () => {
    setJSONContent(null);
  };

  const getAllData = async () => {
    let params = [{
      key: 'Table',
      value: tableName
    }, {
      key: "SkipCount",
      value: gridOption.skipCount
    },
    {
      key: "Sorting",
      value: gridOption.sorting
    },
    {
      key: "MaxResultCount",
      value: gridOption.maxResultCount
    }];
    if (gridOption.filter)
      params.push({
        key: "SearchText",
        value: `%${gridOption.filter}%`
      });
    let requestObj: ContentRequestDto = {
      ComponentIdOrName: customDataSource || 'GetAllPagedData',
      Parameters: params
    };

    if (parameters) {
      requestObj.Parameters = [...requestObj.Parameters, ...parameters]
    }


    const dataList = await contentStore.GetComponentData(requestObj);
    setCompData(dataList);
  }

  // end get all data

  // start get data

  const getItemData = async (id: any) => {

    let parameters = [{
      key: 'Id',
      value: id
    },
    {
      key: 'Table',
      value: tableName
    }];

    if (isWithTranslation && isWithTranslation == true) {
      parameters.push(
        {
          key: 'TranslationTable',
          value: translationTableName
        });
    }

    let requestObj: ContentRequestDto = {

      ComponentIdOrName: 'GetData',
      Parameters: parameters
    }
    var formData = (isWithTranslation && isWithTranslation == true) ? await contentStore.GetComponentDataWithTranslations(requestObj) : await contentStore.GetComponentData(requestObj);

    if (formData != undefined && formData.id != 0) {

      Object.keys(formData).forEach(function (key) {

        let field = compState.formFields.formFields.find((item: any) => item.internalName == key);
        if (field)
          field.defaultValue = formData[key];
      });

      setCompState({ ...compState });
    }
    //setCompData(dataList);
  }

  // end get data

  // start reset form

  const resetForm = () => {
    try {
      compState.formFields = compState.defaultFormFields;
      compState.formMode = FormModes.Add;
      setCompState({ ...compState });
    }
    catch (e) {

      console.log(`form reset failed: ${e}`);
    }

  }

  // end reset form

  // start get all csv

  const getAllCSVData = async () => {

    return null;//await productsStore.getAllCSVData();

  }

  // end get all csv

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    gridOption.maxResultCount = pagination.pageSize;
    gridOption.skipCount = (pagination.current - 1) * gridOption.maxResultCount!
    gridOption.sorting = sorter && sorter.field ? sorter.field + " " + (sorter.order == "descend" ? "DESC" : "ASC") : '';
    setGridOption(gridOption);
    getAllData();
  };

  const displayModal = (isVisible: boolean) => {
    compState.modalVisible = isVisible;
    setCompState({ ...compState });
  };

  const getDynamicTitle = (item: any) => {
    let title = "";
    if (titleFieldName && item) {
      title = item[titleFieldName] ? ` : ${item[titleFieldName]}` : "";
    }
    return `${compState.formMode == FormModes.Display ? "View" : compState.formMode}${modalTitle ? " " + modalTitle : " "}${title}`;
  }

  const createOrUpdateModalOpen = async (item: any, actionName?: any) => {

    let entityDto: EntityDto = { id: item?.id || 0 };
    switch (actionName) {
      case L(AppConsts.actionNames.EDIT):
        compState.formMode = FormModes.Edit;
        if (formFieldsForEdit != null)
          compState.formFields = { "formFields": formFieldsForEdit };
        break;
      case L(AppConsts.actionNames.DETAIL_VIEW):
        compState.formMode = FormModes.Display;
        if (formFieldsForView != null)
          compState.formFields = { "formFields": formFieldsForView };
        break;
      default:
        resetForm();
    }
    setHeading(getDynamicTitle(item));
    if (entityDto.id > 0) {
      await getItemData(entityDto.id);
    }

    displayModal(true);
    setTimeout(() => {
      // formRef.current!.setFieldsValue({ ...campaignsStore.editUser });
    }, 100);
  }
  // start save and update data

  const handleSave = async (values: any, actionName?: any) => {

    try {
      let parameters: any[] = [];
      compState.formFields.formFields.map((field: any) => {
        if (field.visible == false) {
          parameters.push({ "key": field.internalName, "Value": field.defaultValue });
        }
      });
      for (let [key, value] of Object.entries(values)) {
        if (key != "translations" || (key == "translations" && isWithTranslation)) {
          if (key == "translations" && isWithTranslation) {
            value = JSON.stringify(value, function (key, tvalue) { return (tvalue === undefined) ? "" : tvalue });
          }
          parameters.push({ "key": key, "Value": value });
        }
      }

      let requestObj: SavedRequestDto = {
        tableName: tableName || "",
        translationTableName: translationTableName || "",
        Parameters: parameters
      }

      await contentStore.createNewComponent(requestObj);

    } catch (err) {
      console.log(`error:${err}`);
    }
    await getAllData();
    displayModal(false);
  };

  // end save and update data

  const handleSearch = (value: string) => {

    if (enableAdvanceFilter) { // if searching is being done through advace filter
      if (parameters && parameters.length > 0) { 
        let exist = parameters.find((item: any) => item.key == 'QueryFilters'); // checking if Queryfilter key already exists in parameter or not 
        if (value) { // if search string has some value
          gridOption.skipCount = 0; // setting skip count to 0 to get top results when filter applied
          if (exist) {
            exist.value = value // replacing existing value with current value of filter 
          }
          else { // pushing QueryFilter parameter when key does not exist
            parameters.push(
              {
                "key": "QueryFilters",
                "value": value
              });
          }
        }
        else { // removing Query Filter when search string is empty
          if (exist) {
            let index = parameters.findIndex((item: any) => item.key == 'QueryFilters');
            parameters.splice(index, 1);
          }
        }
      }
      setGridOption({ ...gridOption });
      getAllData();
    }
    else { // when search is being run in default text box i.e 'ant d ' search bar
      gridOption.filter = value;
      setGridOption({ ...gridOption });
    }


  };


  let csvOptions = {
    "getCSVData": getAllCSVData,
    "headers": [
      { label: "Name", key: "name" },
      { label: "Amount", key: "amount" },
      { label: "Code", key: "code" },
      { label: "Unit Name", key: "unitName" }],
    "fileName": "allProductsList.csv",
    "enableExport": enableDownloadCsv != undefined ? enableDownloadCsv : true
  }
  let defaultActions = [{
    "actionName": L(AppConsts.actionNames.EDIT),
    "actionCallback": createOrUpdateModalOpen,
    "appearance": CustomButton.appearances.Edit,
    "isVisible": () => { return isEditVisible != undefined ? isEditVisible : true }
  },
  {
    "actionName": L(AppConsts.actionNames.DETAIL_VIEW),
    "actionCallback": createOrUpdateModalOpen,
    "appearance": CustomButton.appearances.Detail,
    "isVisible": () => { return isViewVisible != undefined ? isViewVisible : true }
  }
  ];

  defaultActions = !overrideActions && actionsList ? [...defaultActions, ...actionsList] : overrideActions ? actionsList! : defaultActions;
  let tableOptions = {
    "rowKey": (record: any) => record.id.toString(),
    "bordered": true,
    "columns": compState.columns,
    "pagination": { pageSize: gridOption.maxResultCount, total: compData === (undefined || null) ? 0 : compData.totalCount, defaultCurrent: 1 },
    "loading": (compData === undefined ? true : false),
    "dataSource": (compData === (undefined || null) ? [] : compData.items),
    "onChange": handleTableChange,
    "actionsList": defaultActions,
    "enableSorting": true,

  }

  const initialName = tableName;
  const seperatedResult = initialName.replace(/([A-Z])/g, " $1");
  const finalResult = seperatedResult.charAt(0).toUpperCase() + seperatedResult.slice(1);

  let headerOptions = {
    "createOrUpdateModalOpen": newRecordCallBack && typeof (newRecordCallBack) == 'function' ? newRecordCallBack : createOrUpdateModalOpen,
    "headerTitle": hideHeading && hideHeading == true ? '' : tableHeading ? tableHeading : finalResult,
    "enableButton": isNewRecordDisable ? false : true
  }

  let searchOptions = {
    "onSearch": handleSearch,
    "placeholder": L(LocalizationKeys.ERP_LblFilter.key),
    "enableSearch": enableSearch != undefined ? enableSearch : true,
    "advanceFilterFields": advanceFilterFields,
    "enableAdvanceSearch": enableAdvanceFilter != undefined ? enableAdvanceFilter : false
  }

  let modalOptions = {

    "visible": jsonContent != null,
    "width": '60%',
    "height": '400px',
    "title": L(popupHeading.replace(/([a-z])([A-Z])/g, '$1 $2')),
    "destroyOnClose": true,
    "onCancel": handleCancel,
    "onOk": handleOk,
    "okText": L(LocalizationKeys.ERP_LblClose.key),
    "theme": "danger"

  }
  return (
    <div className='custom-crud-container'>

      <Card bordered={false}>

        <Row>
          <Col
            xs={{ span: 24, offset: 0 }}
            sm={{ span: 24, offset: 0 }}
            md={{ span: 24, offset: 0 }}
            lg={{ span: 24, offset: 0 }}
            xl={{ span: 24, offset: 0 }}
            xxl={{ span: 24, offset: 0 }}
          >

            <CustomTable
              options={tableOptions}
              searchOptions={searchOptions}
              csvOptions={csvOptions}
              headerOptions={headerOptions}
            />

          </Col>
        </Row>

        <FormView
          visible={compState.modalVisible}
          onCancel={() => {
            displayModal(false);
          }}
          formFields={compState.formFields}
          formMode={compState.formMode}
          popupHeading={popupHeading}
          onCreate={handleSave}
          modalWidth={modalWidth}
          isCustomFormFields={isCustomFormFields}
        />

        <CustomModal
          bodyStyle={{ overflow: 'auto' }}
          className="custom-modal"
          {...modalOptions}>

          <ReactJson
            name={false}
            src={jsonContent}
            onEdit={false}
            onAdd={false}
            onDelete={false}
            enableClipboard={true}
            collapsed={1}
            iconStyle="circle" />
        </CustomModal>

      </Card>
    </div>
  )
}

export default CustomCRUDComponent;