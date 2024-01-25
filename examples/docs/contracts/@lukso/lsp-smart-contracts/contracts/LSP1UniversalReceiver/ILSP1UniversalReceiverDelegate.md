# ILSP1UniversalReceiverDelegate

> Interface of the LSP1 - Universal Receiver Delegate standard.

_This interface allows contracts implementing the LSP1UniversalReceiver function to delegate the reaction logic to another contract or account. By doing so, the main logic doesn&#39;t need to reside within the `universalReceiver` function itself, offering modularity and flexibility._

## Methods

### universalReceiverDelegate

```solidity
function universalReceiverDelegate(address sender, uint256 value, bytes32 typeId, bytes data) external nonpayable returns (bytes)
```

Reacted on received notification forwarded from `universalReceiver` with `typeId` &amp; `data`.
_A delegate function that reacts to calls forwarded from the `universalReceiver(..)` function. This allows for modular handling of the logic based on the `typeId` and `data` provided by the initial caller._

#### Parameters

| Name   | Type    | Description                                                                                      |
| ------ | ------- | ------------------------------------------------------------------------------------------------ |
| sender | address | The address of the EOA or smart contract that initially called the `universalReceiver` function. |
| value  | uint256 | The amount sent by the `sender` to the `universalReceiver` function.                             |
| typeId | bytes32 | The hash of a specific standard or a hook.                                                       |
| data   | bytes   | The arbitrary data received with the initial call to `universalReceiver`.                        |

#### Returns

| Name | Type  | Description |
| ---- | ----- | ----------- |
| \_0  | bytes | undefined   |
