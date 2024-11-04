import "dotenv/config";
import { DuneClient } from "@duneanalytics/client-sdk";
import { ChainId, isChainId, Chain, chainIdToChain, Wormhole, TokenAddress } from "@wormhole-foundation/sdk";

export class TokenInfo {
    constructor(
        private readonly _sourceTokenAddress: string,
        private readonly _sourceChainId: string,
        private readonly _targetChainIds: Array<string>
    ) { }

    get isValidSourceChain(): boolean {
        return isChainId(parseInt(this._sourceChainId));
    }

    get sourceChainId(): ChainId {
        const chainId = parseInt(this._sourceChainId);
        if (isChainId(chainId)) {
            return chainId;
        }
        throw new Error(`Invalid chain id: ${this._sourceChainId}`);
    }

    get targetChainIds(): Array<ChainId> {
        return this._targetChainIds
            .map((sChainId: string) => parseInt(sChainId))
            .filter(isChainId) satisfies Array<ChainId>;
    }

    get sourceChain(): Chain {
        return chainIdToChain(this.sourceChainId);
    }

    get address(): TokenAddress<typeof this.sourceChain> {
        return Wormhole.parseAddress(this.sourceChain, this._sourceTokenAddress);
    }

    get targetChains(): Array<Chain> {
        return this.targetChainIds.map(chainId => chainIdToChain(chainId));
    }

    toJSON() {
        return {
            sourceChainId: this.sourceChainId,
            sourceChain: this.sourceChain,
            targetChainIds: this.targetChainIds,
            targetChains: this.targetChains,
            address: this.address
        };
    }

    toString(): string {
        return JSON.stringify(this, null, 2);
    }
}

const client = new DuneClient(process.env.DUNE_API_KEY!);

function extractAnchorText(html: string) {
  const anchorTextRegex = /<a\b[^>]*>(.*?)<\/a>/i;
  const match = anchorTextRegex.exec(html);
  return match ? match[1].trim() : "";
}

function getTokenAddress(row: any): string {
  return extractAnchorText(row["Token Address"] as string);
}

function getTokenChain(row: any): string {
  return row["Token Chain"];
}

function getTargetChains(row: any): Array<string> {
  return (row["Target Chains"] as string[]);
}

function asTokenInfo(row: any): TokenInfo {
  return new TokenInfo(getTokenAddress(row), getTokenChain(row), getTargetChains(row));
}

function hasValidChainId(token: TokenInfo): boolean {
  return token.isValidSourceChain && token.targetChainIds.length > 0;
}

export async function getDuneInfo(queryId: number, execute = false): Promise<Array<TokenInfo>> {
  const { result } = execute ? await client.runQuery({ queryId }) : await client.getLatestResult({ queryId, sample_count: 30 });
  return result?.rows.map(asTokenInfo).filter(hasValidChainId) ?? [];
}