---
sidebar_position: 3
title: Common error messages
---

# Common error messages

### **Error message: "Cannot read properties of undefined (reading 'replace')"**

This error means that the incorrect transaction was input into the redeem source tx field. You can find the correct one by searching your wallet address in the corresponding blockchain explorer and selecting the correct transaction. &#x20;

### Error message: "Unknown error"&#x20;

* Please ensure you have at least 0.01 SOL in your Solana wallet
* If you're using a ledger, ensure the software is up to date and ensure blind signing is turned on.&#x20;

### Error message: "**Transaction was not confirmed in 30.04 seconds. It is unknown if it succeeded or failed. Check signature xyz using the Solana Explorer or CLI tools."**

That indicates a temporary Solana network error. Please try again in a few hours, when TPS is above 2000: [https://explorer.solana.com/](https://explorer.solana.com/) (you need to scroll down a bit). With your origin source transaction id, you can redeem at any time here: [https://www.portalbridge.com/#/redeem](https://www.portalbridge.com/#/redeem)&#x20;

### Error message: "failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x0"

(Solana only)&#x20;

* Please ensure you have 0.01 Sol in your wallet
* You'll need to create an associated token account.&#x20;
  * Please open a new tab and do the redeem steps again: [https://portalbridge.com/#/redeem](https://portalbridge.com/#/redeem)&#x20;
  * You just need to enter your source chain and the corresponding transaction id (which you can find in your wallet, or with your address in the blockchains explorer)&#x20;
  * After completing, you can hover over the recipient’s address and click "force create account".
  * Click "redeem"

### Error message: "failed to get confirmed transaction: Invalid param: Invalid"

This error means the incorrect **source chain** was selected during the redeem process. Please double check the correct source chain was selected.&#x20;

### Error message: "**404 insufficient funds or unknown error, key not found, account not found / rpc error: code = NotFound desc = rpc error: code = NotFound desc = account not found: key not found"**

(Terra only) This means that you have insufficient funds in your wallet. Please make sure you have sufficient LUNA in your wallet to pay for network fees.&#x20;