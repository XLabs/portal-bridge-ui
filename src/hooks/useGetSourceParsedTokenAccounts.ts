import {
  ChainId,
  CHAIN_ID_ACALA,
  CHAIN_ID_ALGORAND,
  CHAIN_ID_APTOS,
  CHAIN_ID_AVAX,
  CHAIN_ID_BSC,
  CHAIN_ID_CELO,
  CHAIN_ID_ETH,
  CHAIN_ID_FANTOM,
  CHAIN_ID_KARURA,
  CHAIN_ID_KLAYTN,
  CHAIN_ID_MOONBEAM,
  CHAIN_ID_NEAR,
  CHAIN_ID_NEON,
  CHAIN_ID_OASIS,
  CHAIN_ID_POLYGON,
  CHAIN_ID_SOLANA,
  CHAIN_ID_XPLA,
  CHAIN_ID_SEI,
  isEVMChain,
  isTerraChain,
  ethers_contracts,
  WSOL_ADDRESS,
  WSOL_DECIMALS,
  CHAIN_ID_INJECTIVE,
  CHAIN_ID_SUI,
  CHAIN_ID_ARBITRUM,
  CHAIN_ID_BASE,
  CHAIN_ID_WORLDCHAIN,
  CHAIN_ID_MANTLE,
  CHAIN_ID_SCROLL,
  CHAIN_ID_XLAYER,
} from "@certusone/wormhole-sdk";
import { Dispatch } from "@reduxjs/toolkit";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  AccountInfo,
  Connection,
  ParsedAccountData,
  PublicKey,
} from "@solana/web3.js";
import { Algodv2 } from "algosdk";
import axios from "axios";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlgorandWallet } from "../contexts/AlgorandWalletContext";
import { useAptosContext } from "../contexts/AptosWalletContext";
import {
  Provider,
  useEthereumProvider,
} from "../contexts/EthereumProviderContext";
import { useNearContext } from "../contexts/NearWalletContext";
import { useSolanaWallet } from "../contexts/SolanaWalletContext";
import acalaIcon from "../icons/acala.svg";
import arbitrumIcon from "../icons/arbitrum.svg";
import avaxIcon from "../icons/avax.svg";
import baseIcon from "../icons/base.svg";
import bnbIcon from "../icons/bnb.svg";
import celoIcon from "../icons/celo.svg";
import ethIcon from "../icons/eth.svg";
import fantomIcon from "../icons/fantom.svg";
import karuraIcon from "../icons/karura.svg";
import klaytnIcon from "../icons/klaytn.svg";
import moonbeamIcon from "../icons/moonbeam.svg";
import neonIcon from "../icons/neon.svg";
import oasisIcon from "../icons/oasis-network-rose-logo.svg";
import polygonIcon from "../icons/polygon.svg";
import aptosIcon from "../icons/aptos.svg";
import suiIcon from "../icons/sui.svg";
import worldchainIcon from "../icons/worldchain.svg";
import scrollIcon from "../icons/scroll.svg";
import {
  errorSourceParsedTokenAccounts as errorSourceParsedTokenAccountsNFT,
  fetchSourceParsedTokenAccounts as fetchSourceParsedTokenAccountsNFT,
  NFTParsedTokenAccount,
  receiveSourceParsedTokenAccounts as receiveSourceParsedTokenAccountsNFT,
  setSourceParsedTokenAccount as setSourceParsedTokenAccountNFT,
  setSourceParsedTokenAccounts as setSourceParsedTokenAccountsNFT,
  setSourceWalletAddress as setSourceWalletAddressNFT,
} from "../store/nftSlice";
import {
  selectNFTSourceChain,
  selectNFTSourceParsedTokenAccounts,
  selectNFTSourceWalletAddress,
  selectSourceWalletAddress,
  selectTransferSourceChain,
  selectTransferSourceParsedTokenAccounts,
} from "../store/selectors";
import {
  errorSourceParsedTokenAccounts,
  fetchSourceParsedTokenAccounts,
  ParsedTokenAccount,
  receiveSourceParsedTokenAccounts,
  setAmount,
  setSourceParsedTokenAccount,
  setSourceParsedTokenAccounts,
  setSourceWalletAddress,
} from "../store/transferSlice";
import { fetchCurrentTokens, getAptosClient } from "../utils/aptos";
import {
  ACA_ADDRESS,
  ACA_DECIMALS,
  ALGORAND_HOST,
  ALGO_DECIMALS,
  APTOS_NATIVE_TOKEN_KEY,
  BLOCKSCOUT_GET_TOKENS_URL,
  CELO_ADDRESS,
  CELO_DECIMALS,
  COVALENT_GET_TOKENS_URL,
  getDefaultNativeCurrencyAddressEvm,
  KAR_ADDRESS,
  KAR_DECIMALS,
  logoOverrides,
  NATIVE_NEAR_DECIMALS,
  NATIVE_NEAR_PLACEHOLDER,
  SOLANA_HOST,
  WAVAX_ADDRESS,
  WAVAX_DECIMALS,
  WBNB_ADDRESS,
  WBNB_DECIMALS,
  WETH_ADDRESS,
  WETH_DECIMALS,
  WFTM_ADDRESS,
  WFTM_DECIMALS,
  WGLMR_ADDRESS,
  WGLMR_DECIMALS,
  WKLAY_ADDRESS,
  WKLAY_DECIMALS,
  WMATIC_ADDRESS,
  WMATIC_DECIMALS,
  WNEON_ADDRESS,
  WNEON_DECIMALS,
  WROSE_ADDRESS,
  WROSE_DECIMALS,
  ARBWETH_ADDRESS,
  ARBWETH_DECIMALS,
  BASE_WETH_ADDRESS,
  BASE_WETH_DECIMALS,
  CLUSTER,
  SUI_NATIVE_TOKEN_KEY,
  WORLDWETH_ADDRESS,
  WORLDWETH_DECIMALS,
  SCROLLWETH_ADDRESS,
  SCROLLWETH_DECIMALS,
  WMNT_ADDRESS,
  WMNT_DECIMALS,
  WOKB_ADDRESS,
  WOKB_DECIMALS,
} from "../utils/consts";
import { makeNearAccount } from "../utils/near";
import {
  ExtractedMintInfo,
  extractMintInfo,
  getMultipleAccountsRPC,
} from "../utils/solana";
import { fetchSingleMetadata as fetchSingleMetadataAlgo } from "./useAlgoMetadata";
import { AptosCoinResourceReturn } from "./useAptosMetadata";
import { TokenClient, TokenTypes } from "aptos";
import { getSuiProvider } from "../utils/sui";
import { useSuiWallet } from "../contexts/SuiWalletContext";
import { chainToIcon } from "@wormhole-foundation/sdk-icons";

export function createParsedTokenAccount(
  publicKey: string,
  mintKey: string,
  amount: string,
  decimals: number,
  uiAmount: number,
  uiAmountString: string,
  symbol?: string,
  name?: string,
  logo?: string,
  isNativeAsset?: boolean
): ParsedTokenAccount {
  return {
    publicKey: publicKey,
    mintKey: mintKey,
    amount,
    decimals,
    uiAmount,
    uiAmountString,
    symbol,
    name,
    logo,
    isNativeAsset,
  };
}

export function createNFTParsedTokenAccount(
  publicKey: string,
  mintKey: string,
  amount: string,
  decimals: number,
  uiAmount: number,
  uiAmountString: string,
  tokenId: string,
  symbol?: string,
  name?: string,
  uri?: string,
  animation_url?: string,
  external_url?: string,
  image?: string,
  image_256?: string,
  nftName?: string,
  aptosTokenId?: TokenTypes.TokenId
): NFTParsedTokenAccount {
  return {
    publicKey,
    mintKey,
    amount,
    decimals,
    uiAmount,
    uiAmountString,
    tokenId,
    uri,
    animation_url,
    external_url,
    image,
    image_256,
    symbol,
    name,
    nftName,
    aptosTokenId,
  };
}

