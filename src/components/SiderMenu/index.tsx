import './index.less';

import * as React from 'react';

import { Avatar, Col, Layout, Menu } from 'antd';
import { L, isGranted } from '../../lib/abpUtility';

import AbpLogo from '../../images/tv-logo.png';
import { appRouters } from '../../components/Router/router.config';
import utils from '../../utils/utils';
import SubMenu from 'antd/lib/menu/SubMenu';

const { Sider } = Layout;

export interface ISiderMenuProps {
  path: any;
  collapsed: boolean;
  onCollapse: any;
  history: any;
}

const SiderMenu = (props: ISiderMenuProps) => {
  const { collapsed, history, onCollapse } = props;
  const currentRoute = utils.getRoute(history.location.pathname);
  return (
    <Sider theme="light" trigger={null} className={'sidebar'} width={256} collapsible collapsed={collapsed} onCollapse={onCollapse}>
      {collapsed ? (
        <Col style={{ textAlign: 'center', marginTop: 15, marginBottom: 10 }}>
          <Avatar shape="square" style={{ height: 20, width: 64 }} src={AbpLogo} />
        </Col>
      ) : (
        <Col style={{ textAlign: 'center', marginTop: 15, marginBottom: 10 }}>
          <Avatar shape="square" style={{ height: 49, width: 157 }} src={AbpLogo} />
        </Col>
      )}

      {appRouters
        .filter((item: any) => !item.isLayout && item.showInMenu)
        .map((route: any, index: number) => {
          if (route.permission && !isGranted(route.permission)) return null;
          if (route.childRoutes) {
            return (
              <Menu key={index} theme="light" mode="inline" selectedKeys={[currentRoute ? currentRoute.path : '']} defaultOpenKeys={[`sub1${index}`]}  >
                <SubMenu key={`sub1${index}`} icon={<route.icon />} title={route.title}>
                  {route.childRoutes
                    .filter((subItem: any) => !subItem.isLayout && subItem.showInMenu)
                    .map((subRoute: any, subIndex: number) => {
                      if (subRoute.permission && !isGranted(subRoute.permission)) return null;
                      return (
                        <Menu.Item key={subRoute.path} onClick={() => history.push(subRoute.path)}>
                          <subRoute.icon />
                          <span>{L(subRoute.title)}</span>
                        </Menu.Item>
                      );
                    })}
                </SubMenu>
              </Menu>
            );
          }
          else {
            return (
              <Menu key={index} theme="light" mode="inline" selectedKeys={[currentRoute ? currentRoute.path : '']}   >
                <Menu.Item key={route.path} onClick={() => history.push(route.path)}>
                  <route.icon />
                  <span>{L(route.title)}</span>
                </Menu.Item>
              </Menu>
            );
          }
        })}
    </Sider>
  );
};

export default SiderMenu;
