import { L } from '../../lib/abpUtility';
import LocalizationKeys from '../../lib/localizationKeys';

const rules = {
  userNameOrEmailAddress: [
    {
      required: true,
      message: L(LocalizationKeys.ERP_Error_FieldThisFieldIsRequired.key),
    },
  ],
  password: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldThisFieldIsRequired.key) }],
  otp: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldThisFieldIsRequired.key) }],
  confirmPassword:  [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldThisFieldIsRequired.key) },
    { fieldToCompare: "newPassword", message: L(LocalizationKeys.ERP_Error_FieldPTwoPasswordsDoNotMatch.key), validator: (rule: any, value: any, callback: any)=> { } }],
};

export default rules;
