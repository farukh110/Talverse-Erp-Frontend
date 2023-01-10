import * as React from 'react';
import './index.less';

import { Avatar, Badge, Col, Dropdown, Menu, Row } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined, PoweroffOutlined, GlobalOutlined, UserOutlined } from '@ant-design/icons';

import { L } from '../../lib/abpUtility';
import LanguageSelect from '../LanguageSelect';
import { Link } from 'react-router-dom';
import { useAppState, useCompState } from '../../hooks/appStoreHooks'
import profilePicture from '../../images/user.png';
import SessionStore from '../../stores/sessionStore';
import LocalizationKeys from '../../lib/localizationKeys';
import LoadableComponent from '../Loadable';
import { useHistory } from 'react-router-dom';

export interface IHeaderProps {
  collapsed?: any;
  toggle?: any;
}

const userDropdownMenu = (
  <Menu>
    <Menu.Item key="2">
      <Link to="/logout">
        <LogoutOutlined />
        <span> {L(LocalizationKeys.ERP_LblLogout.key)}</span>
      </Link>
    </Menu.Item>
  </Menu>
);

declare var abp: any;

const Header = (props: IHeaderProps) => {
  const [currentLoginInfo] = useAppState(SessionStore.AppStateKeys.CURRENT_LOGIN);

  const history = useHistory();
  const profileMenu = (
    <Menu className={'menu'} >
      <Menu.Item key={1} onClick={() => {
        history.push(
          {
            pathname: "/profile",
          }
        );
      }}>
        <i ><UserOutlined /> </i> {L(LocalizationKeys.ERP_HdrProfile.key)}
      </Menu.Item>
    </Menu>
  );
  return (
    <Row className={'header-container'}>
      <Col style={{ textAlign: 'left' }}
        xs={{ span: 7, offset: 0 }}
        sm={{ span: 12, offset: 0 }}
        md={{ span: 12, offset: 0 }}
        lg={{ span: 12, offset: 0 }}
        xl={{ span: 12, offset: 0 }}
        xxl={{ span: 12, offset: 0 }}
      >
        {props.collapsed ? (
          <MenuUnfoldOutlined className="trigger" onClick={props.toggle} />
        ) : (
          <MenuFoldOutlined className="trigger" onClick={props.toggle} />
        )}
      </Col>
      <Col style={{ padding: '0px 15px 0px 15px', textAlign: 'right' }}

        xs={{ span: 16, offset: 0 }}
        sm={{ span: 12, offset: 0 }}
        md={{ span: 12, offset: 0 }}
        lg={{ span: 12, offset: 0 }}
        xl={{ span: 12, offset: 0 }}
        xxl={{ span: 12, offset: 0 }}
      >
        {currentLoginInfo &&
          currentLoginInfo.user && currentLoginInfo.user.name &&
          <>
            <Dropdown overlay={profileMenu} placement="bottomRight">
              <label className='current-login-info'> <UserOutlined /> {currentLoginInfo.user.name}
              </label>
            </Dropdown>
            {/* <span className='menu-sep-line'> | </span> */}
          </>
        }
        <span className='menu-sep-line'> | </span>
        {'   '}<LanguageSelect /> {'   '}

        <Link className='logout-profile' to="/logout">
          <PoweroffOutlined />
          <span> {L(LocalizationKeys.ERP_LblLogout.key)}</span>
        </Link>

      </Col>
    </Row >
  );
};
export default Header;