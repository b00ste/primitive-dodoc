# ILSP0ERC725Account

_Fabian Vogelsteller &lt;fabian@lukso.network&gt;, Jean Cavallera (CJ42)_

> Interface of the [LSP-0-ERC725Account] standard, an account based smart contract that represents an identity on-chain.

## Methods

### batchCalls

```solidity
function batchCalls(bytes[] data) external nonpayable returns (bytes[] results)
```

Executing the following batch of abi-encoded function calls on the contract: `data`.
_Allows a caller to batch different function calls in one call. Perform a `delegatecall` on self, to call different functions with preserving the context._

#### Parameters

| Name | Type    | Description                                                          |
| ---- | ------- | -------------------------------------------------------------------- |
| data | bytes[] | An array of ABI encoded function calls to be called on the contract. |

#### Returns

| Name    | Type    | Description                                                      |
| ------- | ------- | ---------------------------------------------------------------- |
| results | bytes[] | An array of abi-encoded data returned by the functions executed. |
