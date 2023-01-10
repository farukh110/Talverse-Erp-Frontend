import React from 'react';
import { Card, Col, Row } from 'antd';
import './index.less';
import CustomCRUDComponent from '../../components/CustomCRUDComponent';
export interface ICRUDViewProps {
  tableColumns?: any[];
  tableName?: string;
}
const CRUDView = (props: ICRUDViewProps) => {

  return (
    <div className='content-view'>
      <Card className='card-grid'>
        <Row>
          <Col
            xs={{ span: 24, offset: 0 }}
            sm={{ span: 24, offset: 0 }}
            md={{ span: 24, offset: 0 }}
            lg={{ span: 24, offset: 0 }}
            xl={{ span: 24, offset: 0 }}
            xxl={{ span: 24, offset: 0 }}
          >
            <CustomCRUDComponent />

          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default CRUDView;