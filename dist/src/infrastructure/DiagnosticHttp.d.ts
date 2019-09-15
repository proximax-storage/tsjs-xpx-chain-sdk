import { Observable } from 'rxjs';
import { BlockchainStorageInfo } from '../model/blockchain/BlockchainStorageInfo';
import { ServerInfo } from '../model/diagnostic/ServerInfo';
import { DiagnosticRepository } from './DiagnosticRepository';
import { Http } from './Http';
<<<<<<< HEAD
=======
import { Authentication } from './model/models';
>>>>>>> jwt
/**
 * Diagnostic http repository.
 *
 * @since 1.0
 */
export declare class DiagnosticHttp extends Http implements DiagnosticRepository {
    /**
     * Constructor
     * @param url
     */
<<<<<<< HEAD
    constructor(url: string);
=======
    constructor(url: string, auth?: Authentication, headers?: {});
>>>>>>> jwt
    /**
     * Gets blockchain storage info.
     * @returns Observable<BlockchainStorageInfo>
     */
    getDiagnosticStorage(): Observable<BlockchainStorageInfo>;
    /**
     * Gets blockchain server info.
     * @returns Observable<Server>
     */
    getServerInfo(): Observable<ServerInfo>;
}
