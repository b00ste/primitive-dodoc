# OwnableUnset

> OwnableUnset

_modified version of OpenZeppelin implementation, where: - \_setOwner(address) function is internal, so this function can be used in constructor of contracts implementation (instead of using transferOwnership(address) - the contract does not inherit from Context contract_

## Methods

### owner

```solidity
function owner() external view returns (address)
```

_Returns the address of the current owner._

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```

_Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner._

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```

_Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner._

#### Parameters

| Name     | Type    | Description |
| -------- | ------- | ----------- |
| newOwner | address | undefined   |

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

## Events

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```

#### Parameters

| Name                    | Type    | Description |
| ----------------------- | ------- | ----------- |
| previousOwner `indexed` | address | undefined   |
| newOwner `indexed`      | address | undefined   |

## Errors

### OwnableCallerNotTheOwner

```solidity
error OwnableCallerNotTheOwner(address callerAddress)
```

_Reverts when only the owner is allowed to call the function._

#### Parameters

| Name          | Type    | Description                              |
| ------------- | ------- | ---------------------------------------- |
| callerAddress | address | The address that tried to make the call. |

### OwnableCannotSetZeroAddressAsOwner

```solidity
error OwnableCannotSetZeroAddressAsOwner()
```

_Reverts when trying to set `address(0)` as the contract owner when deploying the contract, initializing it or transferring ownership of the contract._
