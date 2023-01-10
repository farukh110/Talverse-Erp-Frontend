import React from 'react';
import { L } from '../../../lib/abpUtility';
import './index.less';

const CustomHeading = (props: any) => {
    return (
        <>
            <h4 className="heading-text">
                
                {L(props.headingText)}
                
                </h4>
        </>
    )
}

export default CustomHeading;
