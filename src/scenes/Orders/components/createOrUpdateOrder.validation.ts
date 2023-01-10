import { L } from '../../../lib/abpUtility';
import LocalizationKeys from '../../../lib/localizationKeys';

const rules = {
  required: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldThisFieldIsRequired.key) }],
  emailAddress: [
    { required: true, message: L(LocalizationKeys.ERP_Error_FieldThisFieldIsRequired.key) },
    {
      type: 'email',
      message: L(LocalizationKeys.ERP_Error_FieldValidEmail.key),
    },
  ],
  Donor: [
    {
      "name": "RequiredFieldValidation",
      "options": [
        {
          "key": "isRequired",
          "value": true,
          "validationMessage": "ERP_Error_FieldPleaseSelectSupporter"
        }
      ]
    }
  ]
};
export default rules;