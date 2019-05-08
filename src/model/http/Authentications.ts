import { AuthenticationType } from '../model';
import { BasicAuthentication } from '../model';
import { Oauth2Authentication } from '../model';
import { ApiKeyAuthentication } from '../model';

export class Authentications {
    /**
     * Authentication type
     */
    type: AuthenticationType;

    /**
     * The value of authentication type
     */
    value: BasicAuthentication | ApiKeyAuthentication | Oauth2Authentication;
}