const createParsedTokenAccountFromInfo = (
  pubkey: PublicKey,
  item: AccountInfo<ParsedAccountData>
): ParsedTokenAccount => {
  return {
    publicKey: pubkey?.toString(),
    mintKey: item.data.parsed?.info?.mint?.toString(),
    amount: item.data.parsed?.info?.tokenAmount?.amount,
    decimals: item.data.parsed?.info?.tokenAmount?.decimals,
    uiAmount: item.data.parsed?.info?.tokenAmount?.uiAmount,
    uiAmountString: item.data.parsed?.info?.tokenAmount?.uiAmountString,
  };
};

const createParsedTokenAccountFromCovalent = (
  walletAddress: string,
  covalent: CovalentData
): ParsedTokenAccount => {
  return {
    publicKey: walletAddress,
    mintKey: covalent.contract_address,
    amount: covalent.balance,
    decimals: covalent.contract_decimals,
    uiAmount: Number(formatUnits(covalent.balance, covalent.contract_decimals)),
    uiAmountString: formatUnits(covalent.balance, covalent.contract_decimals),
    symbol: covalent.contract_ticker_symbol,
    name: covalent.contract_name,
    logo: logoOverrides.get(covalent.contract_address) || covalent.logo_url,
  };
};

const createNativeSolParsedTokenAccount = async (
  connection: Connection,
  walletAddress: string
) => {
  // const walletAddress = "H69q3Q8E74xm7swmMQpsJLVp2Q9JuBwBbxraAMX5Drzm" // known solana mainnet wallet with tokens
  const fetchAccounts = await getMultipleAccountsRPC(connection, [
    new PublicKey(walletAddress),
  ]);
  if (!fetchAccounts || !fetchAccounts.length || !fetchAccounts[0]) {
    return null;
  } else {
    return createParsedTokenAccount(
      walletAddress, //publicKey
      WSOL_ADDRESS, //Mint key
      fetchAccounts[0].lamports.toString(), //amount
      WSOL_DECIMALS, //decimals, 9
      parseFloat(formatUnits(fetchAccounts[0].lamports, WSOL_DECIMALS)),
      formatUnits(fetchAccounts[0].lamports, WSOL_DECIMALS).toString(),
      "SOL",
      "Solana",
      undefined, //TODO logo. It's in the solana token map, so we could potentially use that URL.
      true
    );
  }
};

const createNativeEthParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined
) => {
  return !(provider && signerAddress)
    ? Promise.reject()
    : provider.getBalance(signerAddress).then((balanceInWei) => {
        const balanceInEth = ethers.utils.formatEther(balanceInWei);
        return createParsedTokenAccount(
          signerAddress, //public key
          WETH_ADDRESS, //Mint key, On the other side this will be WETH, so this is hopefully a white lie.
          balanceInWei.toString(), //amount, in wei
          WETH_DECIMALS, //Luckily both ETH and WETH have 18 decimals, so this should not be an issue.
          parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
          balanceInEth.toString(), //This is the actual display field, which has full precision.
          "ETH", //A white lie for display purposes
          "Ethereum", //A white lie for display purposes
          ethIcon,
          true //isNativeAsset
        );
      });
};

const createNativeBaseParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined
) => {
  return !(provider && signerAddress)
    ? Promise.reject()
    : provider.getBalance(signerAddress).then((balanceInWei) => {
        const balanceInEth = ethers.utils.formatEther(balanceInWei);
        return createParsedTokenAccount(
          signerAddress, //public key
          BASE_WETH_ADDRESS, //Mint key, On the other side this will be WETH, so this is hopefully a white lie.
          balanceInWei.toString(), //amount, in wei
          BASE_WETH_DECIMALS, //Luckily both ETH and WETH have 18 decimals, so this should not be an issue.
          parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
          balanceInEth.toString(), //This is the actual display field, which has full precision.
          "baseETH", //A white lie for display purposes
          "Base Ethereum", //A white lie for display purposes
          baseIcon,
          true //isNativeAsset
        );
      });
};

const createNativeBscParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined
) => {
  return !(provider && signerAddress)
    ? Promise.reject()
    : provider.getBalance(signerAddress).then((balanceInWei) => {
        const balanceInEth = ethers.utils.formatEther(balanceInWei);
        return createParsedTokenAccount(
          signerAddress, //public key
          WBNB_ADDRESS, //Mint key, On the other side this will be WBNB, so this is hopefully a white lie.
          balanceInWei.toString(), //amount, in wei
          WBNB_DECIMALS, //Luckily both BNB and WBNB have 18 decimals, so this should not be an issue.
          parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
          balanceInEth.toString(), //This is the actual display field, which has full precision.
          "BNB", //A white lie for display purposes
          "Binance Coin", //A white lie for display purposes
          bnbIcon,
          true //isNativeAsset
        );
      });
};

const createNativePolygonParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined
) => {
  return !(provider && signerAddress)
    ? Promise.reject()
    : provider.getBalance(signerAddress).then((balanceInWei) => {
        const balanceInEth = ethers.utils.formatEther(balanceInWei);
        return createParsedTokenAccount(
          signerAddress, //public key
          WMATIC_ADDRESS, //Mint key, On the other side this will be WMATIC, so this is hopefully a white lie.
          balanceInWei.toString(), //amount, in wei
          WMATIC_DECIMALS, //Luckily both MATIC and WMATIC have 18 decimals, so this should not be an issue.
          parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
          balanceInEth.toString(), //This is the actual display field, which has full precision.
          "MATIC", //A white lie for display purposes
          "Matic", //A white lie for display purposes
          polygonIcon,
          true //isNativeAsset
        );
      });
};

const createNativeAvaxParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined
) => {
  return !(provider && signerAddress)
    ? Promise.reject()
    : provider.getBalance(signerAddress).then((balanceInWei) => {
        const balanceInEth = ethers.utils.formatEther(balanceInWei);
        return createParsedTokenAccount(
          signerAddress, //public key
          WAVAX_ADDRESS, //Mint key, On the other side this will be wavax, so this is hopefully a white lie.
          balanceInWei.toString(), //amount, in wei
          WAVAX_DECIMALS,
          parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
          balanceInEth.toString(), //This is the actual display field, which has full precision.
          "AVAX", //A white lie for display purposes
          "Avalanche", //A white lie for display purposes
          avaxIcon,
          true //isNativeAsset
        );
      });
};

const createNativeOasisParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined
) => {
  return !(provider && signerAddress)
    ? Promise.reject()
    : provider.getBalance(signerAddress).then((balanceInWei) => {
        const balanceInEth = ethers.utils.formatEther(balanceInWei);
        return createParsedTokenAccount(
          signerAddress, //public key
          WROSE_ADDRESS, //Mint key, On the other side this will be wavax, so this is hopefully a white lie.
          balanceInWei.toString(), //amount, in wei
          WROSE_DECIMALS,
          parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
          balanceInEth.toString(), //This is the actual display field, which has full precision.
          "ROSE", //A white lie for display purposes
          "Rose", //A white lie for display purposes
          oasisIcon,
          true //isNativeAsset
        );
      });
};

const createNativeFantomParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined
) => {
  return !(provider && signerAddress)
    ? Promise.reject()
    : provider.getBalance(signerAddress).then((balanceInWei) => {
        const balanceInEth = ethers.utils.formatEther(balanceInWei);
        return createParsedTokenAccount(
          signerAddress, //public key
          WFTM_ADDRESS, //Mint key, On the other side this will be wavax, so this is hopefully a white lie.
          balanceInWei.toString(), //amount, in wei
          WFTM_DECIMALS,
          parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
          balanceInEth.toString(), //This is the actual display field, which has full precision.
          "FTM", //A white lie for display purposes
          "Fantom", //A white lie for display purposes
          fantomIcon,
          true //isNativeAsset
        );
      });
};

const createNativeKaruraParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined
) => {
  return !(provider && signerAddress)
    ? Promise.reject()
    : ethers_contracts.TokenImplementation__factory.connect(
        KAR_ADDRESS,
        provider
      )
        .balanceOf(signerAddress)
        .then((balance) => {
          const balanceInEth = ethers.utils.formatUnits(balance, KAR_DECIMALS);
          return createParsedTokenAccount(
            signerAddress, //public key
            KAR_ADDRESS, //Mint key, On the other side this will be wavax, so this is hopefully a white lie.
            balance.toString(), //amount, in wei
            KAR_DECIMALS,
            parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
            balanceInEth.toString(), //This is the actual display field, which has full precision.
            "KAR", //A white lie for display purposes
            "KAR", //A white lie for display purposes
            karuraIcon,
            false //isNativeAsset
          );
        });
};

const createNativeAcalaParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined
) => {
  return !(provider && signerAddress)
    ? Promise.reject()
    : ethers_contracts.TokenImplementation__factory.connect(
        ACA_ADDRESS,
        provider
      )
        .balanceOf(signerAddress)
        .then((balance) => {
          const balanceInEth = ethers.utils.formatUnits(balance, ACA_DECIMALS);
          return createParsedTokenAccount(
            signerAddress, //public key
            ACA_ADDRESS, //Mint key, On the other side this will be wavax, so this is hopefully a white lie.
            balance.toString(), //amount, in wei
            ACA_DECIMALS,
            parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
            balanceInEth.toString(), //This is the actual display field, which has full precision.
            "ACA", //A white lie for display purposes
            "ACA", //A white lie for display purposes
            acalaIcon,
            false //isNativeAsset
          );
        });
};

const createNativeKlaytnParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined
) => {
  return !(provider && signerAddress)
    ? Promise.reject()
    : provider.getBalance(signerAddress).then((balanceInWei) => {
        const balanceInEth = ethers.utils.formatEther(balanceInWei);
        return createParsedTokenAccount(
          signerAddress, //public key
          WKLAY_ADDRESS, //Mint key, On the other side this will be wklay, so this is hopefully a white lie.
          balanceInWei.toString(), //amount, in wei
          WKLAY_DECIMALS,
          parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
          balanceInEth.toString(), //This is the actual display field, which has full precision.
          "KLAY", //A white lie for display purposes
          "KLAY", //A white lie for display purposes
          klaytnIcon,
          true //isNativeAsset
        );
      });
};

const createNativeCeloParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined
) => {
  // Celo has a "native asset" ERC-20
  // https://docs.celo.org/developer-guide/celo-for-eth-devs
  return !(provider && signerAddress)
    ? Promise.reject()
    : ethers_contracts.TokenImplementation__factory.connect(
        CELO_ADDRESS,
        provider
      )
        .balanceOf(signerAddress)
        .then((balance) => {
          const balanceInEth = ethers.utils.formatUnits(balance, CELO_DECIMALS);
          return createParsedTokenAccount(
            signerAddress, //public key
            CELO_ADDRESS, //Mint key, On the other side this will be wavax, so this is hopefully a white lie.
            balance.toString(), //amount, in wei
            CELO_DECIMALS,
            parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
            balanceInEth.toString(), //This is the actual display field, which has full precision.
            "CELO", //A white lie for display purposes
            "CELO", //A white lie for display purposes
            celoIcon,
            false //isNativeAsset
          );
        });
};

const createNativeNeonParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined
) => {
  return !(provider && signerAddress)
    ? Promise.reject()
    : provider.getBalance(signerAddress).then((balanceInWei) => {
        const balanceInEth = ethers.utils.formatEther(balanceInWei);
        return createParsedTokenAccount(
          signerAddress, //public key
          WNEON_ADDRESS, //Mint key, On the other side this will be wneon, so this is hopefully a white lie.
          balanceInWei.toString(), //amount, in wei
          WNEON_DECIMALS,
          parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
          balanceInEth.toString(), //This is the actual display field, which has full precision.
          "NEON", //A white lie for display purposes
          "NEON", //A white lie for display purposes
          neonIcon,
          true //isNativeAsset
        );
      });
};

const createNativeMoonbeamParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined
) => {
  return !(provider && signerAddress)
    ? Promise.reject()
    : provider.getBalance(signerAddress).then((balanceInWei) => {
        const balanceInEth = ethers.utils.formatEther(balanceInWei);
        return createParsedTokenAccount(
          signerAddress, //public key
          WGLMR_ADDRESS, //Mint key, On the other side this will be wneon, so this is hopefully a white lie.
          balanceInWei.toString(), //amount, in wei
          WGLMR_DECIMALS,
          parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
          balanceInEth.toString(), //This is the actual display field, which has full precision.
          "GLMR", //A white lie for display purposes
          "GLMR", //A white lie for display purposes
          moonbeamIcon,
          true //isNativeAsset
        );
      });
};

const createNativeArbitrumParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined
) => {
  return !(provider && signerAddress)
    ? Promise.reject()
    : provider.getBalance(signerAddress).then((balanceInWei) => {
        const balanceInEth = ethers.utils.formatEther(balanceInWei);
        return createParsedTokenAccount(
          signerAddress, //public key
          ARBWETH_ADDRESS, //Mint key, On the other side this will be wneon, so this is hopefully a white lie.
          balanceInWei.toString(), //amount, in wei
          ARBWETH_DECIMALS,
          parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
          balanceInEth.toString(), //This is the actual display field, which has full precision.
          "arbETH", //A white lie for display purposes
          "arbEth", //A white lie for display purposes
          arbitrumIcon,
          true //isNativeAsset
        );
      });
};

// TO DO: Update this function to create a native asset for the other evm chains
const createNativeWorldchainParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined
) => {
  return !(provider && signerAddress)
    ? Promise.reject()
    : provider.getBalance(signerAddress).then((balanceInWei) => {
        const balanceInEth = ethers.utils.formatEther(balanceInWei);
        return createParsedTokenAccount(
          signerAddress, //public key
          WORLDWETH_ADDRESS, //Mint key, On the other side this will be weth, so this is hopefully a white lie.
          balanceInWei.toString(), //amount, in wei
          WORLDWETH_DECIMALS,
          parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
          balanceInEth.toString(), //This is the actual display field, which has full precision.
          "worldETH", //A white lie for display purposes
          "worldETH", //A white lie for display purposes
          worldchainIcon,
          true //isNativeAsset
        );
      });
};

const createNativeParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined,
  wrappedAddress: string,
  decimals: number,
  icon: string,
  symbol: string,
) => {
  return !(provider && signerAddress)
    ? Promise.reject()
    : provider.getBalance(signerAddress).then((balanceInWei) => {
        const balanceInEth = ethers.utils.formatEther(balanceInWei);
        return createParsedTokenAccount(
          signerAddress, //public key
          wrappedAddress, //Mint key, On the other side this will be weth, so this is hopefully a white lie.
          balanceInWei.toString(), //amount, in wei
          decimals,
          parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
          balanceInEth.toString(), //This is the actual display field, which has full precision.
          symbol, //A white lie for display purposes
          symbol, //A white lie for display purposes
          icon,
          true //isNativeAsset
        );
      });
};

const createNFTParsedTokenAccountFromCovalent = (
  walletAddress: string,
  covalent: CovalentData,
  nft_data: CovalentNFTData
): NFTParsedTokenAccount => {
  const amount = nft_data.token_balance
    ? formatUnits(nft_data.token_balance, covalent.contract_decimals)
    : "0";
  return {
    publicKey: walletAddress,
    mintKey: covalent.contract_address,
    amount: nft_data.token_balance ? nft_data.token_balance : "",
    decimals: covalent.contract_decimals,
    uiAmount: Number(amount),
    uiAmountString: amount,
    symbol: covalent.contract_ticker_symbol,
    name: covalent.contract_name,
    logo: covalent.logo_url,
    tokenId: nft_data.token_id,
    uri: nft_data.token_url,
    animation_url: nft_data.external_data?.animation_url,
    external_url: nft_data.external_data?.external_url,
    image: nft_data.external_data?.image,
    image_256: nft_data.external_data?.image_256,
    nftName: nft_data.external_data?.name,
    description: nft_data.external_data?.description,
  };
};

