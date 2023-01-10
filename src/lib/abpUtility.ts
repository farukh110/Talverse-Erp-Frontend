import AppConsts from './appconst';
import LocalizationKeys from './localizationKeys';

declare var abp: any;

// export function L(key: string, sourceName?: string): string {
//   let localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;
//   return abp.localization.localize(key, sourceName ? sourceName : localizationSourceName);
// }

export function L(key: string, sourceName?: string): string {

  let localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;
  let localizedText = abp.localization.localize(key, sourceName ? sourceName : localizationSourceName);
  if (localizedText == key) {
    localizedText = LocalizationKeys[key] ?  LocalizationKeys[key].defaultText : localizedText;
  }
  return localizedText;
}

export function isGranted(permissionName: string): boolean {
  return abp.auth.isGranted(permissionName);
}
