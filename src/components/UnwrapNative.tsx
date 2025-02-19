import {
  CHAIN_ID_ARBITRUM,
  CHAIN_ID_AVAX,
  CHAIN_ID_BSC,
  CHAIN_ID_ETH,
  CHAIN_ID_FANTOM,
  CHAIN_ID_KLAYTN,
  CHAIN_ID_MOONBEAM,
  CHAIN_ID_NEON,
  CHAIN_ID_OASIS,
  CHAIN_ID_POLYGON,
  CHAIN_ID_BASE,
  ethers_contracts,
  CHAIN_ID_WORLDCHAIN,
  CHAIN_ID_SCROLL,
  CHAIN_ID_XLAYER,
  CHAIN_ID_MANTLE,
  CHAIN_ID_BERACHAIN,
} from "@certusone/wormhole-sdk";
import {
  Container,
  ListItemIcon,
  makeStyles,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { useEthereumProvider } from "../contexts/EthereumProviderContext";
import useIsWalletReady from "../hooks/useIsWalletReady";
import arbitrumIcon from "../icons/arbitrum.svg";
import baseIcon from "../icons/base.svg";
import avaxIcon from "../icons/avax.svg";
import bnbIcon from "../icons/bnb.svg";
import ethIcon from "../icons/eth.svg";
import fantomIcon from "../icons/fantom.svg";
import klaytnIcon from "../icons/klaytn.svg";
import moonbeamIcon from "../icons/moonbeam.svg";
import neonIcon from "../icons/neon.svg";
import oasisIcon from "../icons/oasis-network-rose-logo.svg";
import polygonIcon from "../icons/polygon.svg";
import worldchainIcon from "../icons/worldchain.svg";
import scrollIcon from "../icons/scroll.svg";
import berachainIcon from "../icons/berachain.svg";
import { COLORS } from "../muiTheme";
import {
  DataWrapper,
  errorDataWrapper,
  fetchDataWrapper,
  getEmptyDataWrapper,
  receiveDataWrapper,
} from "../store/helpers";
import {
  ARBWETH_ADDRESS,
  ARBWETH_DECIMALS,
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
  BASE_WETH_ADDRESS,
  BASE_WETH_DECIMALS,
  WORLDWETH_ADDRESS,
  WORLDWETH_DECIMALS,
  SCROLLWETH_ADDRESS,
  SCROLLWETH_DECIMALS,
  WMNT_ADDRESS,
  WMNT_DECIMALS,
  WOKB_ADDRESS,
  WOKB_DECIMALS,
  BERAWETH_ADDRESS,
  BERAWETH_DECIMALS,
} from "../utils/consts";
import parseError from "../utils/parseError";
import ButtonWithLoader from "./ButtonWithLoader";
import ConnectWalletButton from "./ConnectWalletButton";
import HeaderText from "./HeaderText";
import { chainToIcon } from "@wormhole-foundation/sdk-icons";

const useStyles = makeStyles((theme) => ({
  formControl: {
    display: "flex",
    margin: `${theme.spacing(1)}px auto`,
    width: "100%",
    maxWidth: 400,
    textAlign: "center",
  },
  mainPaper: {
    backgroundColor: COLORS.whiteWithTransparency,
    textAlign: "center",
    padding: "2rem",
    "& > h, p ": {
      margin: ".5rem",
    },
  },
  select: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    "& .MuiSelect-root": {
      display: "flex",
      alignItems: "center",
    },
  },
  listItemIcon: {
    minWidth: 40,
  },
  icon: {
    height: 24,
    maxWidth: 24,
  },
}));

