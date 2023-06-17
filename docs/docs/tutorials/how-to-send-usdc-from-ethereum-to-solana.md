---
title: How to send USDC from Ethereum to Solana
sidebar_position: 1

---

# How to send USDC from Ethereum to Solana

USDC is deployed natively on both ETH and SOL, and wrapped versions of USDC from the two chains are not compatible with each other, so it's important to know which version of USDC you start with. Sending native USDC from Ethereum to Solana will result in USDCet. Sending native USDC from Solana to Ethereum will result in USDCso.

After moving your USDC cross-chain (from Ethereum to Solana, for example), you'll then need to use a swap platform (like Saber or Mercurial) to swap your Wormhole wrapped token into native USDC on Solana. Here is a tutorial on how to send USDC from Ethereum to Solana and using a swap platform to obtain native USDC.

### Summary:

1. Transfer USDC from Ethereum to Solana. You will receive ETH-USDC (Wormhole)
2. Use a swap platform such as Saber or Mercurial to swap to native USDC
3. Success! You now have native USDC on Solana.

Head to [https://portalbridge.com/#/transfer](https://portalbridge.com/#/transfer) to start transferring!

### **Step 1 - Source**

* Select your origin chain (Ethereum)
* Connect your wallet
* Enter the number of tokens you wish to send
* Click "Next"

_Note: Warning will come up if you have a low ETH balance_

![](<../../static/img/Screen Shot 2021-10-11 at 12.13.09 am.png>)

### **Step 2 - Target**

* Select Solana as your target chain
* Connect your wallet

![](<../../static/img/Screen Shot 2021-10-11 at 12.14.21 am.png>)

If this is your first time sending the token to Solana, you will need to create a token account.

* Click "Create associated token account"
* Approve the wallet approval pop up
* Click "Next"

### **Step 3 - Send Tokens**

* Click "Approve X tokens"

_Optional: Select "Approve unlimited tokens" (This option is recommended for users who intend to use the bridge frequently)_

* Accept wallet approval pop up‌

![](<../../static/img/Screen Shot 2021-10-11 at 12.15.42 am.png>)

* Click "Transfer"

![](<../../static/img/Screen Shot 2021-10-11 at 12.17.02 am.png>)

* Wait for 15 confirmations on Ethereum

![](<../../static/img/Screen Shot 2021-10-11 at 12.18.35 am.png>)

‌_Note: Once you approve the transfer, you must complete the transaction. If you navigate away from this page, you will need to complete the_ [_redeem workflow_](./how-to-use-recovery-workflow.md)

### **Step 4 - Redeem**

* Make sure to click "Redeem"
* Approve the multiple wallet approvals

![](<../../static/img/Screen Shot 2021-10-11 at 12.22.20 am.png>)

* You've successfully sent your tokens 🎉
* You can view the successful transaction on Solana Explorer by clicking "view on explorer"

![](<../../static/img/Screen Shot 2021-10-11 at 12.22.41 am.png>)

### Swapping USDCet(Wormhole) to native USDC on Solana

There are a few platforms that you can use to swap your ETH-USDC (Wormhole) to native USDC on Solana such as Mercurial and Saber. In below example we use Saber.

1. Navigate to [https://app.saber.so/#/swap](https://app.saber.so/#/swap)
2. Connect your wallet
3. Select USDCet(Wormhole) & enter amount you want to swap
4. Select the token you want to swap USDCet to. In this example, we will swap it to USDC

![](<../../static/img/Screen Shot 2021-10-08 at 4.13.45 am.png>)



5\. Click "Review"

6\. Click "Confirm Swap"

7\. Approve wallet pop up

![](<../../static/img/Screen Shot 2021-10-11 at 12.07.27 am.png>)

Success🎉! You've now swapped your USDCet to native USDC on Solana.
