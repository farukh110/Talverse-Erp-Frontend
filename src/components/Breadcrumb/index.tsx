import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Breadcrumb, Card } from "antd";
import utils from '../../utils/utils';
import './index.less';
import { HomeOutlined } from "@ant-design/icons";

const BreadCrumb = () => {

  const location = useLocation();
  const breadCrumbView = () => {
    const { pathname } = location;
    const pathnames = pathname.split("/").filter((item) => item);
    const capatilize = (s: any) => s.charAt(0).toUpperCase() + s.slice(1);
    const currentPageIcon = utils.getRoute(pathname)?.icon;
    return (
      <div>
        <Card className='bread-crumb-container'>
          {pathname != '/' && pathname != '/dashboard' && <Breadcrumb>
            {pathnames.length > 0 ? (
              <Breadcrumb.Item>
                <HomeOutlined />
                <Link to="/">Dashboard</Link>
              </Breadcrumb.Item>
            ) : (
              <Breadcrumb.Item>
                <HomeOutlined />
                Dashboard
              </Breadcrumb.Item>
            )}
            {pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;
              return isLast ? (
                <Breadcrumb.Item className="active-crumb" key={index}>
                  {utils.getPageTitle(routeTo)}
                </Breadcrumb.Item>
              ) : (
                <Breadcrumb.Item key={index}>
                  <Link to={`${routeTo}`}>
                    {utils.getPageTitle(routeTo)}</Link>
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
          }

          <h1 className="site-page-header">
            <span>{currentPageIcon?.render()}</span>
            {utils.getPageTitle(pathname)}
          </h1>
        </Card>
      </div>

    );
  };

  return <>{breadCrumbView()}</>;
};

export default BreadCrumb;
