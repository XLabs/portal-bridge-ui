import {
  Dialog,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText, makeStyles
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Wallet, WalletState } from "@xlabs-libs/wallet-aggregator-core";
import { useCallback, useMemo } from "react";

const useStyles = makeStyles((theme) => ({
  flexTitle: {
    display: "flex",
    alignItems: "center",
    "& > div": {
      flexGrow: 1,
      marginRight: theme.spacing(4),
    },
    "& > button": {
      marginRight: theme.spacing(-1),
    },
  },
  icon: {
    height: 24,
    width: 24,
  },
}));

const WalletOptionContent = ({
  text, icon
}: {
  text: string,
  icon: string
}) => {
  const classes = useStyles();

  return (
    <>
      <ListItemIcon>
        <img
          src={icon}
          alt={text}
          className={classes.icon}
        />
      </ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </>
  );
}

const WalletOption = ({
  wallet,
  onSelect,
  onClose,
}: {
  wallet: Wallet;
  onSelect: (w: Wallet) => Promise<void>;
  onClose: () => void;
}) => {
  const handleClick = useCallback(() => {
    onSelect(wallet).then(onClose);
  }, [ wallet, onClose, onSelect ]);

  return (
    <ListItem button onClick={handleClick}>
      <WalletOptionContent icon={wallet.getIcon()} text={wallet.getName()} />
    </ListItem>
  );
};

const ConnectWalletDialog = ({
  isOpen,
  onSelect,
  onClose,
  wallets,
}: {
  isOpen: boolean;
  onSelect: (w: Wallet) => Promise<void>;
  onClose: () => void;
  wallets: Wallet[];
}) => {
  const classes = useStyles();

  const [detected, undetected] = useMemo(() => {
    const detected: Wallet[] = [];
    const undetected: Wallet[] = [];
    for (const wallet of wallets) {
      if (
        wallet.getWalletState() === WalletState.Installed ||
        wallet.getWalletState() === WalletState.Loadable
      ) {
        detected.push(wallet);
      } else if (wallet.getWalletState() === WalletState.NotDetected) {
        undetected.push(wallet);
      }
    }
    return [detected, undetected];
  }, [wallets]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        <div className={classes.flexTitle}>
          <div>Select your wallet</div>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <List>
        {detected.map((wallet) =>
          <WalletOption
            wallet={wallet}
            onSelect={onSelect}
            onClose={onClose}
            key={wallet.getName()}
          />
        )}
        {(!!detected.length && !!undetected.length) ? <Divider variant="middle" /> : <></>}
        {undetected.map((wallet) => (
          <ListItem
            button
            onClick={onClose}
            component="a"
            key={wallet.getName()}
            href={wallet.getUrl()}
            target="_blank"
            rel="noreferrer"
          >
            <WalletOptionContent
              icon={wallet.getIcon()}
              text={"Install " + wallet.getName()}
            />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};

export default ConnectWalletDialog;
