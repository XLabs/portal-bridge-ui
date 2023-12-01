---
sidebar_position: 6
---
# Deep link to Portal Bridge

## Transfer

What if I want to share a link on social media or to a friend, and I want a pre-selection of **source-chain** and **target-chain**?

To do that we support two ways:

### Path URL

You can use a URL with the following format `https://www.portalbridge.com/<target-chain>/from/<source-chain>`, this will re-write the request to a query param URL, see below.

> re-write is transparent

Examples:

- https://www.portalbridge.com/bsc/from/arbitrum
- https://www.portalbridge.com/aptos/from/near
- https://www.portalbridge.com/sui/from/ethereum

### Query param URL

You can use a URL with the following query params `https://www.portalbridge.com/#/transfer?sourceChain=<source-chain>&targetChain=<target-chain>`.

Examples:

- https://www.portalbridge.com/#/transfer?sourceChain=bsc&targetChain=arbitrum
- https://www.portalbridge.com/#/transfer?sourceChain=near&targetChain=aptos
- https://www.portalbridge.com/#/transfer?sourceChain=ethereum&targetChain=sui

### Where could I find the supported chains?

You could use any of the chain names listed [here](https://github.com/wormhole-foundation/wormhole/blob/main/sdk/js/src/utils/consts.ts#L1)

### What about ids? 

Yes, you can also use ids from [here](https://github.com/wormhole-foundation/wormhole/blob/main/sdk/js/src/utils/consts.ts#L1).

Examples:

- https://www.portalbridge.com/bsc/from/arbitrum
- https://www.portalbridge.com/4/from/23

- https://www.portalbridge.com/#/transfer?sourceChain=bsc&targetChain=arbitrum
- https://www.portalbridge.com/#/transfer?sourceChain=4&targetChain=23

where:
- id 4 is for bsc, see https://github.com/wormhole-foundation/wormhole/blob/main/sdk/js/src/utils/consts.ts#L6
- id 23 is for arbitrum, see https://github.com/wormhole-foundation/wormhole/blob/main/sdk/js/src/utils/consts.ts#L25

### What about asset pre-selection?

Asset pre-selection is not yet supported.

## Recovery

What if I want to go directly to the recovery page [Redeem](https://www.portalbridge.com/#/redeem), and I want a pre-selection of **source-chain** and **transaction-id** or **vaa** (in hex format)?

To do that we support by:

### Source Chain and Transaction Id

#### Path URL

You can use a URL with the following format `https://www.portalbridge.com/recovery/<source-chain>/<transaction-id>`, this will re-write the request to a query param URL, see below.

> re-write is transparent

Examples:

- https://www.portalbridge.com/recovery/sui/CbXtcUMGoUA5w9PvsFHPNoK6r1iicam8rKjJT7sw5q7r

#### Query param URL

You can use a URL with the following query params `https://www.portalbridge.com/#/redeem?sourceChain=<source-chain>&transactionId=<transactionId>`.

Examples:

- https://www.portalbridge.com/#/redeem?sourceChain=21&transactionId=CbXtcUMGoUA5w9PvsFHPNoK6r1iicam8rKjJT7sw5q7r

#### What about ids? 

you could use the same logic as [What about ids?](#what-about-ids)

### VAA (in hex format)

#### Path URL

You can use a URL with the following format `https://www.portalbridge.com/recovery/<vaa>`, this will re-write the request to a query param URL, see below.

> re-write is transparent

Examples:

- [https://www.portalbridge.com/recovery/01000000030d00ae843da84...0000](https://www.portalbridge.com/recovery/01000000030d00ae843da8498ade5cddb91106b9a2596cec84599fcbc53c4ae856d6eb3f5d824576922d8faf77beeded91ab9ae3193a6cc9ed723e8ebec7772a108484b815f4d200038aa00a61fb56d88fa979df39255e2ea5b5754e20df7e5eeabcf5d02cf79e99063dd97bea794e85d958d7ac026937f38640d3f131268c8bad91d844dcc7a4c0c60106780b2a96b3edfd0a70e1c60d1aefe5d3af2c243bf4f020906576fce3af97fa49508ad16608c793247bc45d981cda03dc548f3cd23a4032128743818877dcf3730107db29a31928e388f3951c3980d73579d8d1bb04161755044c3c5bca549521f8135fd9f56ac4b0031c0861b3a1d75a7f1c9a055736b69009ab28b3d82d65f772500109a7d8b1041c9e5c4da3bd3e7f6e4ed90b12eced5e4d74018ab367e26373bd3b2c742c680c365a81db02fe121711e06c164bed3608e81de194317553776b989af8010af874905325b710b6767f573f9f25dfe84ef957724ca3a50f11050951650065577abbd9d6eb98091617e76288a69d491c740d5671b9b8ff39b529ef38516bbc2e000cbd05a5f5a4cfeb5aec8b45e00760b9e79608e614eeef39c96589bf82db81710c7e1b64807957a0c145cac4e1ab07be48972a20bb85dbca991c1f4a8a623daa45010de3f90eda668db2c228c9e800f400961f1d6edf7e0f4232ecd23cdcf98aa295c93aa579fb0d91961ca8d384c5c62a10a547766e3be5b852bc72409319e5d1d83c000e7c5efd3cb8bf0e841961f32643e541842d12c90ce7f19c2b50876247efec6d4e41b297c59bdd59cc280d5fda4c9c72dc288b7bbe167d4aef13ebe1223105cccb000ff3d6c894a1326c4e69f9b54d48d1793c0963047ab6fbbf15c06aedf398967a2173b222788cbb2c7406bf372517bfa4da32bc41889d8cd69f8971d52330f77e6b0010d3e9c11539088ec76d86373460081b9492bd4a4e0ea8a37141c0d6870df2e47c75b057ffd6ba5209b2d8086333b37b69ea92b540dfdf48ea83cac82acca5a84c0011f718d315b56b46defe07a9992cf26d32572c56b2c5f0701830e897266a43d3ae6ae05251d31b039742f2a22443b326e552cbe2b4767b98f054414b14f61a38c0001231712542e4a1d5ba99ea9fb091b9c2c44818134ffcb56c81599e6c52961eb00c1fc024f7fc5f34e7d110139f08efb004f8f2aad7d16cd6cb2128901b30beadb70064dcb2f500000000002086c5fd957e2db8389553e1728f9c27964b22a8154091ccba54d75f4b10c61f5e000000000000008c000100000000000000000000000000000000000000000000000000000000005ffa500000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400050000000000000000000000005be405bc18f129e7bf7c19b818c501a3bd87f2a700050000000000000000000000000000000000000000000000000000000000000000)

#### Query param URL

You can use a URL with the following query params `https://www.portalbridge.com/#/redeem?vaa=<vaa-hex>`.

Examples:

- [https://www.portalbridge.com/#/redeem?vaa=01000000030d00ae843da84...0000](https://www.portalbridge.com/#/redeem?vaa=01000000030d00ae843da8498ade5cddb91106b9a2596cec84599fcbc53c4ae856d6eb3f5d824576922d8faf77beeded91ab9ae3193a6cc9ed723e8ebec7772a108484b815f4d200038aa00a61fb56d88fa979df39255e2ea5b5754e20df7e5eeabcf5d02cf79e99063dd97bea794e85d958d7ac026937f38640d3f131268c8bad91d844dcc7a4c0c60106780b2a96b3edfd0a70e1c60d1aefe5d3af2c243bf4f020906576fce3af97fa49508ad16608c793247bc45d981cda03dc548f3cd23a4032128743818877dcf3730107db29a31928e388f3951c3980d73579d8d1bb04161755044c3c5bca549521f8135fd9f56ac4b0031c0861b3a1d75a7f1c9a055736b69009ab28b3d82d65f772500109a7d8b1041c9e5c4da3bd3e7f6e4ed90b12eced5e4d74018ab367e26373bd3b2c742c680c365a81db02fe121711e06c164bed3608e81de194317553776b989af8010af874905325b710b6767f573f9f25dfe84ef957724ca3a50f11050951650065577abbd9d6eb98091617e76288a69d491c740d5671b9b8ff39b529ef38516bbc2e000cbd05a5f5a4cfeb5aec8b45e00760b9e79608e614eeef39c96589bf82db81710c7e1b64807957a0c145cac4e1ab07be48972a20bb85dbca991c1f4a8a623daa45010de3f90eda668db2c228c9e800f400961f1d6edf7e0f4232ecd23cdcf98aa295c93aa579fb0d91961ca8d384c5c62a10a547766e3be5b852bc72409319e5d1d83c000e7c5efd3cb8bf0e841961f32643e541842d12c90ce7f19c2b50876247efec6d4e41b297c59bdd59cc280d5fda4c9c72dc288b7bbe167d4aef13ebe1223105cccb000ff3d6c894a1326c4e69f9b54d48d1793c0963047ab6fbbf15c06aedf398967a2173b222788cbb2c7406bf372517bfa4da32bc41889d8cd69f8971d52330f77e6b0010d3e9c11539088ec76d86373460081b9492bd4a4e0ea8a37141c0d6870df2e47c75b057ffd6ba5209b2d8086333b37b69ea92b540dfdf48ea83cac82acca5a84c0011f718d315b56b46defe07a9992cf26d32572c56b2c5f0701830e897266a43d3ae6ae05251d31b039742f2a22443b326e552cbe2b4767b98f054414b14f61a38c0001231712542e4a1d5ba99ea9fb091b9c2c44818134ffcb56c81599e6c52961eb00c1fc024f7fc5f34e7d110139f08efb004f8f2aad7d16cd6cb2128901b30beadb70064dcb2f500000000002086c5fd957e2db8389553e1728f9c27964b22a8154091ccba54d75f4b10c61f5e000000000000008c000100000000000000000000000000000000000000000000000000000000005ffa500000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400050000000000000000000000005be405bc18f129e7bf7c19b818c501a3bd87f2a700050000000000000000000000000000000000000000000000000000000000000000)

#### What about ids? 

you could use the same logic as [What about ids?](#what-about-ids)