export type CovalentData = {
  contract_decimals: number;
  contract_ticker_symbol: string;
  contract_name: string;
  contract_address: string;
  logo_url: string | undefined;
  balance: string;
  quote: number | undefined;
  quote_rate: number | undefined;
  nft_data?: CovalentNFTData[];
};

export type CovalentNFTExternalData = {
  animation_url: string | null;
  external_url: string | null;
  image: string;
  image_256: string;
  name: string;
  description: string;
};

export type CovalentNFTData = {
  token_id: string;
  token_balance: string | null;
  external_data: CovalentNFTExternalData | null;
  token_url: string;
};

const getEthereumAccountsCovalent = async (
  url: string,
  nft: boolean,
  chainId: ChainId
): Promise<CovalentData[]> => {
  try {
    const output = [] as CovalentData[];
    const response = await axios.get(url);
    const tokens = response.data.data.items;

    if (tokens instanceof Array && tokens.length) {
      for (const item of tokens) {
        // TODO: filter?
        if (
          item.contract_decimals !== undefined &&
          item.contract_address &&
          item.contract_address.toLowerCase() !==
            getDefaultNativeCurrencyAddressEvm(chainId).toLowerCase() && // native balance comes from querying token bridge
          item.balance &&
          item.balance !== "0" &&
          (nft
            ? item.supports_erc?.includes("erc721")
            : item.supports_erc?.includes("erc20"))
        ) {
          output.push({ ...item } as CovalentData);
        }
      }
    }

    return output;
  } catch (error) {
    return Promise.reject("Unable to retrieve your Ethereum Tokens.");
  }
};

export const getEthereumAccountsBlockscout = async (
  url: string,
  nft: boolean,
  chainId: ChainId
): Promise<CovalentData[]> => {
  try {
    const output = [] as CovalentData[];
    const response = await axios.get(url);
    const tokens = response.data.result;

    if (tokens instanceof Array && tokens.length) {
      for (const item of tokens) {
        if (
          item.decimals !== undefined &&
          item.contractAddress &&
          item.contractAddress.toLowerCase() !==
            getDefaultNativeCurrencyAddressEvm(chainId).toLowerCase() && // native balance comes from querying token bridge
          item.balance &&
          item.balance !== "0" &&
          (nft ? item.type?.includes("ERC-721") : item.type?.includes("ERC-20"))
        ) {
          output.push({
            contract_decimals: item.decimals,
            contract_address: item.contractAddress,
            balance: item.balance,
            contract_ticker_symbol: item.symbol,
            contract_name: item.name,
            logo_url: "",
            quote: 0,
            quote_rate: 0,
          });
        }
      }
    }

    return output;
  } catch (error) {
    return Promise.reject("Unable to retrieve your Ethereum Tokens.");
  }
};

const getSolanaParsedTokenAccounts = async (
  walletAddress: string,
  dispatch: Dispatch,
  nft: boolean
) => {
  const connection = new Connection(SOLANA_HOST, "confirmed");
  dispatch(
    nft ? fetchSourceParsedTokenAccountsNFT() : fetchSourceParsedTokenAccounts()
  );
  try {
    //No matter what, we retrieve the spl tokens associated to this address.
    let splParsedTokenAccounts = await connection
      .getParsedTokenAccountsByOwner(new PublicKey(walletAddress), {
        programId: new PublicKey(TOKEN_PROGRAM_ID),
      })
      .then((result) => {
        return result.value.map((item) =>
          createParsedTokenAccountFromInfo(item.pubkey, item.account)
        );
      });

    // uncomment to test token account in picker, useful for debugging
    // splParsedTokenAccounts.push({
    //   amount: "1",
    //   decimals: 8,
    //   mintKey: "2Xf2yAXJfg82sWwdLUo2x9mZXy6JCdszdMZkcF1Hf4KV",
    //   publicKey: "2Xf2yAXJfg82sWwdLUo2x9mZXy6JCdszdMZkcF1Hf4KV",
    //   uiAmount: 1,
    //   uiAmountString: "1",
    //   isNativeAsset: false,
    // });

    if (nft) {
      //In the case of NFTs, we are done, and we set the accounts in redux
      dispatch(receiveSourceParsedTokenAccountsNFT(splParsedTokenAccounts));
    } else {
      //In the transfer case, we also pull the SOL balance of the wallet, and prepend it at the beginning of the list.
      const nativeAccount = await createNativeSolParsedTokenAccount(
        connection,
        walletAddress
      );
      if (nativeAccount !== null) {
        splParsedTokenAccounts.unshift(nativeAccount);
      }
      dispatch(receiveSourceParsedTokenAccounts(splParsedTokenAccounts));
    }
  } catch (e) {
    console.error(e);
    dispatch(
      nft
        ? errorSourceParsedTokenAccountsNFT("Failed to load NFT metadata")
        : errorSourceParsedTokenAccounts("Failed to load token metadata.")
    );
  }
};

const getAlgorandParsedTokenAccounts = async (
  walletAddress: string,
  dispatch: Dispatch,
  nft: boolean
) => {
  dispatch(
    nft ? fetchSourceParsedTokenAccountsNFT() : fetchSourceParsedTokenAccounts()
  );
  try {
    const algodClient = new Algodv2(
      ALGORAND_HOST.algodToken,
      ALGORAND_HOST.algodServer,
      ALGORAND_HOST.algodPort
    );
    const accountInfo = await algodClient
      .accountInformation(walletAddress)
      .do();
    const parsedTokenAccounts: ParsedTokenAccount[] = [];
    for (const asset of accountInfo.assets) {
      const assetId = asset["asset-id"];
      const amount = asset.amount;
      try {
        const metadata = await fetchSingleMetadataAlgo(assetId, algodClient);
        const isNFT: boolean = amount === 1 && metadata.decimals === 0;
        if (((nft && isNFT) || (!nft && !isNFT)) && amount > 0) {
          parsedTokenAccounts.push(
            createParsedTokenAccount(
              walletAddress,
              assetId.toString(),
              amount,
              metadata.decimals,
              parseFloat(formatUnits(amount, metadata.decimals)),
              formatUnits(amount, metadata.decimals).toString(),
              metadata.symbol,
              metadata.tokenName,
              undefined,
              false
            )
          );
        }
      } catch (e) {
        console.error(`Failed to fetch metadata for Algorand asset ${assetId}`);
      }
    }
    if (nft) {
      dispatch(receiveSourceParsedTokenAccountsNFT(parsedTokenAccounts));
      return;
    }
    // The ALGOs account is prepended for the non NFT case
    parsedTokenAccounts.unshift(
      createParsedTokenAccount(
        walletAddress, //publicKey
        "0", //asset ID
        accountInfo.amount, //amount
        ALGO_DECIMALS,
        parseFloat(formatUnits(accountInfo.amount, ALGO_DECIMALS)),
        formatUnits(accountInfo.amount, ALGO_DECIMALS).toString(),
        "ALGO",
        "Algo",
        undefined, //TODO logo
        true
      )
    );
    dispatch(receiveSourceParsedTokenAccounts(parsedTokenAccounts));
  } catch (e) {
    console.error(e);
    dispatch(
      nft
        ? errorSourceParsedTokenAccountsNFT("Failed to load NFT metadata")
        : errorSourceParsedTokenAccounts("Failed to load token metadata.")
    );
  }
};

const getNearParsedTokenAccounts = async (
  walletAddress: string,
  dispatch: Dispatch,
  nft: boolean
) => {
  dispatch(
    nft ? fetchSourceParsedTokenAccountsNFT() : fetchSourceParsedTokenAccounts()
  );
  try {
    if (nft) {
      dispatch(receiveSourceParsedTokenAccountsNFT([]));
      return;
    }
    const account = await makeNearAccount(walletAddress);
    const balance = await account.getAccountBalance();
    const nativeNear = createParsedTokenAccount(
      walletAddress, //publicKey
      NATIVE_NEAR_PLACEHOLDER, //the app doesn't like when this isn't truthy
      balance.available, //amount
      NATIVE_NEAR_DECIMALS,
      parseFloat(formatUnits(balance.available, NATIVE_NEAR_DECIMALS)),
      formatUnits(balance.available, NATIVE_NEAR_DECIMALS).toString(),
      "NEAR",
      "Near",
      undefined, //TODO logo
      true
    );
    dispatch(receiveSourceParsedTokenAccounts([nativeNear]));
  } catch (e) {
    console.error(e);
    dispatch(
      nft
        ? errorSourceParsedTokenAccountsNFT("Failed to load NFT metadata")
        : errorSourceParsedTokenAccounts("Failed to load token metadata.")
    );
  }
};

