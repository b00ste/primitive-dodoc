# IERC725X

> The interface for the ERC725X sub-standard, a generic executor.

_ERC725X provides the ability to call arbitrary functions on any other smart contract (including itself). It allows to use different type of message calls to interact with addresses such as `call`, `staticcall` and `delegatecall`. It also allows to deploy and create new contracts via both the `create` and `create2` opcodes. This is the basis for a smart contract based account system, but could also be used as a proxy account system._

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

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```

_Returns true if this contract implements the interface defined by `interfaceId`. See the corresponding https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section] to learn more about how these ids are created. This function call must use less than 30 000 gas._

#### Parameters

| Name        | Type   | Description |
| ----------- | ------ | ----------- |
| interfaceId | bytes4 | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

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
