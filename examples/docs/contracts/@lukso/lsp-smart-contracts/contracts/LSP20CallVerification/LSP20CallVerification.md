# LSP20CallVerification

> Implementation of a contract calling the verification functions according to LSP20 - Call Verification standard.

_Module to be inherited used to verify the execution of functions according to a verifier address. Verification can happen before or after execution based on a returnedStatus._

## Internal Methods

### \_verifyCall

```solidity
function _verifyCall(address logicVerifier) internal nonpayable returns (bool verifyAfter)
```

_Calls {lsp20VerifyCall} function on the logicVerifier._

### \_verifyCallResult

```solidity
function _verifyCallResult(address logicVerifier, bytes callResult) internal nonpayable
```

_Calls {lsp20VerifyCallResult} function on the logicVerifier._

### \_revertWithLSP20DefaultError

```solidity
function _revertWithLSP20DefaultError(bool postCall, bytes returnedData) internal pure
```
