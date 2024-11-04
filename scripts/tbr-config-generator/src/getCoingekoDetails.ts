import 'dotenv/config';
import { Chain } from "@wormhole-foundation/sdk";

interface CoinGekoPlatform {
    id: string
    chain_identifier: string | null
    name: string
    shortname: string
    native_coin_id: string
    distance?: number
}

function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= a.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= b.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,      // Deletion
                    matrix[i][j - 1] + 1,      // Insertion
                    matrix[i - 1][j - 1] + 1   // Substitution
                );
            }
        }
    }
    return matrix[a.length][b.length];
}

// Main function to find the closest match based on Levenshtein distance
function findClosestMatch(query: string, dataset: Array<CoinGekoPlatform>): CoinGekoPlatform {
    let closestMatch = dataset[0];
    const queryLower = query.toLowerCase();
    const idLower = closestMatch.id.toLowerCase();
    let minDistance = levenshteinDistance(queryLower, idLower);
    for (const item of dataset) {
        const distance = levenshteinDistance(queryLower, item.id.toLowerCase());
        if (distance < minDistance) {
            minDistance = distance;
            closestMatch = item;
        }
    }
    closestMatch.distance = minDistance
    return closestMatch;
}

const platformsUrl = "https://api.coingecko.com/api/v3/asset_platforms";

const platforms = new Array<CoinGekoPlatform>();
const platformByChain = new Map<Chain, CoinGekoPlatform>();

export async function getCoingekoPlaformForChain(chain: Chain, levenshtein = false): Promise<CoinGekoPlatform> {
    if (platforms.length === 0) {
        const response = await fetch(platformsUrl);
        const items = await response.json();
        platforms.push(...items);
    }
    const platform = platformByChain.get(chain);
    if (platform === undefined && levenshtein) {
        platformByChain.set(chain, findClosestMatch(chain, platforms));
    } else if (platform === undefined) {
        platformByChain.set(chain, platforms.find(item => item.chain_identifier === chain)!);
    }
    return platformByChain.get(chain)!;
}

const contractUrl = (platform: string, contractAddress: string) =>
    `https://api.coingecko.com/api/v3/coins/${platform}/contract/${contractAddress}`;

export class CoinGekoInfo {
    static readonly EMPTY = new CoinGekoInfo("", "", "");
    private readonly DECIMAL_PLACE_PATH = ['detail_platforms', 'ethereum', 'decimal_place'];
    //As per token bridge contract definition
    //see https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol#L289
    private readonly DEFAULT_DECIMALS = 8; 

    constructor(
        private readonly _id: string,
        private readonly _symbol: string,
        private readonly _name: string,
        private readonly _image: {
            thumb: string
            small: string
            large: string
        } = {} as any,
        private readonly _detail_platforms: {
            [key: string]: {
                platform: string
                contract_address: string
                decimal_place: number
            }
        } = {}
    ) {}

    get id(): string {
        return this._id;
    }

    get symbol(): string {
        return this._symbol;
    }

    get name(): string {
        return this._name;
    }

    get image(): string{
        return this._image['large'] || this._image['large'] || this._image['thumb'];
    }

    get decimals(): number {
        try {
            return this.DECIMAL_PLACE_PATH.reduce((acc: any, key: string) => {
                if (typeof acc === 'object' && key in acc) {
                    return acc[key];
                } else {
                    return acc[key] as number || this.DEFAULT_DECIMALS;
                }
            }, this._detail_platforms);    
        } catch (error: any) {
            console.log(error.message, this._detail_platforms);
        }
        return  this.DEFAULT_DECIMALS;
    }
}

export async function getCoingekoDetailsWithApiKey(chain: Chain, contractAddress: string): Promise<CoinGekoInfo> {
    const platform = await getCoingekoPlaformForChain(chain, true);
    return fetch(contractUrl(platform.id, contractAddress))
        .then(response => response.json())
        .then((data: any) => new CoinGekoInfo(
            data.id,
            data.symbol,
            data.name,
            data.image,
            data.detail_platforms
        ))
        .catch(error => Promise.reject(error));
}

export async function getCoingekoDetailsWithRetry(chain: Chain, contractAddress: string): Promise<CoinGekoInfo> {
    const platform = await getCoingekoPlaformForChain(chain, true);

    async function fetchWithRetry(url: string, retries = 3): Promise<CoinGekoInfo> {
        try {
            const response = await fetch(url);
            if (response.status === 429) {
                // Check for 'Retry-After' header
                const retryAfter = response.headers.get("Retry-After") || "1";
                if (retryAfter) {
                    const waitTime = parseFloat(retryAfter) * 1000; // Convert seconds to milliseconds
                    console.warn(`Rate limited. Retrying after ${waitTime} ms...`);
                    await new Promise((resolve) => setTimeout(resolve, waitTime));
                    return fetchWithRetry(url, retries - 1); // Retry the request
                }
                // throw new Error("Rate limited but no Retry-After header found");
            } else if (response.status === 404) {
                return CoinGekoInfo.EMPTY;
            } else if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }

            const data = await response.json();
            return new CoinGekoInfo(
                data.id,
                data.symbol,
                data.name,
                data.image,
                data.detail_platforms
            );
        } catch (error) {
            if (retries > 0) {
                console.warn(`Retrying... (${retries} attempts left)`);
                return fetchWithRetry(url, retries - 1);
            }
            return Promise.reject(error);
        }
    }

    return fetchWithRetry(contractUrl(platform.id, contractAddress));
}

export const getCoingekoDetails = process.env.COINGEKO_API_KEY ? getCoingekoDetailsWithApiKey : getCoingekoDetailsWithRetry;