import React, { useEffect, useRef } from 'react';

import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table, Tag } from 'antd';
import CreateOrUpdateUser from './components/createOrUpdateUser';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { useAppState, useAppStores, useCompState } from '../../hooks/appStoreHooks';
import { FormInstance } from 'antd/lib/form';
import UserStore from '../../stores/userStore';
import { CustomTable } from '../../components/CustomGrid';
import { CustomButton } from '../../components/CustomControls';
import LocalizationKeys from '../../lib/localizationKeys';
import AppConsts from '../../lib/appconst';


export interface IUserState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  userId: number;
  filter: string;
  sorting: string;
}

const confirm = Modal.confirm;
const Search = Input.Search;

const User = (props: any) => {
  const formRef = useRef<FormInstance>(null);

  const initialState: IUserState = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    userId: 0,
    filter: '',
    sorting: 'userName'
  };
  const {userStore} = useAppStores()
  const [compState, setCompState] = useCompState(initialState)
  const [users] = useAppState(UserStore.AppStateKeys.USERS, [])
  useEffect(() => {
    console.log("on load", compState)
    getAll();
  }, [compState.filter]);

  const getAll = async () => {

    return await userStore.getAll({
      maxResultCount: compState.maxResultCount,
      skipCount: compState.skipCount,
      keyword: compState.filter,
      sorting: compState.sorting
    });
  }

  const getAllCSVData = async () => {

    return await userStore.getAllCSVData();

  }

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    
    compState.skipCount = (pagination.current - 1) * compState.maxResultCount!
    compState.sorting = sorter && sorter.field ?  sorter.field + " " + (sorter.order == "descend" ? "DESC" : "ASC") : '';

    setCompState(compState);
    getAll();
  };

  const displayModal = (isVisible: boolean) => {
    compState.modalVisible = isVisible;
    setCompState({ ...compState });
  };

  const createOrUpdateModalOpen = async (entityDto: EntityDto) => {
    if (entityDto.id === 0) {
      await userStore.createUser();
      await userStore.getRoles();
    } else {
      await userStore.get(entityDto);
      await userStore.getRoles();
    }
    compState.userId = entityDto.id || 0
    setCompState({ ...compState });
    displayModal(true);

  }

  const deleteUser = (input: EntityDto) => {

    confirm({
      title: L(LocalizationKeys.ERP_MsgConfirmDeleteRecord.key),
      onOk() {
        userStore.delete(input);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const handleCreate = async (values:any) => {
      if (compState.userId === 0) {
        await userStore.create(values);
      } else {
        await userStore.update({ ...values, id: compState.userId });
      }

      await getAll();
      displayModal(false);
  };

  const handleSearch = (value: string) => {
    compState.filter = value;
    setCompState({ ...compState });
  };
  const columns = [
    { title: L(LocalizationKeys.ERP_LblUserName.key), dataIndex: 'userName', sorter: true, key: 'userName', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblFullName.key), dataIndex: 'name', sorter: true, key: 'name', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L(LocalizationKeys.ERP_LblEmailAddress.key), dataIndex: 'emailAddress', sorter: true, key: 'emailAddress', width: 150, render: (text: string) => <div>{text}</div> },
    {
      title: L(LocalizationKeys.ERP_LblIsActive.key),
      dataIndex: 'isActive',
      sorter: true,
      key: 'isActive',
      width: 150,
      render: (text: boolean) => (text === true ? <Tag className='btn-success'>{L(LocalizationKeys.ERP_LblYes.key)}</Tag> : <Tag color="red">{L(LocalizationKeys.ERP_LblNo.key)}</Tag>),
    },
    
  ];

  let csvOptions = {
    "getCSVData": getAllCSVData,
    "headers": [{ label: L(LocalizationKeys.ERP_LblUserName.key), key: "userName" },
    { label: L(LocalizationKeys.ERP_LblFullName.key), key: "name" },
    { label: L(LocalizationKeys.ERP_LblEmailAddress.key), key: "emailAddress" },
    { label: L(LocalizationKeys.ERP_LblIsActive.key), key: "isActive" }],
    "fileName": "allUsersList.csv",
    "enableExport": true
  }

  let tableOptions = {
    "rowKey": (record: any) => record.id.toString(),
    "bordered": true,
    "columns": columns,
    "pagination": { pageSize: 10, total: users === (undefined || null) ? 0 : users.totalCount, defaultCurrent: 1 },
    "loading": (users === undefined ? true : false),
    "dataSource": (users === (undefined || null) ? [] : users.items),
    "onChange": handleTableChange,
    "actionsList": [{
      "actionName": L(AppConsts.actionNames.EDIT),
      "actionCallback": createOrUpdateModalOpen,
      "appearance": CustomButton.appearances.Edit
    },
    {
      "actionName": L(AppConsts.actionNames.DELETE),
      "actionCallback": deleteUser,
      "appearance": CustomButton.appearances.Delete
    }],
    "getGridData": getAll,
    "enableSorting": true
  }

  let headerOptions = {
    "createOrUpdateModalOpen": createOrUpdateModalOpen,
    "enableButton": true
  }

  let searchOptions = {
    "onSearch": handleSearch,
    "placeholder": L(LocalizationKeys.ERP_LblFilter.key),
    "enableSearch": true
  }

  return (
    <>
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
            <CustomTable
              options={tableOptions}
              searchOptions={searchOptions}
              csvOptions={csvOptions}
              headerOptions={headerOptions}
            />
          </Col>
        </Row>
        <CreateOrUpdateUser
          visible={compState.modalVisible}
          onCancel={() => {
            displayModal(false);}}
          modalType={compState.userId === 0 ? 'edit' : 'create'}
          onCreate={handleCreate}
          roles={userStore.roles}
        />
      </Card>
    </>
  );
}

export default User;
