import * as React from 'react';
import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table, Tag, Tooltip } from 'antd';
import { L } from '../../lib/abpUtility';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import DownloadCSV from './components/downloadCSV';
import { CustomButton, CustomCol, CustomRow } from '../CustomControls';
import SearchBar from '../CustomControls/components/searchBar';
import './index.less';
import LocalizationKeys from '../../lib/localizationKeys';
import { useCompState } from '../../hooks/appStoreHooks';
import CustomAdvanceFilter from '../CustomWebControls/CustomAdvanceFilter/customAdvanceFilter';


export const CustomTable = (props: any) => {

  let { options, csvOptions, searchOptions, headerOptions, getTableRowCSS } = props;
  let { columns, rowKey, bordered, pagination, loading, dataSource, onChange, actionsList } = options;
  let labelCount = pagination?.total ? `${L(LocalizationKeys.ERP_LblTotalCount.key)} : ${pagination?.total}` : null;
  let { onSearch, enableAdvanceSearch, advanceFilterFields } = searchOptions;

  const [gridPagination, setGridPagination] = useCompState(pagination);

  React.useEffect(() => {
    if (pagination) {
      gridPagination.total = pagination.total;
      setGridPagination({ ...gridPagination });
    }
  }, [dataSource]);


  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (onChange && typeof (onChange) == 'function')
      onChange(pagination, filters, sorter);
    setGridPagination(pagination);
  };

  const handleSearch = (value: string) => {
    if (gridPagination) {
      gridPagination.current = 1;
      setGridPagination({ ...gridPagination });
    }
    if (onSearch && typeof (onSearch) == 'function') {
      onSearch(value);
    }

  };

  if (actionsList && actionsList.length > 0) {
    columns.push({
      title: L(LocalizationKeys.ERP_LblActions.key),
      width: 180,
      fixed: 'right',
      render: (text: string, item: any) => (
        <div>
          {
            actionsList.map((action: any, index: any) => (
              (action.isVisible && action.isVisible(item) || !action.isVisible) && <Tooltip key={index} title={L(action.actionName)}><CustomButton title={L(action.actionName)} appearance={action.appearance} className="btn-action" key={index} onClick={() => action.actionCallback(item, action.actionName)}>
              </CustomButton></Tooltip>
            ))
          }
        </div>
      ),
    })
  }
  return (
    <>
      <div className="custom-grid-wrapper">

        {headerOptions.headerTitle && <h2>{L(headerOptions.headerTitle)}</h2>}


        {advanceFilterFields && enableAdvanceSearch && <CustomAdvanceFilter
          advanceFilterFields={advanceFilterFields}
          onSearch={handleSearch} />}

        <CustomRow>
          <CustomCol
            className="search-bar-col"
            xxl={{ span: 10, offset: 0 }}
            xl={{ span: 10, offset: 0 }}
            lg={{ span: 10, offset: 0 }}
            md={{ span: 10, offset: 0 }}
            sm={{ span: 10, offset: 0 }}
            xs={{ span: 10, offset: 0 }}>

            {searchOptions.enableSearch && <SearchBar searchOptions={searchOptions} />}
          </CustomCol>

          <CustomCol xxl={{ span: 14, offset: 0 }}
            xl={{ span: 14, offset: 0 }}
            lg={{ span: 14, offset: 0 }}
            md={{ span: 14, offset: 0 }}
            sm={{ span: 14, offset: 0 }}
            xs={{ span: 14, offset: 0 }}>

            <div className='tool-actions'>

              {csvOptions && !csvOptions.customCsv &&

                <DownloadCSV csvOptions={csvOptions}></DownloadCSV>
              }
              {csvOptions && csvOptions.customCsv &&
                <Tooltip title={L(LocalizationKeys.ERP_LblDownloadCSV.key)} >
                  <CustomButton appearance={CustomButton.appearances.Download} className="align-right btn-grape" onClick={csvOptions.downloadCSV} title={L(LocalizationKeys.ERP_LblDownloadCSV.key)}></CustomButton>
                </Tooltip>
              }
              <Tooltip title={L(LocalizationKeys.ERP_LblCreate.key)}>

                <Button
                  type="primary"
                  shape="circle"
                  className="create-item"
                  icon={<PlusOutlined />}
                  hidden={!headerOptions.enableButton}
                  onClick={headerOptions.createOrUpdateModalOpen} />

              </Tooltip>

            </div>

          </CustomCol>

        </CustomRow>

        <CustomRow>

          <CustomCol
            xs={{ span: 24, offset: 0 }}
            sm={{ span: 24, offset: 0 }}
            md={{ span: 24, offset: 0 }}
            lg={{ span: 24, offset: 0 }}
            xl={{ span: 24, offset: 0 }}
            xxl={{ span: 24, offset: 0 }}>
            {labelCount &&

              <h4 className='label-count'> {labelCount} </h4>
            }
            <Table
              rowKey={rowKey}
              bordered={bordered}
              columns={columns}
              pagination={gridPagination}
              loading={loading}
              dataSource={dataSource}
              onChange={handleTableChange}
              rowClassName={(record) => getTableRowCSS != undefined && typeof (getTableRowCSS) == 'function' ? getTableRowCSS(record) : null}
              className="custom-grid"
              scroll={{ x: 'max-content' }}
            />
          </CustomCol>

        </CustomRow>
      </div>
    </>
  )
}
