---
sidebar_position: 2
title: Troubleshooting
---

## 🌉Portal bridge troubleshooting

### I have sent tokens to &lt;chain&gt; - my tokens did not arrive in my target wallet, but have left my origin wallet. What do I do?

You either a) need to redeem them, or, if redeeming was already successful, b) add them to your wallet:

**a) Redeeming:**

* Go to [https://portalbridge.com/#/redeem](https://portalbridge.com/#/redeem)
* You need to enter your source chain and the corresponding transaction id (which you can find in your wallet, or with your address in the blockchains explorer)
* Click Recover
* Click Redeem and accept the wallet approval

Check out our tutorial [here](../tutorials/how-to-use-recovery-workflow.md)

**b) Add them to your wallet:**

#### Metamask:

* In the Metamask assets tab, click import tokens&#x20;
* The contract address can be found in the relevant block explorer transaction and clicking the token name. When you click the token name, it will open a new window and the contract address is on the right-hand side in the profile summary.&#x20;
* You’ll also need a symbol - this can be anything you want to recognize the token as.&#x20;
* Click add custom token

See the video tutorial - How to add a token into your Metamask wallet [here.](../video-tutorials/how-to-manually-add-tokens-to-your-wallet.md#metamask)

#### Terra Station:

* Navigate to your Terra Finder transaction
* Scroll down to "show logs"
* Within **\[1] from\_contract**, you can find the token contract address as **contract\_address** (just below "amount"). Copy that contract address
* In your Terra Station wallet, navigate to **add token,** paste in the contract address, and click **add** as the final step


See video tutorial - How to add a token into your Terra wallet [here](../video-tutorials/how-to-manually-add-tokens-to-your-wallet.md#terra-station)

### The recipient address is not my wallet address!

**(Solana only)** This is because the recipient address shows the associated token account that is created within your Solana address. Unlike other blockchains, Solana requires you to create a new address for each token you own. When you click the associated token account address, you can find your Solana address as “owner”.



### I bridged X token but cannot swap it now. No DEX has liquid markets,

You bridged a token, which has no liquidity on the target chain. You will need to use Portal bridge to bridge this one back. You can do this by pasting the token contract address (which you can find in your wallet or with your address in the blockchains explorer) into the Portal “select a token” search field.&#x20;

You can find a comprehensive overview of liquid markets [here](./liquid-markets.mdx).&#x20;

### How can I redeem my tokens on the target chain?

If you've accidentally refreshed the page during the transfer process or did not redeem your tokens, you can follow the tutorial [here](../tutorials/how-to-use-recovery-workflow.md).&#x20;

### I want to migrate my V1 assets to Portal wrapped assets; however, the pools are empty.

Please reach out to our community managers on [discord](https://discord.com/invite/wormholecrypto) if the pools are empty.&#x20;
