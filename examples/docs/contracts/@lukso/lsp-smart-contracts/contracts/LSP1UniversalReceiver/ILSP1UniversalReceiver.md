# ILSP1UniversalReceiver

> Interface of the LSP1 - Universal Receiver standard, an entry function for a contract to receive arbitrary information.

_LSP1UniversalReceiver allows to receive arbitrary messages and to be informed when assets are sent or received._

## Methods

### universalReceiver

```solidity
function universalReceiver(bytes32 typeId, bytes data) external payable returns (bytes)
```

Reacted on received notification with `typeId` &amp; `data`.
_Generic function that can be used to notify the contract about specific incoming transactions or events like asset transfers, vault transfers, etc. Allows for custom on-chain and off-chain reactions based on the `typeId` and `data`._

#### Parameters

| Name   | Type    | Description                                |
| ------ | ------- | ------------------------------------------ |
| typeId | bytes32 | The hash of a specific standard or a hook. |
| data   | bytes   | The arbitrary data received with the call. |

#### Returns

| Name | Type  | Description |
| ---- | ----- | ----------- |
| \_0  | bytes | undefined   |

## Events

### UniversalReceiver

```solidity
event UniversalReceiver(address indexed from, uint256 indexed value, bytes32 indexed typeId, bytes receivedData, bytes returnedValue)
```

Address `from` called the `universalReceiver(...)` function while sending `value` LYX. Notification type (typeId): `typeId` - Data received: `receivedData`.
_Emitted when the {universalReceiver} function was called with a specific `typeId` and some `receivedData`_

#### Parameters

| Name             | Type    | Description                                                                                                                                                                                       |
| ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| from `indexed`   | address | The address of the EOA or smart contract that called the {universalReceiver(...)} function.                                                                                                       |
| value `indexed`  | uint256 | The amount sent to the {universalReceiver(...)} function.                                                                                                                                         |
| typeId `indexed` | bytes32 | A `bytes32` unique identifier (= _&quot;hook&quot;_)that describe the type of notification, information or transaction received by the contract. Can be related to a specific standard or a hook. |
| receivedData     | bytes   | Any arbitrary data that was sent to the {universalReceiver(...)} function.                                                                                                                        |
| returnedValue    | bytes   | The value returned by the {universalReceiver(...)} function.                                                                                                                                      |
