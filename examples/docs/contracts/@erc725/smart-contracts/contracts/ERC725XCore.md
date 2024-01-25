# ERC725XCore

_Fabian Vogelsteller &lt;fabian@lukso.network&gt; It allows to use different type of message calls to interact with addresses such as `call`, `staticcall` and `delegatecall`. It also allows to deploy and create new contracts via both the `create` and `create2` opcodes. This is the basis for a smart contract based account system, but could also be used as a proxy account system._

> Core implementation of ERC725X sub-standard, a generic executor.

## Methods

### execute

```solidity
function execute(uint256 operationType, address target, uint256 value, bytes data) external payable returns (bytes)
```

Calling address `target` using `operationType`, transferring `value` wei and data: `data`.
_Generic executor function to: - send native tokens to any address. - interact with any contract by passing an abi-encoded function call in the `data` parameter. - deploy a contract by providing its creation bytecode in the `data` parameter._

#### Parameters

| Name          | Type    | Description                                                                                           |
| ------------- | ------- | ----------------------------------------------------------------------------------------------------- |
| operationType | uint256 | The operation type used: CALL = 0; CREATE = 1; CREATE2 = 2; STATICCALL = 3; DELEGATECALL = 4          |
| target        | address | The address of the EOA or smart contract. (unused if a contract is created via operation type 1 or 2) |
| value         | uint256 | The amount of native tokens to transfer (in Wei)                                                      |
| data          | bytes   | The call data, or the creation bytecode of the contract to deploy if `operationType` is `1` or `2`.   |

#### Returns

| Name | Type  | Description |
| ---- | ----- | ----------- |
| \_0  | bytes | undefined   |

### executeBatch

```solidity
function executeBatch(uint256[] operationsType, address[] targets, uint256[] values, bytes[] datas) external payable returns (bytes[])
```

Calling multiple addresses `targets` using `operationsType`, transferring `values` wei and data: `datas`.
_Batch executor function that behaves the same as {execute} but allowing multiple operations in the same transaction._

#### Parameters

| Name           | Type      | Description                                                                                                     |
| -------------- | --------- | --------------------------------------------------------------------------------------------------------------- |
| operationsType | uint256[] | The list of operations type used: `CALL = 0`; `CREATE = 1`; `CREATE2 = 2`; `STATICCALL = 3`; `DELEGATECALL = 4` |
| targets        | address[] | The list of addresses to call. `targets` will be unused if a contract is created (operation types 1 and 2).     |
| values         | uint256[] | The list of native token amounts to transfer (in Wei).                                                          |
| datas          | bytes[]   | The list of calldata, or the creation bytecode of the contract to deploy if `operationType` is `1` or `2`.      |

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | bytes[] | undefined   |

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

### \_execute

```solidity
function _execute(uint256 operationType, address target, uint256 value, bytes data) internal nonpayable returns (bytes)
```

_check the `operationType` provided and perform the associated low-level opcode after checking for requirements (see {execute})._

### \_executeBatch

```solidity
function _executeBatch(uint256[] operationsType, address[] targets, uint256[] values, bytes[] datas) internal nonpayable returns (bytes[])
```

_check each `operationType` provided in the batch and perform the associated low-level opcode after checking for requirements (see {executeBatch})._

### \_executeCall

```solidity
function _executeCall(address target, uint256 value, bytes data) internal nonpayable returns (bytes result)
```

_Perform low-level call (operation type = 0)_

#### Parameters

| Name   | Type    | Description                           |
| ------ | ------- | ------------------------------------- |
| target | address | The address on which call is executed |
| value  | uint256 | The value to be sent with the call    |
| data   | bytes   | The data to be sent with the call     |

#### Returns

| Name   | Type  | Description            |
| ------ | ----- | ---------------------- |
| result | bytes | The data from the call |

### \_executeStaticCall

```solidity
function _executeStaticCall(address target, bytes data) internal nonpayable returns (bytes result)
```

_Perform low-level staticcall (operation type = 3)_

#### Parameters

| Name   | Type    | Description                                 |
| ------ | ------- | ------------------------------------------- |
| target | address | The address on which staticcall is executed |
| data   | bytes   | The data to be sent with the staticcall     |

#### Returns

| Name   | Type  | Description                           |
| ------ | ----- | ------------------------------------- |
| result | bytes | The data returned from the staticcall |

### \_executeDelegateCall

```solidity
function _executeDelegateCall(address target, bytes data) internal nonpayable returns (bytes result)
```

_Perform low-level delegatecall (operation type = 4)_

#### Parameters

| Name   | Type    | Description                                   |
| ------ | ------- | --------------------------------------------- |
| target | address | The address on which delegatecall is executed |
| data   | bytes   | The data to be sent with the delegatecall     |

#### Returns

| Name   | Type  | Description                             |
| ------ | ----- | --------------------------------------- |
| result | bytes | The data returned from the delegatecall |

### \_deployCreate

```solidity
function _deployCreate(uint256 value, bytes creationCode) internal nonpayable returns (bytes newContract)
```

_Deploy a contract using the `CREATE` opcode (operation type = 1)_

#### Parameters

| Name         | Type    | Description                                                                        |
| ------------ | ------- | ---------------------------------------------------------------------------------- |
| value        | uint256 | The value to be sent to the contract created                                       |
| creationCode | bytes   | The contract creation bytecode to deploy appended with the constructor argument(s) |

#### Returns

| Name        | Type  | Description                                  |
| ----------- | ----- | -------------------------------------------- |
| newContract | bytes | The address of the contract created as bytes |

### \_deployCreate2

```solidity
function _deployCreate2(uint256 value, bytes creationCode) internal nonpayable returns (bytes newContract)
```

