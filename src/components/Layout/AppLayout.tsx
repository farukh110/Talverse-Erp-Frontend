import './AppLayout.less';

import React, { useState } from 'react';

import { Redirect, Switch, Route } from 'react-router-dom';

import DocumentTitle from 'react-document-title';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { Card, Layout } from 'antd';
import ProtectedRoute from '../../components/Router/ProtectedRoute';
import SiderMenu from '../../components/SiderMenu';
import { appRouters } from '../Router/router.config';
import utils from '../../utils/utils';
import NotFoundRoute from '../Router/NotFoundRoute';
import BreadCrumb from '../Breadcrumb';

const { Content } = Layout;
const AppLayout = (props: any) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const onCollapse = (collapsed: any) => {
    setCollapsed(collapsed);
  };

  const {
    history,
    location: { pathname },
  } = props;
let flatRoutes:any = [];
appRouters.forEach((route:any) => {
flatRoutes.push(route);
if(route.childRoutes){
  route.childRoutes.forEach((cRoute:any) => {
    flatRoutes.push(cRoute)
  });
}
});
  const { path } = props.match;
  const layout = (
    <Layout style={{ minHeight: '100vh' }}>
      <SiderMenu path={path} onCollapse={onCollapse} history={history} collapsed={collapsed} />
      <Layout>
        <Layout.Header style={{ background: '#fff', minHeight: 52, padding: 0 }}>
          <Header collapsed={collapsed} toggle={toggle} />
        </Layout.Header>

        <Content style={{ margin: 16 }}>
          <BreadCrumb />
          <Switch>
            {pathname === '/' && <Redirect from="/" to="/dashboard" />}
            {flatRoutes
              .filter((item: any) => !item.isLayout)
              .map((route: any, index: any) => (
                <Route
                  exact
                  key={index}
                  path={route.path}
                  render={(props) => <ProtectedRoute pathname={'test'} component={route.component} permission={route.permission}
                  />}
                />
              ))}
            {pathname !== '/' && <NotFoundRoute />}
          </Switch>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );

  return <DocumentTitle title={utils.getPageTitle(pathname)}>{layout}</DocumentTitle>;

};
export default AppLayout;