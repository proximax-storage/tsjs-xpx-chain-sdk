import { AccountPropertiesInfo } from '../../model/account/AccountPropertiesInfo';
export declare class DtoMapping {
    /**
     * Create AccountPropertyInfo class from Json.
     * @param {object} dataJson The account property json object.
     * @returns {module: model/Account/AccountPropertiesInfo} The AccountPropertiesInfo class.
     */
    static extractAccountPropertyFromDto(accountProperties: any): AccountPropertiesInfo;
}
