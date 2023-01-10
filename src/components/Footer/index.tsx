import * as React from 'react';
import { Layout } from 'antd';
import './index.less';
const Footer = () => {
  
  const company = {
    name:" Talverse ",
    projectType: " ERP ",
    link: "https://talverse.com/",
    year: new Date().getFullYear()
  }

  return (
    <Layout.Footer className={'footer'} style={{ textAlign: 'center' }}>
      <a href={company.link}> { company.name } </a> { company.projectType } - © { company.year } 
    </Layout.Footer>
  );
};
export default Footer;
