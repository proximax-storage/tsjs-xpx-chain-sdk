import { AccountHttp, BlockHttp, ChainHttp, TransactionHttp, ChainConfigHttp, ChainUpgradeHttp, ContractHttp, DiagnosticHttp, NetworkHttp, MetadataHttp, MosaicHttp, NamespaceHttp, NodeHttp, Listener } from "../infrastructure/infrastructure";

/**
 * Convenience wrapper class for all the http endpoints and websocket listener given single url.
 * All of them are initialized lazily.
 */
export class ApiEndpoint {
    private _account: AccountHttp;
    private _block: BlockHttp;
    private _chainConfig: ChainConfigHttp;
    private _chain: ChainHttp;
    private _chainUpgrade: ChainUpgradeHttp;
    private _contract: ContractHttp;
    private _diagnostic: DiagnosticHttp;
    private _metadata: MetadataHttp;
    private _mosaic: MosaicHttp;
    private _namespace: NamespaceHttp;
    private _network: NetworkHttp;
    private _node: NodeHttp;
    private _transactions: TransactionHttp;

    private _listener: Listener;

    constructor(
        public readonly url: string
    ) {

    }

    public get account(): AccountHttp {
        if (! this._account) {
            this._account = new AccountHttp(this.url, this.network);
        }
        return this._account;
    }

    public get block(): BlockHttp {
        if (! this._block) {
            this._block = new BlockHttp(this.url, this.network);
        }
        return this._block;
    }

    public get chain(): ChainHttp {
        if (! this._chain) {
            this._chain = new ChainHttp(this.url);
        }
        return this._chain;
    }

    public get chainConfig(): ChainConfigHttp {
        if (! this._chainConfig) {
            this._chainConfig = new ChainConfigHttp(this.url);
        }
        return this._chainConfig;
    }

    public get chainUpgrade(): ChainUpgradeHttp {
        if (! this._chainUpgrade) {
            this._chainUpgrade = new ChainUpgradeHttp(this.url);
        }
        return this._chainUpgrade;
    }

    public get contract(): ContractHttp {
        if (! this._contract) {
            this._contract = new ContractHttp(this.url, this.network);
        }
        return this._contract;
    }

    public get diagnostic(): DiagnosticHttp {
        if (! this._diagnostic) {
            this._diagnostic = new DiagnosticHttp(this.url);
        }
        return this._diagnostic;
    }

    public get metadata(): MetadataHttp {
        if (! this._metadata) {
            this._metadata = new MetadataHttp(this.url, this.network);
        }
        return this._metadata;
    }

    public get mosaic(): MosaicHttp {
        if (! this._mosaic) {
            this._mosaic = new MosaicHttp(this.url, this.network);
        }
        return this._mosaic;
    }

    public get namespace(): NamespaceHttp {
        if (! this._namespace) {
            this._namespace = new NamespaceHttp(this.url, this.network);
        }
        return this._namespace;
    }

    public get network(): NetworkHttp {
        if (! this._network) {
            this._network = new NetworkHttp(this.url);
        }
        return this._network
    }

    public get node(): NodeHttp {
        if (! this._node) {
            this._node = new NodeHttp(this.url);
        }
        return this._node;
    }

    public get transactions(): TransactionHttp {
        if (! this._transactions) {
            this._transactions = new TransactionHttp(this.url);
        }
        return this._transactions;
    }

    public get listener(): Listener {
        if (! this._listener) {
            this._listener = new Listener(this.url);
        }
        return this.listener;
    }

    public createNewListener(): Listener {
        return new Listener(this.url);
    }
}