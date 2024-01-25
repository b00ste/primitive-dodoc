# LSP1Utils

_Jean Cavallera &lt;CJ42&gt;, Yamen Merhi &lt;YamenMerhi&gt;, Daniel Afteni &lt;B00ste&gt;_

> LSP1 Utility library.

_LSP1Utils is a library of utility functions that can be used to notify the `universalReceiver` function of a contract that implements LSP1 and retrieve informations related to LSP1 `typeId`. Based on LSP1 Universal Receiver standard._

## Internal Methods

### notifyUniversalReceiver

```solidity
function notifyUniversalReceiver(address lsp1Implementation, bytes32 typeId, bytes data) internal nonpayable
```

_Notify a contract at `lsp1Implementation` address by calling its `universalReceiver` function if this contract
supports the LSP1 interface._

#### Parameters

| Name               | Type    | Description                                                                                        |
| ------------------ | ------- | -------------------------------------------------------------------------------------------------- |
| lsp1Implementation | address | The address of the contract to notify.                                                             |
| typeId             | bytes32 | A `bytes32` typeId.                                                                                |
| data               | bytes   | Any optional data to send to the `universalReceiver` function to the `lsp1Implementation` address. |

### getLSP1DelegateValue

```solidity
function getLSP1DelegateValue(mapping(bytes32 =&gt; bytes) erc725YStorage) internal view returns (bytes)
```

Retrieving the value stored under the ERC725Y data key `LSP1UniversalReceiverDelegate`.
_Query internally the ERC725Y storage of a `ERC725Y` smart contract to retrieve
the value set under the `LSP1UniversalReceiverDelegate` data key._

#### Parameters

| Name           | Type                         | Description                                                 |
| -------------- | ---------------------------- | ----------------------------------------------------------- |
| erc725YStorage | mapping(bytes32 =&gt; bytes) | A reference to the ERC725Y storage mapping of the contract. |

#### Returns

| Name | Type  | Description                                                                |
| ---- | ----- | -------------------------------------------------------------------------- |
| \_0  | bytes | The bytes value stored under the `LSP1UniversalReceiverDelegate` data key. |

### getLSP1DelegateValueForTypeId

```solidity
function getLSP1DelegateValueForTypeId(mapping(bytes32 =&gt; bytes) erc725YStorage, bytes32 typeId) internal view returns (bytes)
```

Retrieving the value stored under the ERC725Y data key `LSP1UniversalReceiverDelegate:&lt;type-id&gt;` for a specific `typeId`.
_Query internally the ERC725Y storage of a `ERC725Y` smart contract to retrieve
the value set under the `LSP1UniversalReceiverDelegate:&lt;bytes32&gt;` data key for a specific LSP1 `typeId`._

#### Parameters

| Name           | Type                         | Description                                                 |
| -------------- | ---------------------------- | ----------------------------------------------------------- |
| erc725YStorage | mapping(bytes32 =&gt; bytes) | A reference to the ERC725Y storage mapping of the contract. |
| typeId         | bytes32                      | A bytes32 LSP1 `typeId`;                                    |

#### Returns

| Name | Type  | Description                                                                                |
| ---- | ----- | ------------------------------------------------------------------------------------------ |
| \_0  | bytes | The bytes value stored under the `LSP1UniversalReceiverDelegate:&lt;bytes32&gt;` data key. |
