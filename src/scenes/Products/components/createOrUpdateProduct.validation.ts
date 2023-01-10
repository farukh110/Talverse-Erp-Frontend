import { L } from '../../../lib/abpUtility';
import LocalizationKeys from '../../../lib/localizationKeys';

const rules = {
  name: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldThisFieldIsRequired.key) }],
  surname: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldThisFieldIsRequired.key) }],
  userName: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldThisFieldIsRequired.key) }],
  emailAddress: [
    { required: true, message: L(LocalizationKeys.ERP_Error_FieldThisFieldIsRequired.key) },
    {
      type: 'email',
      message: L(LocalizationKeys.ERP_Error_FieldValidEmail.key),
    },
  ],
};

export default rules;
