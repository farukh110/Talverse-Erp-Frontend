import { L } from '../../../../lib/abpUtility';
import LocalizationKeys from '../../../../lib/localizationKeys';

const step3Rules = {
  fromCurrency: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldPleaseSelectCurrency.key) }],
  firstAmount: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldPleaseEnterAmount.key) }],
  toCurrency: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldPleaseSelectCurrency.key) }],
  secondAmount: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldPleaseEnterAmount.key) }],
  rate: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldPleaseEnterRate.key) }],
};
export default step3Rules;