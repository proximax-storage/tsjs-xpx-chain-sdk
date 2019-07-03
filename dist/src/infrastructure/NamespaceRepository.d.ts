import { Observable } from 'rxjs';
import { Address } from '../model/account/Address';
import { MosaicId } from '../model/mosaic/MosaicId';
import { NamespaceId } from '../model/namespace/NamespaceId';
import { NamespaceInfo } from '../model/namespace/NamespaceInfo';
import { NamespaceName } from '../model/namespace/NamespaceName';
import { QueryParams } from './QueryParams';
/**
 * Namespace interface repository.
 *
 * @since 1.0
 */
export interface NamespaceRepository {
    /**
     * Gets the NamespaceInfo for a given namespaceId
     * @param namespaceId - Namespace id
     * @returns Observable<NamespaceInfo>
     */
    getNamespace(namespaceId: NamespaceId): Observable<NamespaceInfo>;
    /**
     * Gets array of NamespaceInfo for an account
     * @param address - Address
     * @param queryParams - (Optional) Query params
     * @returns Observable<NamespaceInfo[]>
     */
    getNamespacesFromAccount(address: Address, queryParams?: QueryParams): Observable<NamespaceInfo[]>;
    /**
     * Gets array of NamespaceInfo for different account
     * @param addresses - Array of Address
     * @param queryParams - (Optional) Query params
     * @returns Observable<NamespaceInfo[]>
     */
    getNamespacesFromAccounts(addresses: Address[], queryParams?: QueryParams): Observable<NamespaceInfo[]>;
    /**
     * Gets array of NamespaceName for different namespaceIds
     * @param namespaceIds - Array of namespace ids
     * @returns Observable<NamespaceName[]>
     */
    getNamespacesName(namespaceIds: NamespaceId[]): Observable<NamespaceName[]>;
    /**
     * Gets the MosaicId from a MosaicAlias
     * @param namespaceId - the namespaceId of the namespace
     * @returns Observable<MosaicId | null>
     */
    getLinkedMosaicId(namespaceId: NamespaceId): Observable<MosaicId | null>;
    /**
     * Gets the Address from a AddressAlias
     * @param namespaceId - the namespaceId of the namespace
     * @returnsObservable<Address | null>
     */
    getLinkedAddress(namespaceId: NamespaceId): Observable<Address | null>;
}
