import { Observable } from 'rxjs';
import { NamespaceHttp } from '../infrastructure/NamespaceHttp';
import { NamespaceId } from '../model/namespace/NamespaceId';
import { Namespace } from './Namespace';
/**
 * Namespace service
 */
export declare class NamespaceService {
    private readonly namespaceHttp;
    /**
     * Constructor
     * @param namespaceHttp
     */
    constructor(namespaceHttp: NamespaceHttp);
    /**
     * Get namespace info and name from namespace Id
     * @param id
     * @returns {Observable<Namespace>}
     */
    namespace(id: NamespaceId): Observable<Namespace>;
    private extractFullNamespace;
}