const supportedTokens = {
  [CHAIN_ID_ETH]: {
    symbol: "WETH",
    icon: ethIcon,
    address: WETH_ADDRESS,
    decimals: WETH_DECIMALS,
  },
  [CHAIN_ID_BSC]: {
    symbol: "WBNB",
    icon: bnbIcon,
    address: WBNB_ADDRESS,
    decimals: WBNB_DECIMALS,
  },
  [CHAIN_ID_POLYGON]: {
    symbol: "WMATIC",
    icon: polygonIcon,
    address: WMATIC_ADDRESS,
    decimals: WMATIC_DECIMALS,
  },
  [CHAIN_ID_AVAX]: {
    symbol: "WAVAX",
    icon: avaxIcon,
    address: WAVAX_ADDRESS,
    decimals: WAVAX_DECIMALS,
  },
  [CHAIN_ID_OASIS]: {
    symbol: "WROSE",
    icon: oasisIcon,
    address: WROSE_ADDRESS,
    decimals: WROSE_DECIMALS,
  },
  [CHAIN_ID_FANTOM]: {
    symbol: "WFTM",
    icon: fantomIcon,
    address: WFTM_ADDRESS,
    decimals: WFTM_DECIMALS,
  },
  [CHAIN_ID_KLAYTN]: {
    symbol: "WKLAY",
    icon: klaytnIcon,
    address: WKLAY_ADDRESS,
    decimals: WKLAY_DECIMALS,
  },
  [CHAIN_ID_NEON]: {
    symbol: "WNEON",
    icon: neonIcon,
    address: WNEON_ADDRESS,
    decimals: WNEON_DECIMALS,
  },
  [CHAIN_ID_MOONBEAM]: {
    symbol: "WGLMR",
    icon: moonbeamIcon,
    address: WGLMR_ADDRESS,
    decimals: WGLMR_DECIMALS,
  },
  [CHAIN_ID_ARBITRUM]: {
    symbol: "WETH",
    icon: arbitrumIcon,
    address: ARBWETH_ADDRESS,
    decimals: ARBWETH_DECIMALS,
  },
  [CHAIN_ID_BASE]: {
    symbol: "WETH",
    icon: baseIcon,
    address: BASE_WETH_ADDRESS,
    decimals: BASE_WETH_DECIMALS,
  },
  [CHAIN_ID_WORLDCHAIN]: {
    symbol: "WETH",
    icon: worldchainIcon,
    address: WORLDWETH_ADDRESS,
    decimals: WORLDWETH_DECIMALS,
  },
  [CHAIN_ID_BERACHAIN]: {
    symbol: "WETH",
    icon: berachainIcon,
    address: BERAWETH_ADDRESS,
    decimals: BERAWETH_DECIMALS,
  },
  [CHAIN_ID_SCROLL]: {
    symbol: "WETH",
    icon: scrollIcon,
    address: SCROLLWETH_ADDRESS,
    decimals: SCROLLWETH_DECIMALS,
  },
  [CHAIN_ID_MANTLE]: {
    symbol: "WMNT",
    icon: chainToIcon("Mantle"),
    address: WMNT_ADDRESS,
    decimals: WMNT_DECIMALS,
  },
  [CHAIN_ID_XLAYER]: {
    symbol: "WOKB",
    icon: chainToIcon("Xlayer"),
    address: WOKB_ADDRESS,
    decimals: WOKB_DECIMALS,
  },
} as const;

type SupportedChain = keyof typeof supportedTokens;

interface BalancesInfo {
  native: ethers.BigNumber;
  wrapped: ethers.BigNumber;
}

