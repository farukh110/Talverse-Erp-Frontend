import { L } from '../../../lib/abpUtility';
import LocalizationKeys from '../../../lib/localizationKeys';

const step1Rules = {

  donorName: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldPleaseEnterDonorName.key) }],
  language: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldPleaseEnterDonorName.key) }],
  country: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldPleaseEnterDonorName.key) }],
  amount: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldPleaseEnterDonorName.key) }]
};

export default step1Rules;
