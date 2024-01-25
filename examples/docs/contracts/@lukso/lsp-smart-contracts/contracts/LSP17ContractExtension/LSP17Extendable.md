# LSP17Extendable

> Module to add more functionalities to a contract using extensions.

_Implementation of the `fallback(...)` logic according to LSP17 - Contract Extension standard. This module can be inherited to extend the functionality of the parent contract when calling a function that doesn&#39;t exist on the parent contract via forwarding the call to an extension mapped to the function selector being called, set originally by the parent contract_

## Methods

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```

_See {IERC165-supportsInterface}._

#### Parameters

| Name        | Type   | Description |
| ----------- | ------ | ----------- |
| interfaceId | bytes4 | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

## Internal Methods

### \_supportsInterfaceInERC165Extension

```solidity
function _supportsInterfaceInERC165Extension(bytes4 interfaceId) internal view returns (bool)
```

_Returns whether the interfaceId being checked is supported in the extension of the
{supportsInterface} selector.
To be used by extendable contracts wishing to extend the ERC165 interfaceIds originally
supported by reading whether the interfaceId queried is supported in the `supportsInterface`
extension if the extension is set, if not it returns false._

### \_getExtensionAndForwardValue

```solidity
function _getExtensionAndForwardValue(bytes4 functionSelector) internal view returns (address, bool)
```

_Returns the extension mapped to a specific function selector
If no extension was found, return the address(0)
To be overrided.
Up to the implementor contract to return an extension based on a function selector_

### \_fallbackLSP17Extendable

```solidity
function _fallbackLSP17Extendable(bytes callData) internal nonpayable returns (bytes)
```

_Forwards the call to an extension mapped to a function selector.
Calls {\_getExtensionAndForwardValue} to get the address of the extension mapped to the function selector being
called on the account. If there is no extension, the `address(0)` will be returned.
Forwards the value if the extension is payable.
Reverts if there is no extension for the function being called.
If there is an extension for the function selector being called, it calls the extension with the
`CALL` opcode, passing the `msg.data` appended with the 20 bytes of the {msg.sender} and 32 bytes of the `msg.value`._
