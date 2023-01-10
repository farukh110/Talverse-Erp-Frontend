import { L } from '../../../lib/abpUtility';
import LocalizationKeys from '../../../lib/localizationKeys';

const rules = {
  startDate: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldThisFieldIsRequired.key) }],
  endDate: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldThisFieldIsRequired.key) }],
  target: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldThisFieldIsRequired.key) }],
  displayOrder: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldThisFieldIsRequired.key) }],
  isMainCampaign: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldThisFieldIsRequired.key) }],
  isTargetAchieved: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldThisFieldIsRequired.key) }],
  products: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldThisFieldIsRequired.key) }],
  
  emailAddress: [
    { required: true, message: L(LocalizationKeys.ERP_Error_FieldThisFieldIsRequired.key) },
    {
      type: 'email',
      message: L(LocalizationKeys.ERP_Error_FieldValidEmail.key),
    },
  ],
};

export default rules;
