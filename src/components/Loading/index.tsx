import * as React from 'react';
import { Spin } from 'antd';
import './index.less';

const Loading = (props: any) => {

  const { spinning } = props;

  return (
    <div>
      <Spin className='custom-loader' spinning={spinning} size="large">
        {props.children}
      </Spin>
    </div>)
};

export default Loading;
