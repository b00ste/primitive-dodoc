# ILSP14Ownable2Step

> Interface of the LSP14 - Ownable 2-step standard, an extension of the [EIP173] (Ownable) standard with 2-step process to transfer or renounce ownership.

## Methods

### acceptOwnership

```solidity
function acceptOwnership() external nonpayable
```

`msg.sender` is accepting ownership of contract: `address(this)`.
_Transfer ownership of the contract from the current {owner()} to the {pendingOwner()}. Once this function is called: - The current {owner()} will lose access to the functions restricted to the {owner()} only. - The {pendingOwner()} will gain access to the functions restricted to the {owner()} only._

### pendingOwner

```solidity
function pendingOwner() external view returns (address)
```

_The address that ownership of the contract is transferred to. This address may use {acceptOwnership()} to gain ownership of the contract._

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

### RenounceOwnershipStarted

```solidity
event RenounceOwnershipStarted()
```

Ownership renouncement initiated.
_Emitted when starting the {renounceOwnership(..)} 2-step process._
