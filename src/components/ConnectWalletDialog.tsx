import {
  Dialog,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText, makeStyles
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Wallet } from "@xlabs-libs/wallet-aggregator-core";
import { useCallback } from "react";

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

const WalletOptions = ({
  wallet,
  onSelect,
  onClose,
}: {
  wallet: Wallet;
  onSelect: (w: Wallet) => Promise<void>;
  onClose: () => void;
}) => {
  const classes = useStyles();

  const handleClick = useCallback(() => {
    onSelect(wallet).then(onClose);
  }, [ wallet, onClose, onSelect ]);

  return (
    <ListItem button onClick={handleClick}>
      <ListItemIcon>
        <img
          src={wallet.getIcon()}
          alt={wallet.getName()}
          className={classes.icon}
        />
      </ListItemIcon>
      <ListItemText>{wallet.getName()}</ListItemText>
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

  const options = wallets
    .map((wallet) => (
      <WalletOptions
        wallet={wallet}
        onSelect={onSelect}
        onClose={onClose}
        key={wallet.getName()}
      />
    ));

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
      <List>{options}</List>
    </Dialog>
  );
};

export default ConnectWalletDialog;