function UnwrapNative() {
  const classes = useStyles();
  const [selectedChainId, setSelectedChainId] = useState<SupportedChain>(
    CHAIN_ID_ETH as SupportedChain
  );
  const [balances, setBalances] = useState<DataWrapper<BalancesInfo>>(
    getEmptyDataWrapper()
  );
  const [unwrapRequest, setUnwrapRequest] = useState<DataWrapper<boolean>>(
    getEmptyDataWrapper()
  );
  const { signer } = useEthereumProvider(selectedChainId);
  const { isReady, statusMessage } = useIsWalletReady(selectedChainId);
  const handleSelect = useCallback((event) => {
    setSelectedChainId(parseInt(event.target.value) as SupportedChain);
  }, []);
  useEffect(() => {
    setBalances(getEmptyDataWrapper());
    setUnwrapRequest(getEmptyDataWrapper());
  }, [selectedChainId]);
  useEffect(() => {
    if (!isReady || !signer) return;
    setBalances(fetchDataWrapper());
    let cancelled = false;
    (async () => {
      try {
        const native = await signer.getBalance();
        if (cancelled) return;
        const wrappedToken = await ethers_contracts.MockWETH9__factory.connect(
          supportedTokens[selectedChainId].address,
          signer
        );
        if (cancelled) return;
        const signerAddress = await signer.getAddress();
        if (cancelled) return;
        const wrapped = await wrappedToken.balanceOf(signerAddress);
        if (cancelled) return;
        setBalances(receiveDataWrapper({ native, wrapped }));
      } catch (e) {
        console.error(e);
        if (cancelled) return;
        setBalances(
          errorDataWrapper("An error occurred while fetching balances")
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isReady, signer, selectedChainId, unwrapRequest.data]);
  const handleClick = useCallback(() => {
    if (!isReady || !signer || !balances.data || balances.data.wrapped.eq(0))
      return;
    const amount = balances.data.wrapped;
    let cancelled = false;
    setUnwrapRequest(fetchDataWrapper());
    (async () => {
      try {
        const wrappedToken = await ethers_contracts.MockWETH9__factory.connect(
          supportedTokens[selectedChainId].address,
          signer
        );
        const tx = await wrappedToken.withdraw(amount);
        await tx.wait();
        if (cancelled) return;
        setUnwrapRequest(receiveDataWrapper(true));
      } catch (e) {
        console.error(e);
        if (cancelled) return;
        setUnwrapRequest(errorDataWrapper(parseError(e)));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isReady, signer, selectedChainId, balances.data]);
  const error = unwrapRequest.error || balances.error || statusMessage;
  return (
    <Container maxWidth="md">
      <HeaderText white>Unwrap Native Tokens</HeaderText>
      <Paper className={classes.mainPaper}>
        <Typography style={{ textAlign: "center" }}>
          Unwrap (withdraw) native tokens from their wrapped form (e.g. WETH
          &rarr; ETH)
        </Typography>
        <ConnectWalletButton chainId={selectedChainId} />
        <TextField
          select
          value={selectedChainId}
          onChange={handleSelect}
          className={classes.select}
          disabled={unwrapRequest.isFetching}
        >
          {Object.entries(supportedTokens).map(([key, item]) => (
            <MenuItem key={key} value={key}>
              <ListItemIcon className={classes.listItemIcon}>
                <img
                  src={item.icon}
                  alt={item.symbol}
                  className={classes.icon}
                />
              </ListItemIcon>
              {item.symbol}
            </MenuItem>
          ))}
        </TextField>
        <Typography variant="h5" gutterBottom>
          {formatUnits(
            balances.data?.wrapped || 0,
            supportedTokens[selectedChainId].decimals
          )}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {supportedTokens[selectedChainId].symbol.substring(1)}
        </Typography>
        <Typography variant="h5" gutterBottom>
          {formatUnits(
            balances.data?.native || 0,
            supportedTokens[selectedChainId].decimals
          )}
        </Typography>
        <Typography variant="h5" gutterBottom></Typography>
        <ButtonWithLoader
          disabled={
            !isReady ||
            balances.isFetching ||
            !balances.data ||
            balances.data.wrapped.eq(0) ||
            unwrapRequest.isFetching
          }
          onClick={handleClick}
          showLoader={balances.isFetching || unwrapRequest.isFetching}
          error={error}
        >
          Unwrap All
        </ButtonWithLoader>
      </Paper>
    </Container>
  );
}

export default UnwrapNative;
