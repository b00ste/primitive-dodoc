# LSP14Ownable2Step

_Fabian Vogelsteller &lt;fabian@lukso.network&gt;, Jean Cavallera (CJ42), Yamen Merhi (YamenMerhi), Daniel Afteni (B00ste)_

> LSP14Ownable2Step

_This contract is a modified version of the [`OwnableUnset.sol`] implementation, where transferring and renouncing ownership works as a 2-step process. This can be used as a confirmation mechanism to prevent potential mistakes when transferring ownership of the contract, where the control of the contract could be lost forever. (*e.g: providing the wrong address as a parameter to the function, transferring ownership to an EOA for which the user lost its private key, etc...*)_

## Methods

### RENOUNCE_OWNERSHIP_CONFIRMATION_DELAY

```solidity
function RENOUNCE_OWNERSHIP_CONFIRMATION_DELAY() external view returns (uint256)
```

_The number of block that MUST pass before one is able to confirm renouncing ownership._

#### Returns

| Name | Type    | Description       |
| ---- | ------- | ----------------- |
| \_0  | uint256 | Number of blocks. |

### RENOUNCE_OWNERSHIP_CONFIRMATION_PERIOD

```solidity
function RENOUNCE_OWNERSHIP_CONFIRMATION_PERIOD() external view returns (uint256)
```

_The number of blocks during which one can renounce ownership._

#### Returns

| Name | Type    | Description       |
| ---- | ------- | ----------------- |
| \_0  | uint256 | Number of blocks. |

### acceptOwnership

```solidity
function acceptOwnership() external nonpayable
```

`msg.sender` is accepting ownership of contract: `address(this)`.
_Transfer ownership of the contract from the current {owner()} to the {pendingOwner()}. Once this function is called: - The current {owner()} will lose access to the functions restricted to the {owner()} only. - The {pendingOwner()} will gain access to the functions restricted to the {owner()} only._

### owner

```solidity
function owner() external view returns (address)
```

_Returns the address of the current owner._

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### pendingOwner

```solidity
function pendingOwner() external view returns (address)
```

_The address that ownership of the contract is transferred to. This address may use {acceptOwnership()} to gain ownership of the contract._

**Info:** _If no ownership transfer is in progress, the pendingOwner will be `address(0).`._

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```

`msg.sender` is renouncing ownership of contract `address(this)`.
_Renounce ownership of the contract in a 2-step process. 1. The first call will initiate the process of renouncing ownership. 2. The second call is used as a confirmation and will leave the contract without an owner._

**Danger:** _Leaves the contract without an owner. Once ownership of the contract has been renounced, any function that is restricted to be called only by the owner will be permanently inaccessible, making these functions not callable anymore and unusable._

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```

Transfer ownership initiated by `newOwner`.
_Initiate the process of transferring ownership of the contract by setting the new owner as the pending owner. If the new owner is a contract that supports + implements LSP1, this will also attempt to notify the new owner that ownership has been transferred to them by calling the {universalReceiver()} function on the `newOwner` contract._

#### Parameters

| Name     | Type    | Description                   |
| -------- | ------- | ----------------------------- |
| newOwner | address | The address of the new owner. |

## Internal Methods

### \_checkOwner

```solidity
function _checkOwner() internal view
```

_Throws if the sender is not the owner._

### \_setOwner

```solidity
function _setOwner(address newOwner) internal nonpayable
```

_Changes the owner if `newOwner` and oldOwner are different
This pattern is useful in inheritance._

### \_transferOwnership

```solidity
function _transferOwnership(address newOwner) internal nonpayable
```

_Set the pending owner of the contract and cancel any renounce ownership process that was previously started._

#### Parameters

| Name     | Type    | Description                           |
| -------- | ------- | ------------------------------------- |
| newOwner | address | The address of the new pending owner. |

### \_acceptOwnership

```solidity
function _acceptOwnership() internal nonpayable
```

_Set the pending owner of the contract as the new owner._

### \_renounceOwnership

```solidity
function _renounceOwnership() internal nonpayable
```

_Initiate or confirm the process of renouncing ownership after a specific delay of blocks have passed._

## Events

### OwnershipRenounced

```solidity
event OwnershipRenounced()
```

Successfully renounced ownership of the contract. This contract is now owned by anyone, it&#39;s owner is `address(0)`.
_Emitted when the ownership of the contract has been renounced._

### OwnershipTransferStarted

```solidity
event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner)
```

The transfer of ownership of the contract was initiated. Pending new owner set to: `newOwner`.
_Emitted when {transferOwnership(..)} was called and the first step of transferring ownership completed successfully which leads to {pendingOwner} being updated._

#### Parameters

| Name                    | Type    | Description                        |
| ----------------------- | ------- | ---------------------------------- |
| previousOwner `indexed` | address | The address of the previous owner. |
| newOwner `indexed`      | address | The address of the new owner.      |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```

#### Parameters

| Name                    | Type    | Description |
| ----------------------- | ------- | ----------- |
| previousOwner `indexed` | address | undefined   |
| newOwner `indexed`      | address | undefined   |

### RenounceOwnershipStarted

```solidity
event RenounceOwnershipStarted()
```

Ownership renouncement initiated.
_Emitted when starting the {renounceOwnership(..)} 2-step process._

## Errors

### LSP14CallerNotPendingOwner

```solidity
error LSP14CallerNotPendingOwner(address caller)
```

_Reverts when the `caller` that is trying to accept ownership of the contract is not the pending owner._

#### Parameters

| Name   | Type    | Description                                 |
| ------ | ------- | ------------------------------------------- |
| caller | address | The address that tried to accept ownership. |

### LSP14CannotTransferOwnershipToSelf

```solidity
error LSP14CannotTransferOwnershipToSelf()
```

Cannot transfer ownership to the address of the contract itself.
_Reverts when trying to transfer ownership to the `address(this)`._

### LSP14MustAcceptOwnershipInSeparateTransaction

```solidity
error LSP14MustAcceptOwnershipInSeparateTransaction()
```

Cannot accept ownership in the same transaction with {transferOwnership(...)}.
_Reverts when pending owner accept ownership in the same transaction of transferring ownership._

### LSP14NotInRenounceOwnershipInterval

```solidity
error LSP14NotInRenounceOwnershipInterval(uint256 renounceOwnershipStart, uint256 renounceOwnershipEnd)
```

Cannot confirm ownership renouncement yet. The ownership renouncement is allowed from: `renounceOwnershipStart` until: `renounceOwnershipEnd`.
_Reverts when trying to renounce ownership before the initial confirmation delay._

#### Parameters

| Name                   | Type    | Description                                                             |
| ---------------------- | ------- | ----------------------------------------------------------------------- |
| renounceOwnershipStart | uint256 | The start timestamp when one can confirm the renouncement of ownership. |
| renounceOwnershipEnd   | uint256 | The end timestamp when one can confirm the renouncement of ownership.   |

### OwnableCallerNotTheOwner

```solidity
error OwnableCallerNotTheOwner(address callerAddress)
```

_Reverts when only the owner is allowed to call the function._

#### Parameters

| Name          | Type    | Description                              |
| ------------- | ------- | ---------------------------------------- |
| callerAddress | address | The address that tried to make the call. |
