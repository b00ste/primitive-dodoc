# ILSP20CallVerifier

> Interface for the LSP20 Call Verification standard, a set of functions intended to perform verifications on behalf of another contract.

_Interface to be inherited for contract supporting LSP20-CallVerification_

## Methods

### lsp20VerifyCall

```solidity
function lsp20VerifyCall(address requestor, address target, address caller, uint256 value, bytes callData) external nonpayable returns (bytes4 returnedStatus)
```

#### Parameters

| Name      | Type    | Description                                                                        |
| --------- | ------- | ---------------------------------------------------------------------------------- |
| requestor | address | The address that requested to make the call to `target`.                           |
| target    | address | The address of the contract that implements the `LSP20CallVerification` interface. |
| caller    | address | The address who called the function on the `target` contract.                      |
| value     | uint256 | The value sent by the caller to the function called on the msg.sender              |
| callData  | bytes   | The calldata sent by the caller to the msg.sender                                  |

#### Returns

| Name           | Type   | Description                                                                                                                                                                                                                                                                                                                                     |
| -------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| returnedStatus | bytes4 | MUST return the first 3 bytes of `lsp20VerifyCall(address,uint256,bytes)` function selector if the call to the function is allowed, concatened with a byte that determines if the lsp20VerifyCallResult function should be called after the original function call. The byte that invoke the lsp20VerifyCallResult function is strictly `0x01`. |

### lsp20VerifyCallResult

```solidity
function lsp20VerifyCallResult(bytes32 callHash, bytes callResult) external nonpayable returns (bytes4)
```

#### Parameters

| Name       | Type    | Description                                                            |
| ---------- | ------- | ---------------------------------------------------------------------- |
| callHash   | bytes32 | The keccak256 hash of the parameters of {lsp20VerifyCall} concatenated |
| callResult | bytes   | The value result of the function called on the msg.sender              |

#### Returns

| Name | Type   | Description                                                                                    |
| ---- | ------ | ---------------------------------------------------------------------------------------------- |
| \_0  | bytes4 | MUST return the lsp20VerifyCallResult function selector if the call to the function is allowed |
