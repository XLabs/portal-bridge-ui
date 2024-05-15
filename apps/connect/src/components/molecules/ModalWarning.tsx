import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import CloseIcon from '../../icons/Close';
import { makeStyles } from 'tss-react/mui';
import { Button, Link } from '@mui/material';
import { Corridor, WarningLiquidMarkets } from '../../providers/liquid-markets';
import ChainIcon from '../atoms/ChainIcon';
import { getExplorerURL, toChainNameIcon } from '../../helpers/explorer';

const useStyles = makeStyles()((theme: any) => ({
  dialog: {
    zIndex: 10,
  },
  paper: {
    borderRadius: 24,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      maxHeight: '100%',
      margin: 0,
      borderRadius: 0,
    },
  },
  container: {
    position: 'relative',
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
  },
  modal: {
    width: '100%',
    padding: 32,
    position: 'relative',
    maxHeight: 'calc( 100vh - 80px )',
    [theme.breakpoints.down('sm')]: {
      padding: '24px 12px',
      maxHeight: '100%',
    },
  },
  close: {
    color: '#3C3D77',
    position: 'absolute',
    top: '28px',
    right: '28px',
    cursor: 'pointer',
    opacity: '70%',
    zIndex: '10',
    [theme.breakpoints.down('sm')]: {
      top: '12px',
      right: '20px',
    },
  },
  background: {
    //background: '',
  },
  icon: {
    textAlign: 'center',
    paddingTop: 24,
    paddingBottom: 24,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 600,
    lineHeight: '32px',
    paddingTop: 24,
    paddingBottom: 24,
    borderBottom: '1px solid #313266',
  },
  text: {
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '24px',
    color: '#9495D6',
    paddingTop: 24,
    paddingBottom: 24,
  },
  link: {
    color: '#D5D5EB',
    textDecorationLine: 'underline',
  },
  orange: {
    color: '#E48329',
  },
  clock: {
    width: 64,
    height: 64,
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '24px',
    gap: 10,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'end',
    marginTop: '24px',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  cancelButton: {
    color: '#9495D6',
    borderColor: '#9495D6',
  },
}));

interface ModalProps {
  isOpen: boolean;
  warningType?: WarningLiquidMarkets;
  corridor?: Corridor;
  onClose?: () => void;
  onContinue?: () => void;
};

const TransferLimitedWarning = ({ isOpen, warningType = WarningLiquidMarkets.NO_WARNING, corridor, onClose, onContinue }: ModalProps) => {
  const { classes } = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };
  const handleContinue = () => {
    setOpen(false);
    onContinue && onContinue();
  };

  useEffect(() => {
    console.log('warningType', warningType, corridor?.fromChain, corridor?.toChain, corridor?.toToken);
    const open = warningType !== WarningLiquidMarkets.NO_WARNING || isOpen;
    setOpen(open);
  }, [warningType, corridor?.fromChain, corridor?.toChain, corridor?.toToken]);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  let message, title, footer;
  const explorerURL = !!corridor?.toChain ? getExplorerURL(corridor?.toChain) : '';
  const chainName = !!corridor?.toChain ? toChainNameIcon(corridor?.toChain) : '';
  if (warningType === WarningLiquidMarkets.MANUALLY_WARNED_CORRIDOR || warningType === WarningLiquidMarkets.RARE_CORRIDOR) {
    // TODO: Get mainnet name in some testnet cases this logo and explorer link will be wrong
    title = (<>
      <span className={classes.orange}>{warningType}</span>
    </>);
    message = (<>
      This token may not have liquidity available on the destination chain.
      <br /><br />
      <span>You will receive this token on {chainName} <span><ChainIcon chain={corridor?.toChain} /></span> : <Link href={explorerURL}>{explorerURL}</Link></span>
      
      <br /><br />
      Please confirm that you would like to transfer this token to {chainName}. If there isn't sufficient liquidity, you may need to transfer it back to {corridor?.fromChain}
    </>);
    footer = (<>
      <div className={classes.buttonsContainer}>
        <Button variant="outlined" onClick={handleClose} className={classes.cancelButton}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleContinue}>Continue</Button>
      </div>
    </>);
  }
  if (warningType === WarningLiquidMarkets.NEW_CORRIDOR) {
    title = (<>
      <span className={classes.orange}>{warningType}</span>
    </>);
    message = (<>
      This asset has never been bridged to {chainName} <ChainIcon chain={corridor?.toChain} /> on Wormhole before!
      <br /><br />
      If you think it should be supported, consider asking on <Link href="https://discord.com/invite/wormholecrypto">discord</Link>.
      <br /><br />
      Alternately, if you’re a developer, consider using the <Link href={`/advanced-tools/`}>Advanced Tool</Link>
    </>);
    footer = (<>
      <div className={classes.buttonContainer}>
        <Button variant="contained" onClick={handleClose}>OK</Button>
      </div>
    </>);
  }

  return (
    <Dialog
      open={open}
      sx={{ borderRadius: 8 }}
      className={classes.dialog}
      classes={{ paper: classes.paper }}
    >
      <ScopedCssBaseline enableColorScheme>
        <div className={classes.container}>
          <CloseIcon
            sx={{ fontSize: 32 }}
            className={classes.close}
            onClick={handleClose}
          />
          <div className={classes.modal}>
            <div className={classes.title}>{title}</div>
            <div className={classes.text}>{message}</div>
            {footer}
          </div>
        </div>
      </ScopedCssBaseline>
    </Dialog>
  );

  return null;

};

export default TransferLimitedWarning;
