/**
 * Static class containing API key authentication
 * It is used ffor building custom authentication type
 */
export class ApiKeyAuthentication {
    /**
     * The property name of the authentication
     * It is used like this in js-xpx-library: `data[ name ]`
     * @sample `data['Authorization']`
     */
    name: string;

    /**
     * Prefix in value like `data[name] = 'apiKeyPrefix'`
     * @sample `data['Authorization'] = 'Bearer'`;
     */
    apiKeyPrefix: string;

    /**
     * The value to append in apiKeyPrefix
     * @sample Prefix in value like `data['Authorization'] = Bearer + ' ' + '207rqyoiurwer.207rqyoiurwer.3940tqryweagf'`
     */
    apiKey: string;

    /**
     * Attach to header
     */
    attachToHeader: boolean;
}
