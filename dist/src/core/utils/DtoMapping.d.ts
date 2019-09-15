import { AccountRestrictionsInfo } from '../../model/account/AccountRestrictionsInfo';
export declare class DtoMapping {
    /**
     * Create AccountRestrictionsInfo class from Json.
     * @param {object} dataJson The account restriction json object.
     * @returns {module: model/Account/AccountRestrictionsInfo} The AccountRestrictionsInfo class.
     */
    static extractAccountRestrictionFromDto(accountRestrictions: any): AccountRestrictionsInfo;
}
