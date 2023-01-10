import React, { useRef } from 'react';
import { CustomButton } from '../../CustomControls';
import { CSVLink } from "react-csv";
import { useCompState } from '../../../hooks/appStoreHooks';
import { L } from '../../../lib/abpUtility';
import './downloadCSV.less';
import { Tooltip } from 'antd';
import LocalizationKeys from '../../../lib/localizationKeys';

const DownloadCSV = (props: any) => {

    const csvLink: any = useRef(null);

    const { fileName, getCSVData, headers, enableExport } = props != null ? props.csvOptions : { fileName: "", getCSVData: null, headers: null, enableExport: false };

    const [csvData, setCSVData] = useCompState([]);

    const downloadCSV = async () => {

        let data = await getCSVData();
        if (data) {
            setCSVData(data);
            csvLink.current.link.click();
        }
    }

    return (
        <>
            {
                enableExport &&
                <>
                    <Tooltip title={L(LocalizationKeys.ERP_LblDownloadCSV.key)} >
                    <CustomButton appearance={CustomButton.appearances.Download} className="align-right btn-grape" onClick={downloadCSV} title={L(LocalizationKeys.ERP_LblDownloadCSV.key)}></CustomButton>
                    </Tooltip>
            
                    <CSVLink ref={csvLink}
                        headers={headers}
                        filename={fileName ? fileName : ""}
                        data={csvData}
                    />
                </>
            }
        </>
    )
}
export default DownloadCSV;
