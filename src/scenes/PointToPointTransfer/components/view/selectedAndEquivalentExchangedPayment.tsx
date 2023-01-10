import { Card } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { CustomCol, CustomRow } from '../../../../components/CustomControls';
import CustomHeading from '../../../../components/CustomWebControls/CustomHeading';
import { L } from '../../../../lib/abpUtility';
import LocalizationKeys from '../../../../lib/localizationKeys';
import TransferStore from '../../../../stores/transferStore';
import PaymentListRenderer from '../Step3/PaymentListRenderer';



export interface ISelectedAndEquivalentExchangedPaymentProps {
  visible?: boolean;
  data: any;

}
const SelectedAndEquivalentExchangedPayment = (props: ISelectedAndEquivalentExchangedPaymentProps) => {
  const { data } = props;

  let paymentCol = 12;
  
  return (
    <>
      <CustomHeading headingText={L(LocalizationKeys.ERP_HdrSelectedAndEquivalentExchangedPayment.key) }></CustomHeading>

      <CustomRow gutter={[16, 16]}>
        <CustomCol
          xl={{ span: 12 }}
          md={{ span: 12 }}
          sm={{ span: 12 }}
          xs={{ span: 24 }}>

          <Card bodyStyle={{ height: '150px', minHeight: '150px', overflow: 'auto' }} 
          className="custom-card select-payment selected-payments-total payment-content"
            title={L(LocalizationKeys.ERP_LblSelectedPaymentsTotal.key)}>
            <PaymentListRenderer
            colWith={paymentCol}
              transferDetails={data.packageContents && data.packageContents.map((item: any) => {
                return {
                  amount: item.amount,
                  currency: data.currencyList.find((cur: any) => cur.code == item.currency)?.symbol
                }
              })}
              currencies={data.currencyList} />
          </Card>
        </CustomCol>
        <CustomCol

          xl={{ span: 12 }}
          md={{ span: 12 }}
          sm={{ span: 12 }}
          xs={{ span: 24 }}>

          <Card bodyStyle={{ height: '150px', minHeight: '150px', overflow: 'auto' }} 
          className="custom-card payment-content" 
          title={L(LocalizationKeys.ERP_LblEquivalentCurrencyAndAmount.key)}>
            <PaymentListRenderer colWith={paymentCol} transferDetails={data.transferDetails} currencies={data.currencyList} />
          </Card>
        </CustomCol>
      </CustomRow>


    </>
  )



}
export default SelectedAndEquivalentExchangedPayment;