const getAptosParsedTokenAccounts = async (
  walletAddress: string,
  dispatch: Dispatch,
  nft: boolean
) => {
  dispatch(
    nft ? fetchSourceParsedTokenAccountsNFT() : fetchSourceParsedTokenAccounts()
  );
  try {
    if (nft) {
      // there is no aptos indexing service in devnet
      const parsedTokenAccountsNFT: NFTParsedTokenAccount[] = [];
      if (CLUSTER === "devnet") {
        const client = getAptosClient();
        const tokenStore = await client.getAccountResource(
          walletAddress,
          "0x3::token::TokenStore"
        );
        if (tokenStore) {
          // @ts-ignore
          const counter = parseInt(tokenStore.data.deposit_events.counter);
          const events = await client.getEventsByEventHandle(
            walletAddress,
            "0x3::token::TokenStore",
            "deposit_events",
            {
              // TODO: pagination
              limit: counter,
            }
          );
          const ids = [...new Set(events.map((event) => event.data.id))];
          const data: TokenTypes.Token[] = [];
          const tokenClient = new TokenClient(client);
          await Promise.all(
            ids.map(async (id) => {
              const token = await tokenClient.getTokenForAccount(
                walletAddress,
                id
              );
              if (token) {
                data.push(token);
              }
            })
          );
          const result = data.filter((token) => {
            return token.amount !== "0";
          });
          const final = result.filter(
            (value, index) =>
              index ===
              result.findIndex(
                (t) => t.id.token_data_id.name === value.id.token_data_id.name
              )
          );
          final.sort((a, b) =>
            a.id.token_data_id.name.localeCompare(b.id.token_data_id.name)
          );
          parsedTokenAccountsNFT.push(
            ...(await Promise.all(
              final.map(async (token) => {
                const { creator, collection, name } = token.id.token_data_id;
                const tokenData = await tokenClient.getTokenData(
                  creator,
                  collection,
                  name
                );
                return createNFTParsedTokenAccount(
                  walletAddress,
                  creator,
                  token.amount,
                  0,
                  Number(token.amount),
                  token.amount,
                  name,
                  collection,
                  undefined,
                  tokenData.uri,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  token.id
                );
              })
            ))
          );
        }
      } else {
        let offset = 0;
        const limit = 100;
        while (true) {
          const tokens = await fetchCurrentTokens(walletAddress, offset, limit);
          tokens.data.current_token_ownerships.forEach((token) => {
            parsedTokenAccountsNFT.push(
              createNFTParsedTokenAccount(
                walletAddress,
                token.token_data_id_hash,
                "1",
                0,
                1,
                "1",
                token.name,
                token.collection_name,
                undefined,
                token.current_token_data.metadata_uri,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                {
                  token_data_id: {
                    creator: token.creator_address,
                    collection: token.collection_name,
                    name: token.name,
                  },
                  property_version: token.property_version.toString(),
                }
              )
            );
          });
          if (tokens.data.current_token_ownerships.length < limit) {
            break;
          }
          offset += tokens.data.current_token_ownerships.length;
        }
      }
      dispatch(receiveSourceParsedTokenAccountsNFT(parsedTokenAccountsNFT));
    } else {
      const client = getAptosClient();
      const resources = await client.getAccountResources(walletAddress);
      const coinResources = resources.filter((r) =>
        r.type.startsWith("0x1::coin::CoinStore<")
      );
      const parsedTokenAccounts: ParsedTokenAccount[] = [];
      for (const cr of coinResources) {
        try {
          const address = cr.type.substring(
            cr.type.indexOf("<") + 1,
            cr.type.length - 1
          );
          const coinType = `0x1::coin::CoinInfo<${address}>`;
          const coinStore = `0x1::coin::CoinStore<${address}>`;
          const value = (
            (await client.getAccountResource(walletAddress, coinStore))
              .data as any
          ).coin.value;
          const assetInfo = (
            await client.getAccountResource(address.split("::")[0], coinType)
          ).data as AptosCoinResourceReturn;
          if (value && value !== "0" && assetInfo) {
            const parsedTokenAccount = createParsedTokenAccount(
              walletAddress,
              address,
              value,
              assetInfo.decimals,
              Number(formatUnits(value, assetInfo.decimals)),
              formatUnits(value, assetInfo.decimals),
              assetInfo.symbol,
              assetInfo.name
            );
            if (address === APTOS_NATIVE_TOKEN_KEY) {
              parsedTokenAccount.logo = aptosIcon;
              parsedTokenAccount.isNativeAsset = true;
              parsedTokenAccounts.unshift(parsedTokenAccount);
            } else {
              parsedTokenAccounts.push(parsedTokenAccount);
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
      dispatch(receiveSourceParsedTokenAccounts(parsedTokenAccounts));
    }
  } catch (e: any) {
    console.error(e);
    dispatch(
      nft
        ? errorSourceParsedTokenAccountsNFT("Failed to load NFT metadata")
        : errorSourceParsedTokenAccounts("Failed to load token metadata.")
    );
  }
};

const getSuiParsedTokenAccounts = async (
  walletAddress: string,
  dispatch: Dispatch,
  nft: boolean
) => {
  dispatch(
    nft ? fetchSourceParsedTokenAccountsNFT() : fetchSourceParsedTokenAccounts()
  );
  try {
    if (nft) {
      dispatch(receiveSourceParsedTokenAccountsNFT([]));
      return;
    }
    const provider = getSuiProvider();
    const balances = await provider.getAllBalances({ owner: walletAddress });
    const parsedTokenAccounts: ParsedTokenAccount[] = [];
    for (const { coinType, totalBalance } of balances) {
      if (totalBalance === "0") continue;
      const response = await provider.getCoinMetadata({
        coinType,
      });
      if (!response) throw new Error("bad response");
      const { decimals, symbol, name } = response;
      const parsedTokenAccount = createParsedTokenAccount(
        walletAddress,
        coinType,
        totalBalance,
        decimals,
        Number(formatUnits(totalBalance, decimals)),
        formatUnits(totalBalance, decimals),
        symbol,
        name
      );
      if (coinType === SUI_NATIVE_TOKEN_KEY) {
        parsedTokenAccount.logo = suiIcon;
        parsedTokenAccount.isNativeAsset = true;
        parsedTokenAccounts.unshift(parsedTokenAccount);
      } else {
        parsedTokenAccounts.push(parsedTokenAccount);
      }
    }
    dispatch(receiveSourceParsedTokenAccounts(parsedTokenAccounts));
  } catch (e) {
    console.error(e);
    dispatch(
      nft
        ? errorSourceParsedTokenAccountsNFT("Failed to load NFT metadata")
        : errorSourceParsedTokenAccounts("Failed to load token metadata.")
    );
  }
};

/**
 * Fetches the balance of an asset for the connected wallet
 * This should handle every type of chain in the future, but only reads the Transfer state.
 */
function useGetAvailableTokens(nft: boolean = false) {
  const dispatch = useDispatch();

  const tokenAccounts = useSelector(
    nft
      ? selectNFTSourceParsedTokenAccounts
      : selectTransferSourceParsedTokenAccounts
  );

  const lookupChain = useSelector(
    nft ? selectNFTSourceChain : selectTransferSourceChain
  );
  const { publicKey: solPK, wallet: solanaWallet } = useSolanaWallet();
  const { provider, signerAddress } = useEthereumProvider(lookupChain as any);
  const { address: algoAccount } = useAlgorandWallet();
  const { accountId: nearAccountId } = useNearContext();
  const { account: aptosAddress } = useAptosContext();
  const suiWallet = useSuiWallet();
  const suiAddress = suiWallet?.getAddress();

  const [covalent, setCovalent] = useState<any>(undefined);
  const [covalentLoading, setCovalentLoading] = useState(false);
  const [covalentError, setCovalentError] = useState<string | undefined>(
    undefined
  );

  const [ethNativeAccount, setEthNativeAccount] = useState<any>(undefined);
  const [ethNativeAccountLoading, setEthNativeAccountLoading] = useState(false);
  const [ethNativeAccountError, setEthNativeAccountError] = useState<
    string | undefined
  >(undefined);

  const [solanaMintAccounts, setSolanaMintAccounts] = useState<
    Map<string, ExtractedMintInfo | null> | undefined
  >(undefined);
  const [solanaMintAccountsLoading, setSolanaMintAccountsLoading] =
    useState(false);
  const [solanaMintAccountsError, setSolanaMintAccountsError] = useState<
    string | undefined
  >(undefined);

  const selectedSourceWalletAddress = useSelector(
    nft ? selectNFTSourceWalletAddress : selectSourceWalletAddress
  );
  const currentSourceWalletAddress: string | undefined = isEVMChain(lookupChain)
    ? signerAddress
    : lookupChain === CHAIN_ID_SOLANA
    ? solPK?.toString()
    : lookupChain === CHAIN_ID_ALGORAND
    ? algoAccount
    : lookupChain === CHAIN_ID_NEAR
    ? nearAccountId || undefined
    : lookupChain === CHAIN_ID_APTOS
    ? aptosAddress || undefined
    : lookupChain === CHAIN_ID_SUI
    ? suiAddress || undefined
    : undefined;

  const resetSourceAccounts = useCallback(() => {
    dispatch(
      nft
        ? setSourceWalletAddressNFT(undefined)
        : setSourceWalletAddress(undefined)
    );
    dispatch(
      nft
        ? setSourceParsedTokenAccountNFT(undefined)
        : setSourceParsedTokenAccount(undefined)
    );
    dispatch(
      nft
        ? setSourceParsedTokenAccountsNFT(undefined)
        : setSourceParsedTokenAccounts(undefined)
    );
    !nft && dispatch(setAmount(""));
    setCovalent(undefined); //These need to be included in the reset because they have balances on them.
    setCovalentLoading(false);
    setCovalentError("");

    setEthNativeAccount(undefined);
    setEthNativeAccountLoading(false);
    setEthNativeAccountError("");
  }, [setCovalent, dispatch, nft]);

  //TODO this useEffect could be somewhere else in the codebase
  //It resets the SourceParsedTokens accounts when the wallet changes
  useEffect(() => {
    if (
      selectedSourceWalletAddress !== undefined &&
      currentSourceWalletAddress !== undefined &&
      currentSourceWalletAddress !== selectedSourceWalletAddress
    ) {
      resetSourceAccounts();
      return;
    } else {
    }
  }, [
    selectedSourceWalletAddress,
    currentSourceWalletAddress,
    dispatch,
    resetSourceAccounts,
  ]);

  //Solana accountinfos load
  useEffect(() => {
    if (lookupChain === CHAIN_ID_SOLANA && solPK) {
      if (
        !(tokenAccounts.data || tokenAccounts.isFetching || tokenAccounts.error)
      ) {
        getSolanaParsedTokenAccounts(solPK, dispatch, nft);
      }
    }

    return () => {};
  }, [dispatch, solanaWallet, lookupChain, solPK, tokenAccounts, nft]);

  //Solana Mint Accounts lookup
  useEffect(() => {
    if (lookupChain !== CHAIN_ID_SOLANA || !tokenAccounts.data?.length) {
      return () => {};
    }

    let cancelled = false;
    setSolanaMintAccountsLoading(true);
    setSolanaMintAccountsError(undefined);
    const mintAddresses = tokenAccounts.data.map((x) => x.mintKey);
    //This is a known wormhole v1 token on testnet
    // mintAddresses.push("4QixXecTZ4zdZGa39KH8gVND5NZ2xcaB12wiBhE4S7rn");
    //SOLT devnet token
    // mintAddresses.push("2WDq7wSs9zYrpx2kbHDA4RUTRch2CCTP6ZWaH4GNfnQQ");
    // bad monkey "NFT"
    // mintAddresses.push("5FJeEJR8576YxXFdGRAu4NBBFcyfmtjsZrXHSsnzNPdS");
    // degenerate monkey NFT
    // mintAddresses.push("EzYsbigNNGbNuANRJ3mnnyJYU2Bk7mBYVsxuonUwAX7r");

    const connection = new Connection(SOLANA_HOST, "confirmed");
    getMultipleAccountsRPC(
      connection,
      mintAddresses.map((x) => new PublicKey(x))
    ).then(
      (results) => {
        if (!cancelled) {
          const output = new Map<string, ExtractedMintInfo | null>();

          results.forEach((result, index) =>
            output.set(
              mintAddresses[index],
              (result && extractMintInfo(result)) || null
            )
          );

          setSolanaMintAccounts(output);
          setSolanaMintAccountsLoading(false);
        }
      },
      (error) => {
        if (!cancelled) {
          setSolanaMintAccounts(undefined);
          setSolanaMintAccountsLoading(false);
          setSolanaMintAccountsError(
            "Could not retrieve Solana mint accounts."
          );
        }
      }
    );

    return () => (cancelled = true);
  }, [tokenAccounts.data, lookupChain]);

  //Ethereum native asset load
  useEffect(() => {
    let cancelled = false;
    if (
      signerAddress &&
      lookupChain === CHAIN_ID_ETH &&
      !ethNativeAccount &&
      !nft
    ) {
      setEthNativeAccountLoading(true);
      createNativeEthParsedTokenAccount(provider, signerAddress).then(
        (result) => {
          console.log("create native account returned with value", result);
          if (!cancelled) {
            setEthNativeAccount(result);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("");
          }
        },
        (error) => {
          if (!cancelled) {
            setEthNativeAccount(undefined);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("Unable to retrieve your ETH balance.");
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);

  //Base native asset load
  useEffect(() => {
    let cancelled = false;
    if (
      signerAddress &&
      lookupChain === CHAIN_ID_BASE &&
      !ethNativeAccount &&
      !nft
    ) {
      setEthNativeAccountLoading(true);
      createNativeBaseParsedTokenAccount(provider, signerAddress).then(
        (result) => {
          console.log("create native account returned with value", result);
          if (!cancelled) {
            setEthNativeAccount(result);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("");
          }
        },
        (error) => {
          if (!cancelled) {
            setEthNativeAccount(undefined);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("Unable to retrieve your ETH balance.");
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);

  //BNB Chain native asset load
  useEffect(() => {
    let cancelled = false;
    if (
      signerAddress &&
      lookupChain === CHAIN_ID_BSC &&
      !ethNativeAccount &&
      !nft
    ) {
      setEthNativeAccountLoading(true);
      createNativeBscParsedTokenAccount(provider, signerAddress).then(
        (result) => {
          console.log("create native account returned with value", result);
          if (!cancelled) {
            setEthNativeAccount(result);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("");
          }
        },
        (error) => {
          if (!cancelled) {
            setEthNativeAccount(undefined);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("Unable to retrieve your BNB balance.");
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);

  //Polygon native asset load
  useEffect(() => {
    let cancelled = false;
    if (
      signerAddress &&
      lookupChain === CHAIN_ID_POLYGON &&
      !ethNativeAccount &&
      !nft
    ) {
      setEthNativeAccountLoading(true);
      createNativePolygonParsedTokenAccount(provider, signerAddress).then(
        (result) => {
          console.log("create native account returned with value", result);
          if (!cancelled) {
            setEthNativeAccount(result);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("");
          }
        },
        (error) => {
          if (!cancelled) {
            setEthNativeAccount(undefined);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("Unable to retrieve your MATIC balance.");
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);

  //TODO refactor all these into an isEVM effect
  //avax native asset load
  useEffect(() => {
    let cancelled = false;
    if (
      signerAddress &&
      lookupChain === CHAIN_ID_AVAX &&
      !ethNativeAccount &&
      !nft
    ) {
      setEthNativeAccountLoading(true);
      createNativeAvaxParsedTokenAccount(provider, signerAddress).then(
        (result) => {
          console.log("create native account returned with value", result);
          if (!cancelled) {
            setEthNativeAccount(result);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("");
          }
        },
        (error) => {
          if (!cancelled) {
            setEthNativeAccount(undefined);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("Unable to retrieve your AVAX balance.");
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);

  useEffect(() => {
    let cancelled = false;
    if (
      signerAddress &&
      lookupChain === CHAIN_ID_OASIS &&
      !ethNativeAccount &&
      !nft
    ) {
      setEthNativeAccountLoading(true);
      createNativeOasisParsedTokenAccount(provider, signerAddress).then(
        (result) => {
          console.log("create native account returned with value", result);
          if (!cancelled) {
            setEthNativeAccount(result);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("");
          }
        },
        (error) => {
          if (!cancelled) {
            setEthNativeAccount(undefined);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("Unable to retrieve your Oasis balance.");
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);

  useEffect(() => {
    let cancelled = false;
    if (
      signerAddress &&
      lookupChain === CHAIN_ID_FANTOM &&
      !ethNativeAccount &&
      !nft
    ) {
      setEthNativeAccountLoading(true);
      createNativeFantomParsedTokenAccount(provider, signerAddress).then(
        (result) => {
          console.log("create native account returned with value", result);
          if (!cancelled) {
            setEthNativeAccount(result);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("");
          }
        },
        (error) => {
          if (!cancelled) {
            setEthNativeAccount(undefined);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("Unable to retrieve your Fantom balance.");
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);

  useEffect(() => {
    let cancelled = false;
    if (
      signerAddress &&
      lookupChain === CHAIN_ID_KARURA &&
      !ethNativeAccount &&
      !nft
    ) {
      setEthNativeAccountLoading(true);
      createNativeKaruraParsedTokenAccount(provider, signerAddress).then(
        (result) => {
          console.log("create native account returned with value", result);
          if (!cancelled) {
            setEthNativeAccount(result);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("");
          }
        },
        (error) => {
          if (!cancelled) {
            setEthNativeAccount(undefined);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("Unable to retrieve your Karura balance.");
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);

  useEffect(() => {
    let cancelled = false;
    if (
      signerAddress &&
      lookupChain === CHAIN_ID_ACALA &&
      !ethNativeAccount &&
      !nft
    ) {
      setEthNativeAccountLoading(true);
      createNativeAcalaParsedTokenAccount(provider, signerAddress).then(
        (result) => {
          console.log("create native account returned with value", result);
          if (!cancelled) {
            setEthNativeAccount(result);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("");
          }
        },
        (error) => {
          if (!cancelled) {
            setEthNativeAccount(undefined);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("Unable to retrieve your Acala balance.");
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);

  useEffect(() => {
    let cancelled = false;
    if (
      signerAddress &&
      lookupChain === CHAIN_ID_KLAYTN &&
      !ethNativeAccount &&
      !nft
    ) {
      setEthNativeAccountLoading(true);
      createNativeKlaytnParsedTokenAccount(provider, signerAddress).then(
        (result) => {
          console.log("create native account returned with value", result);
          if (!cancelled) {
            setEthNativeAccount(result);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("");
          }
        },
        (error) => {
          if (!cancelled) {
            setEthNativeAccount(undefined);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("Unable to retrieve your Klaytn balance.");
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);

  useEffect(() => {
    let cancelled = false;
    if (
      signerAddress &&
      lookupChain === CHAIN_ID_CELO &&
      !ethNativeAccount &&
      !nft
    ) {
      setEthNativeAccountLoading(true);
      createNativeCeloParsedTokenAccount(provider, signerAddress).then(
        (result) => {
          console.log("create native account returned with value", result);
          if (!cancelled) {
            setEthNativeAccount(result);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("");
          }
        },
        (error) => {
          if (!cancelled) {
            setEthNativeAccount(undefined);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("Unable to retrieve your Celo balance.");
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);

  useEffect(() => {
    let cancelled = false;
    if (
      signerAddress &&
      lookupChain === CHAIN_ID_NEON &&
      !ethNativeAccount &&
      !nft
    ) {
      setEthNativeAccountLoading(true);
      createNativeNeonParsedTokenAccount(provider, signerAddress).then(
        (result) => {
          console.log("create native account returned with value", result);
          if (!cancelled) {
            setEthNativeAccount(result);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("");
          }
        },
        (error) => {
          if (!cancelled) {
            setEthNativeAccount(undefined);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("Unable to retrieve your Neon balance.");
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);

  useEffect(() => {
    let cancelled = false;
    if (
      signerAddress &&
      lookupChain === CHAIN_ID_MOONBEAM &&
      !ethNativeAccount &&
      !nft
    ) {
      setEthNativeAccountLoading(true);
      createNativeMoonbeamParsedTokenAccount(provider, signerAddress).then(
        (result) => {
          console.log("create native account returned with value", result);
          if (!cancelled) {
            setEthNativeAccount(result);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("");
          }
        },
        (error) => {
          if (!cancelled) {
            setEthNativeAccount(undefined);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError(
              "Unable to retrieve your Moonbeam balance."
            );
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);

  useEffect(() => {
    let cancelled = false;
    if (
      signerAddress &&
      lookupChain === CHAIN_ID_ARBITRUM &&
      !ethNativeAccount &&
      !nft
    ) {
      setEthNativeAccountLoading(true);
      createNativeArbitrumParsedTokenAccount(provider, signerAddress).then(
        (result) => {
          console.log("create native account returned with value", result);
          if (!cancelled) {
            setEthNativeAccount(result);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("");
          }
        },
        (error) => {
          if (!cancelled) {
            setEthNativeAccount(undefined);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError(
              "Unable to retrieve your Arbitrum balance."
            );
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);

  //Worldchain native asset load
  useEffect(() => {
    let cancelled = false;
    if (
      signerAddress &&
      lookupChain === CHAIN_ID_WORLDCHAIN &&
      !ethNativeAccount &&
      !nft
    ) {
      setEthNativeAccountLoading(true);
      createNativeWorldchainParsedTokenAccount(provider, signerAddress).then(
        (result) => {
          console.log("create native account returned with value", result);
          if (!cancelled) {
            setEthNativeAccount(result);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("");
          }
        },
        (error) => {
          if (!cancelled) {
            setEthNativeAccount(undefined);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("Unable to retrieve your MATIC balance.");
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);

    //Scroll, Mantle, Xlayer native asset load
    useEffect(() => {
      let cancelled = false;
      if (
        signerAddress &&
        (lookupChain === CHAIN_ID_SCROLL ||
          lookupChain === CHAIN_ID_MANTLE ||
          lookupChain === CHAIN_ID_XLAYER) &&
        !ethNativeAccount &&
        !nft
      ) {
        setEthNativeAccountLoading(true);
        let address = lookupChain === CHAIN_ID_SCROLL ? SCROLLWETH_ADDRESS : lookupChain === CHAIN_ID_MANTLE ? WMNT_ADDRESS : WOKB_ADDRESS;
        let decimals = lookupChain === CHAIN_ID_SCROLL ? SCROLLWETH_DECIMALS : lookupChain === CHAIN_ID_MANTLE ? WMNT_DECIMALS : WOKB_DECIMALS;
        let icon = lookupChain === CHAIN_ID_SCROLL ? scrollIcon : lookupChain === CHAIN_ID_MANTLE ? chainToIcon("Mantle") : chainToIcon("Xlayer");
        let symbol = lookupChain === CHAIN_ID_SCROLL ? "scrollETH" : lookupChain === CHAIN_ID_MANTLE ? "MNT" : "OKB";
        createNativeParsedTokenAccount(provider, signerAddress, address, decimals, icon, symbol).then(
          (result) => {
            console.log("create native account returned with value", result);
            if (!cancelled) {
              setEthNativeAccount(result);
              setEthNativeAccountLoading(false);
              setEthNativeAccountError("");
            }
          },
          (error) => {
            if (!cancelled) {
              setEthNativeAccount(undefined);
              setEthNativeAccountLoading(false);
              setEthNativeAccountError("Unable to retrieve your MATIC balance.");
            }
          }
        );
      }
  
      return () => {
        cancelled = true;
      };
    }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);
  

  //Ethereum covalent or blockscout accounts load
  useEffect(() => {
    //const testWallet = "0xf60c2ea62edbfe808163751dd0d8693dcb30019c";
    // const nftTestWallet1 = "0x3f304c6721f35ff9af00fd32650c8e0a982180ab";
    // const nftTestWallet2 = "0x98ed231428088eb440e8edb5cc8d66dcf913b86e";
    // const nftTestWallet3 = "0xb1fadf677a7e9b90e9d4f31c8ffb3dc18c138c6f";
    // const nftBscTestWallet1 = "0x5f464a652bd1991df0be37979b93b3306d64a909";

    let cancelled = false;
    const walletAddress = signerAddress;
    if (walletAddress && isEVMChain(lookupChain) && !covalent) {
      let url = COVALENT_GET_TOKENS_URL(lookupChain, walletAddress, nft);
      let getAccounts;
      if (url) {
        getAccounts = getEthereumAccountsCovalent;
      } else {
        url = BLOCKSCOUT_GET_TOKENS_URL(lookupChain, walletAddress);
        getAccounts = getEthereumAccountsBlockscout;
      }
      if (!url) {
        return;
      }
      //TODO less cancel
      !cancelled && setCovalentLoading(true);
      !cancelled &&
        dispatch(
          nft
            ? fetchSourceParsedTokenAccountsNFT()
            : fetchSourceParsedTokenAccounts()
        );
      getAccounts(url, nft, lookupChain).then(
        (accounts) => {
          !cancelled && setCovalentLoading(false);
          !cancelled && setCovalentError(undefined);
          !cancelled && setCovalent(accounts);
          !cancelled &&
            dispatch(
              nft
                ? receiveSourceParsedTokenAccountsNFT(
                    accounts.reduce((arr, current) => {
                      if (current.nft_data) {
                        current.nft_data.forEach((x) =>
                          arr.push(
                            createNFTParsedTokenAccountFromCovalent(
                              walletAddress,
                              current,
                              x
                            )
                          )
                        );
                      }
                      return arr;
                    }, [] as NFTParsedTokenAccount[])
                  )
                : receiveSourceParsedTokenAccounts(
                    accounts.map((x) =>
                      createParsedTokenAccountFromCovalent(walletAddress, x)
                    )
                  )
            );
        },
        () => {
          !cancelled &&
            dispatch(
              nft
                ? errorSourceParsedTokenAccountsNFT(
                    "Cannot load your Ethereum NFTs at the moment."
                  )
                : errorSourceParsedTokenAccounts(
                    "Cannot load your Ethereum tokens at the moment."
                  )
            );
          !cancelled &&
            setCovalentError("Cannot load your Ethereum tokens at the moment.");
          !cancelled && setCovalentLoading(false);
        }
      );

      return () => {
        cancelled = true;
      };
    }
  }, [lookupChain, provider, signerAddress, dispatch, nft, covalent]);

  //Terra accounts load
  //At present, we don't have any mechanism for doing this.
  useEffect(() => {}, []);

  //Algorand accounts load
  useEffect(() => {
    if (lookupChain === CHAIN_ID_ALGORAND && currentSourceWalletAddress) {
      if (
        !(tokenAccounts.data || tokenAccounts.isFetching || tokenAccounts.error)
      ) {
        getAlgorandParsedTokenAccounts(
          currentSourceWalletAddress,
          dispatch,
          nft
        );
      }
    }

    return () => {};
  }, [dispatch, lookupChain, currentSourceWalletAddress, tokenAccounts, nft]);

  //Near accounts load
  useEffect(() => {
    if (lookupChain === CHAIN_ID_NEAR && currentSourceWalletAddress) {
      if (
        !(tokenAccounts.data || tokenAccounts.isFetching || tokenAccounts.error)
      ) {
        getNearParsedTokenAccounts(currentSourceWalletAddress, dispatch, nft);
      }
    }

    return () => {};
  }, [dispatch, lookupChain, currentSourceWalletAddress, tokenAccounts, nft]);

  //Aptos accounts load
  useEffect(() => {
    if (lookupChain === CHAIN_ID_APTOS && currentSourceWalletAddress) {
      if (
        !(tokenAccounts.data || tokenAccounts.isFetching || tokenAccounts.error)
      ) {
        getAptosParsedTokenAccounts(currentSourceWalletAddress, dispatch, nft);
      }
    }

    return () => {};
  }, [dispatch, lookupChain, currentSourceWalletAddress, tokenAccounts, nft]);

  //Sui accounts load
  useEffect(() => {
    if (lookupChain === CHAIN_ID_SUI && currentSourceWalletAddress) {
      if (
        !(tokenAccounts.data || tokenAccounts.isFetching || tokenAccounts.error)
      ) {
        getSuiParsedTokenAccounts(currentSourceWalletAddress, dispatch, nft);
      }
    }

    return () => {};
  }, [dispatch, lookupChain, currentSourceWalletAddress, tokenAccounts, nft]);

  const ethAccounts = useMemo(() => {
    const output = { ...tokenAccounts };
    output.data = output.data?.slice() || [];
    output.isFetching = output.isFetching || ethNativeAccountLoading;
    output.error = output.error || ethNativeAccountError;

    // To avoid have two MATIC in the list (issue: https://github.com/XLabs/portal-bridge-ui/issues/170)
    if (
      lookupChain === CHAIN_ID_POLYGON &&
      ethNativeAccount?.symbol === output.data[0]?.symbol &&
      ethNativeAccount?.amount === output.data[0]?.amount
    ) {
      output.data && output.data.shift();
    }
    ethNativeAccount && output.data && output.data.unshift(ethNativeAccount);

    return output;
  }, [
    tokenAccounts,
    ethNativeAccountLoading,
    ethNativeAccountError,
    ethNativeAccount,
    lookupChain,
  ]);

  return lookupChain === CHAIN_ID_SOLANA
    ? {
        tokenAccounts,
        mintAccounts: {
          data: solanaMintAccounts,
          isFetching: solanaMintAccountsLoading,
          error: solanaMintAccountsError,
          receivedAt: null, //TODO
        },
        resetAccounts: resetSourceAccounts,
      }
    : isEVMChain(lookupChain)
    ? {
        tokenAccounts: ethAccounts,
        covalent: {
          data: covalent,
          isFetching: covalentLoading,
          error: covalentError,
          receivedAt: null, //TODO
        },
        resetAccounts: resetSourceAccounts,
      }
    : isTerraChain(lookupChain)
    ? {
        resetAccounts: resetSourceAccounts,
      }
    : lookupChain === CHAIN_ID_ALGORAND
    ? {
        tokenAccounts,
        resetAccounts: resetSourceAccounts,
      }
    : lookupChain === CHAIN_ID_NEAR
    ? {
        tokenAccounts,
        resetAccounts: resetSourceAccounts,
      }
    : lookupChain === CHAIN_ID_XPLA
    ? {
        resetAccounts: resetSourceAccounts,
      }
    : lookupChain === CHAIN_ID_APTOS
    ? {
        tokenAccounts,
        resetAccounts: resetSourceAccounts,
      }
    : lookupChain === CHAIN_ID_INJECTIVE
    ? {
        resetAccounts: resetSourceAccounts,
      }
    : lookupChain === CHAIN_ID_SUI
    ? {
        tokenAccounts,
        resetAccounts: resetSourceAccounts,
      }
    : lookupChain === CHAIN_ID_SEI
    ? {
        resetAccounts: resetSourceAccounts,
      }
    : undefined;
}

export default useGetAvailableTokens;