_Deploy a contract using the `CREATE2` opcode (operation type = 2)_

#### Parameters

| Name         | Type    | Description                                                                                           |
| ------------ | ------- | ----------------------------------------------------------------------------------------------------- |
| value        | uint256 | The value to be sent to the contract created                                                          |
| creationCode | bytes   | The contract creation bytecode to deploy appended with the constructor argument(s) and a bytes32 salt |

#### Returns

| Name        | Type  | Description                                  |
| ----------- | ----- | -------------------------------------------- |
| newContract | bytes | The address of the contract created as bytes |

## Events

### ContractCreated

```solidity
event ContractCreated(uint256 indexed operationType, address indexed contractAddress, uint256 value, bytes32 indexed salt)
```

Deployed new contract at address `contractAddress` and funded with `value` wei (deployed using opcode: `operationType`).
_Emitted when a new contract was created and deployed._

#### Parameters

| Name                      | Type    | Description                                                                                                                               |
| ------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| operationType `indexed`   | uint256 | The opcode used to deploy the contract (`CREATE` or `CREATE2`).                                                                           |
| contractAddress `indexed` | address | The created contract address.                                                                                                             |
| value                     | uint256 | The amount of native tokens (in Wei) sent to fund the created contract on deployment.                                                     |
| salt `indexed`            | bytes32 | The salt used to deterministically deploy the contract (`CREATE2` only). If `CREATE` opcode is used, the salt value will be `bytes32(0)`. |

### Executed

```solidity
event Executed(uint256 indexed operationType, address indexed target, uint256 value, bytes4 indexed selector)
```

Called address `target` using `operationType` with `value` wei and `data`.
_Emitted when calling an address `target` (EOA or contract) with `value`._

#### Parameters

| Name                    | Type    | Description                                                                                          |
| ----------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| operationType `indexed` | uint256 | The low-level call opcode used to call the `target` address (`CALL`, `STATICALL` or `DELEGATECALL`). |
| target `indexed`        | address | The address to call. `target` will be unused if a contract is created (operation types 1 and 2).     |
| value                   | uint256 | The amount of native tokens transferred along the call (in Wei).                                     |
| selector `indexed`      | bytes4  | The first 4 bytes (= function selector) of the data sent with the call.                              |

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

### ERC725X_ContractDeploymentFailed

```solidity
error ERC725X_ContractDeploymentFailed()
```

_Reverts when contract deployment failed via {execute} or {executeBatch} functions, This error can occur using either operation type 1 (`CREATE`) or 2 (`CREATE2`)._

### ERC725X_CreateOperationsRequireEmptyRecipientAddress

```solidity
error ERC725X_CreateOperationsRequireEmptyRecipientAddress()
```

_Reverts when passing a `to` address that is not `address(0)` (= address zero) while deploying a contract via {execute} or {executeBatch} functions. This error can occur using either operation type 1 (`CREATE`) or 2 (`CREATE2`)._

### ERC725X_ExecuteParametersEmptyArray

```solidity
error ERC725X_ExecuteParametersEmptyArray()
```

_Reverts when one of the array parameter provided to the {executeBatch} function is an empty array._

### ERC725X_ExecuteParametersLengthMismatch

```solidity
error ERC725X_ExecuteParametersLengthMismatch()
```

_Reverts when there is not the same number of elements in the `operationTypes`, `targets` addresses, `values`, and `datas` array parameters provided when calling the {executeBatch} function._

### ERC725X_InsufficientBalance

```solidity
error ERC725X_InsufficientBalance(uint256 balance, uint256 value)
```

_Reverts when trying to send more native tokens `value` than available in current `balance`._

#### Parameters

| Name    | Type    | Description                                                                                                                                |
| ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| balance | uint256 | The balance of native tokens of the ERC725X smart contract.                                                                                |
| value   | uint256 | The amount of native tokens sent via `ERC725X.execute(...)`/`ERC725X.executeBatch(...)` that is greater than the contract&#39;s `balance`. |

### ERC725X_MsgValueDisallowedInDelegateCall

```solidity
error ERC725X_MsgValueDisallowedInDelegateCall()
```

_Reverts when trying to send native tokens (`value` / `values[]` parameter of {execute} or {executeBatch} functions) while making a `delegatecall` (`operationType == 4`). Sending native tokens via `staticcall` is not allowed because `msg.value` is persisting._

### ERC725X_MsgValueDisallowedInStaticCall

```solidity
error ERC725X_MsgValueDisallowedInStaticCall()
```

_Reverts when trying to send native tokens (`value` / `values[]` parameter of {execute} or {executeBatch} functions) while making a `staticcall` (`operationType == 3`). Sending native tokens via `staticcall` is not allowed because it is a state changing operation._

### ERC725X_NoContractBytecodeProvided

```solidity
error ERC725X_NoContractBytecodeProvided()
```

_Reverts when no contract bytecode was provided as parameter when trying to deploy a contract via {execute} or {executeBatch}. This error can occur using either operation type 1 (`CREATE`) or 2 (`CREATE2`)._

### ERC725X_UnknownOperationType

```solidity
error ERC725X_UnknownOperationType(uint256 operationTypeProvided)
```

_Reverts when the `operationTypeProvided` is none of the default operation types available. (CALL = 0; CREATE = 1; CREATE2 = 2; STATICCALL = 3; DELEGATECALL = 4)_

#### Parameters

| Name                  | Type    | Description                                                                                            |
| --------------------- | ------- | ------------------------------------------------------------------------------------------------------ |
| operationTypeProvided | uint256 | The unrecognised operation type number provided to `ERC725X.execute(...)`/`ERC725X.executeBatch(...)`. |

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
