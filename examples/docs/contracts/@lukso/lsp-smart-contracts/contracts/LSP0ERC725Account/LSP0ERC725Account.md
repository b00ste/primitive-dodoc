# LSP0ERC725Account

_Fabian Vogelsteller &lt;fabian@lukso.network&gt;, Jean Cavallera (CJ42)_

> Deployable Implementation of [LSP-0-ERC725Account] Standard.

_A smart contract account including basic functionalities such as: - Detecting supported standards using [ERC-165] - Executing several operation on other addresses including creating contracts using [ERC-725X] - A generic data key-value store using [ERC-725Y] - Validating signatures using [ERC-1271] - Receiving notification and react on them using [LSP-1-UniversalReceiver] - Safer ownership management through 2-steps transfer using [LSP-14-Ownable2Step] - Extending the account with new functions and interfaceIds of future standards using [LSP-17-ContractExtension] - Verifying calls on the owner to make it easier to interact with the account directly using [LSP-20-CallVerification]_

## Methods

### constructor

```solidity
constructor(address initialOwner)
```

Deploying a LSP0ERC725Account contract with owner set to address `initialOwner`.
_Set `initialOwner` as the contract owner. - The `constructor` also allows funding the contract on deployment. - The `initialOwner` will then be allowed to call protected functions marked with the `onlyOwner` modifier._

#### Parameters

| Name         | Type    | Description                |
| ------------ | ------- | -------------------------- |
| initialOwner | address | The owner of the contract. |

### fallback

```solidity
fallback(bytes calldata callData) external payable returns (bytes memory)
```

The `fallback` function was called with the following amount of native tokens: `msg.value`; and the following calldata: `callData`.
\*Achieves the goal of [LSP-17-ContractExtension] standard by extending the contract to handle calls of functions that do not exist natively,
forwarding the function call to the extension address mapped to the function being called.
This function is executed when: - Sending data of length less than 4 bytes to the contract. - The first 4 bytes of the calldata do not match any publicly callable functions from the contract ABI. - Receiving native tokens with some calldata.

1.  If the data is equal or longer than 4 bytes, the [ERC-725Y] storage is queried with the following data key: [_LSP17_EXTENSION_PREFIX] + `bytes4(msg.sig)` (Check [LSP-2-ERC725YJSONSchema] for encoding the data key)

- If there is no address stored under the following data key, revert with {NoExtensionFoundForFunctionSelector(bytes4)}. The data key relative to `bytes4(0)` is an exception, where no reverts occurs if there is no extension address stored under. This exception is made to allow users to send random data (graffiti) to the account and to be able to react on it.
- If there is an address, forward the `msg.data` to the extension using the CALL opcode, appending 52 bytes (20 bytes of `msg.sender` and 32 bytes of `msg.value`). Return what the calls returns, or revert if the call failed.

2.  If the data sent to this function is of length less than 4 bytes (not a function selector), return.\*

**Info:** \*Whenever the call is associated with native tokens, the function will delegate the handling of native tokens internally to the {universalReceiver} function
passing `_TYPEID_LSP0_VALUE_RECEIVED` as typeId and the calldata as received data, except when the native token will be sent directly to the extension.

-

### RENOUNCE_OWNERSHIP_CONFIRMATION_DELAY

```solidity
function RENOUNCE_OWNERSHIP_CONFIRMATION_DELAY() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### RENOUNCE_OWNERSHIP_CONFIRMATION_PERIOD

```solidity
function RENOUNCE_OWNERSHIP_CONFIRMATION_PERIOD() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### VERSION

```solidity
function VERSION() external view returns (string)
```

Contract version.

#### Returns

| Name | Type   | Description |
| ---- | ------ | ----------- |
| \_0  | string | undefined   |

### acceptOwnership

```solidity
function acceptOwnership() external nonpayable
```

`msg.sender` is accepting ownership of contract: `address(this)`.
_Transfer ownership of the contract from the current {owner()} to the {pendingOwner()}. Once this function is called: - The current {owner()} will lose access to the functions restricted to the {owner()} only. - The {pendingOwner()} will gain access to the functions restricted to the {owner()} only._

### batchCalls

```solidity
function batchCalls(bytes[] data) external nonpayable returns (bytes[] results)
```

Executing the following batch of abi-encoded function calls on the contract: `data`.
_Allows a caller to batch different function calls in one call. Perform a `delegatecall` on self, to call different functions with preserving the context._

**Info:** _It&#39;s not possible to send value along the functions call due to the use of `delegatecall`._

#### Parameters

| Name | Type    | Description                                                          |
| ---- | ------- | -------------------------------------------------------------------- |
| data | bytes[] | An array of ABI encoded function calls to be called on the contract. |

#### Returns

| Name    | Type    | Description                                                      |
| ------- | ------- | ---------------------------------------------------------------- |
| results | bytes[] | An array of abi-encoded data returned by the functions executed. |

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

### getData

```solidity
function getData(bytes32 dataKey) external view returns (bytes dataValue)
```

Reading the ERC725Y storage for data key `dataKey` returned the following value: `dataValue`.
_Get in the ERC725Y storage the bytes data stored at a specific data key `dataKey`._

#### Parameters

| Name    | Type    | Description                                   |
| ------- | ------- | --------------------------------------------- |
| dataKey | bytes32 | The data key for which to retrieve the value. |

#### Returns

| Name      | Type  | Description                                          |
| --------- | ----- | ---------------------------------------------------- |
| dataValue | bytes | The bytes value stored under the specified data key. |

### getDataBatch

```solidity
function getDataBatch(bytes32[] dataKeys) external view returns (bytes[] dataValues)
```

Reading the ERC725Y storage for data keys `dataKeys` returned the following values: `dataValues`.
_Get in the ERC725Y storage the bytes data stored at multiple data keys `dataKeys`._

#### Parameters

| Name     | Type      | Description                                |
| -------- | --------- | ------------------------------------------ |
| dataKeys | bytes32[] | The array of keys which values to retrieve |

#### Returns

| Name       | Type    | Description                               |
| ---------- | ------- | ----------------------------------------- |
| dataValues | bytes[] | The array of data stored at multiple keys |

### isValidSignature

```solidity
function isValidSignature(bytes32 dataHash, bytes signature) external view returns (bytes4 returnedStatus)
```

Achieves the goal of [EIP-1271] by validating signatures of smart contracts according to their own logic.
_Handles two cases: 1. If the owner is an EOA, recovers an address from the hash and the signature provided: - Returns the `_ERC1271_SUCCESSVALUE` if the address recovered is the same as the owner, indicating that it was a valid signature. - If the address is different, it returns the `_ERC1271_FAILVALUE` indicating that the signature is not valid. 2. If the owner is a smart contract, it forwards the call of {isValidSignature()} to the owner contract: - If the contract fails or returns the `_ERC1271_FAILVALUE`, the {isValidSignature()} on the account returns the `_ERC1271_FAILVALUE`, indicating that the signature is not valid. - If the {isValidSignature()} on the owner returned the `_ERC1271_SUCCESSVALUE`, the {isValidSignature()} on the account returns the `_ERC1271_SUCCESSVALUE`, indicating that it&#39;s a valid signature._

#### Parameters

| Name      | Type    | Description                                                  |
| --------- | ------- | ------------------------------------------------------------ |
| dataHash  | bytes32 | The hash of the data to be validated.                        |
| signature | bytes   | A signature that can validate the previous parameter (Hash). |

#### Returns

| Name           | Type   | Description                                                       |
| -------------- | ------ | ----------------------------------------------------------------- |
| returnedStatus | bytes4 | A `bytes4` value that indicates if the signature is valid or not. |

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

**Danger:** _Leaves the contract without an owner. Once ownership of the contract has been renounced, any functions that are restricted to be called by the owner or an address allowed by the owner will be permanently inaccessible, making these functions not callable anymore and unusable._

### setData

```solidity
function setData(bytes32 dataKey, bytes dataValue) external payable
```

Setting the following data key value pair in the ERC725Y storage. Data key: `dataKey`, data value: `dataValue`.
_Sets a single bytes value `dataValue` in the ERC725Y storage for a specific data key `dataKey`. The function is marked as payable to enable flexibility on child contracts. For instance to implement a fee mechanism for setting specific data._

#### Parameters

| Name      | Type    | Description                                |
| --------- | ------- | ------------------------------------------ |
| dataKey   | bytes32 | The data key for which to set a new value. |
| dataValue | bytes   | The new bytes value to set.                |

### setDataBatch

```solidity
function setDataBatch(bytes32[] dataKeys, bytes[] dataValues) external payable
```

Setting the following data key value pairs in the ERC725Y storage. Data keys: `dataKeys`, data values: `dataValues`.
_Batch data setting function that behaves the same as {setData} but allowing to set multiple data key/value pairs in the ERC725Y storage in the same transaction._

#### Parameters

| Name       | Type      | Description                                          |
| ---------- | --------- | ---------------------------------------------------- |
| dataKeys   | bytes32[] | An array of data keys to set bytes values for.       |
| dataValues | bytes[]   | An array of bytes values to set for each `dataKeys`. |

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```

Checking if this contract supports the interface defined by the `bytes4` interface ID `interfaceId`.
_Achieves the goal of [ERC-165] to detect supported interfaces and [LSP-17-ContractExtension] by checking if the interfaceId being queried is supported on another linked extension. If the contract doesn&#39;t support the `interfaceId`, it forwards the call to the `supportsInterface` extension according to [LSP-17-ContractExtension], and checks if the extension implements the interface defined by `interfaceId`._

#### Parameters

| Name        | Type   | Description                                            |
| ----------- | ------ | ------------------------------------------------------ |
| interfaceId | bytes4 | The interface ID to check if the contract supports it. |

#### Returns

| Name | Type | Description                                                                                   |
| ---- | ---- | --------------------------------------------------------------------------------------------- |
| \_0  | bool | `true` if this contract implements the interface defined by `interfaceId`, `false` otherwise. |

### transferOwnership

```solidity
function transferOwnership(address pendingNewOwner) external nonpayable
```

Transfer ownership initiated by `newOwner`.
_Initiate the process of transferring ownership of the contract by setting the new owner as the pending owner. If the new owner is a contract that supports + implements LSP1, this will also attempt to notify the new owner that ownership has been transferred to them by calling the {universalReceiver()} function on the `newOwner` contract._

#### Parameters

| Name            | Type    | Description |
| --------------- | ------- | ----------- |
| pendingNewOwner | address | undefined   |

### universalReceiver

```solidity
function universalReceiver(bytes32 typeId, bytes receivedData) external payable returns (bytes returnedValues)
```

Notifying the contract by calling its `universalReceiver` function with the following informations: typeId: `typeId`; data: `data`.
_Achieves the goal of [LSP-1-UniversalReceiver] by allowing the account to be notified about incoming/outgoing transactions and enabling reactions to these actions. The reaction is achieved by having two external contracts ([LSP1UniversalReceiverDelegate]) that react on the whole transaction and on the specific typeId, respectively. The function performs the following steps: 1. Query the [ERC-725Y] storage with the data key [_LSP1_UNIVERSAL_RECEIVER_DELEGATE_KEY]. - If there is an address stored under the data key, check if this address supports the LSP1 interfaceId. - If yes, call this address with the typeId and data (params), along with additional calldata consisting of 20 bytes of `msg.sender` and 32 bytes of `msg.value`. If not, continue the execution of the function. 2. Query the [ERC-725Y] storage with the data key [_LSP1_UNIVERSAL_RECEIVER_DELEGATE_PREFIX] + `bytes32(typeId)`. (Check [LSP-2-ERC725YJSONSchema] for encoding the data key) - If there is an address stored under the data key, check if this address supports the LSP1 interfaceId. - If yes, call this address with the typeId and data (params), along with additional calldata consisting of 20 bytes of `msg.sender` and 32 bytes of `msg.value`. If not, continue the execution of the function. This function delegates internally the handling of native tokens to the {universalReceiver} function itself passing `_TYPEID_LSP0_VALUE_RECEIVED` as typeId and the calldata as received data._

#### Parameters

| Name         | Type    | Description                |
| ------------ | ------- | -------------------------- |
| typeId       | bytes32 | The type of call received. |
| receivedData | bytes   | The data received.         |

#### Returns

| Name           | Type  | Description                                                                                             |
| -------------- | ----- | ------------------------------------------------------------------------------------------------------- |
| returnedValues | bytes | The ABI encoded return value of the LSP1UniversalReceiverDelegate call and the LSP1TypeIdDelegate call. |

### receive

```solidity
receive() external payable
```

\*Executed:

- When receiving some native tokens without any additional data.
- On empty calls to the contract.\*

**Info:** \*This function internally delegates the handling of native tokens to the {universalReceiver} function
passing `_TYPEID_LSP0_VALUE_RECEIVED` as typeId and an empty bytes array as received data.

-

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

### \_getData

```solidity
function _getData(bytes32 dataKey) internal view returns (bytes dataValue)
```

\*Read the value stored under a specific `dataKey` inside the underlying ERC725Y storage,
represented as a mapping of `bytes32` data keys mapped to their `bytes` data values.

````solidity
mapping(bytes32 =&gt; bytes) _store
```*




#### Parameters

| Name | Type | Description |
|---|---|---|
| dataKey | bytes32 | A bytes32 data key to read the associated `bytes` value from the store. |

#### Returns

| Name | Type | Description |
|---|---|---|
| dataValue | bytes | The `bytes` value associated with the given `dataKey` in the ERC725Y storage. |

### _setData

```solidity
function _setData(bytes32 dataKey, bytes dataValue) internal nonpayable
````

\*Write a `dataValue` to the underlying ERC725Y storage, represented as a mapping of
`bytes32` data keys mapped to their `bytes` data values.

````solidity
mapping(bytes32 =&gt; bytes) _store
```*




#### Parameters

| Name | Type | Description |
|---|---|---|
| dataKey | bytes32 | A bytes32 data key to write the associated `bytes` value to the store. |
| dataValue | bytes | The `bytes` value to associate with the given `dataKey` in the ERC725Y storage. |

### _transferOwnership

```solidity
function _transferOwnership(address newOwner) internal nonpayable
````

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

\*Returns the extension address and the boolean indicating whether to forward the value received to the extension, stored under the following data key:

- {\_LSP17_EXTENSION_PREFIX} + `&lt;bytes4&gt;` (Check [LSP2-ERC725YJSONSchema] for encoding the data key).
- If no extension is stored, returns the address(0).
- If the stored value is 20 bytes, return false for the boolean\*

### \_fallbackLSP17Extendable

```solidity
function _fallbackLSP17Extendable(bytes callData) internal nonpayable returns (bytes)
```

_Forwards the call to an extension mapped to a function selector.
Calls {\_getExtensionAndForwardValue} to get the address of the extension mapped to the function selector being
called on the account. If there is no extension, the `address(0)` will be returned.
Forwards the value sent with the call to the extension if the function selector is mapped to a payable extension.
Reverts if there is no extension for the function being called, except for the `bytes4(0)` function selector, which passes even if there is no extension for it.
If there is an extension for the function selector being called, it calls the extension with the
`CALL` opcode, passing the `msg.data` appended with the 20 bytes of the {msg.sender} and 32 bytes of the `msg.value`._

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

### DataChanged

```solidity
event DataChanged(bytes32 indexed dataKey, bytes dataValue)
```

The following data key/value pair has been changed in the ERC725Y storage: Data key: `dataKey`, data value: `dataValue`.
_Emitted when data at a specific `dataKey` was changed to a new value `dataValue`._

#### Parameters

| Name              | Type    | Description                                  |
| ----------------- | ------- | -------------------------------------------- |
| dataKey `indexed` | bytes32 | The data key for which a bytes value is set. |
| dataValue         | bytes   | The value to set for the given data key.     |

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

### UniversalReceiver

```solidity
event UniversalReceiver(address indexed from, uint256 indexed value, bytes32 indexed typeId, bytes receivedData, bytes returnedValue)
```

Address `from` called the `universalReceiver(...)` function while sending `value` LYX. Notification type (typeId): `typeId` - Data received: `receivedData`.
_Emitted when the {universalReceiver} function was called with a specific `typeId` and some `receivedData`_

#### Parameters

| Name             | Type    | Description                                                                                                                                                                                       |
| ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| from `indexed`   | address | The address of the EOA or smart contract that called the {universalReceiver(...)} function.                                                                                                       |
| value `indexed`  | uint256 | The amount sent to the {universalReceiver(...)} function.                                                                                                                                         |
| typeId `indexed` | bytes32 | A `bytes32` unique identifier (= _&quot;hook&quot;_)that describe the type of notification, information or transaction received by the contract. Can be related to a specific standard or a hook. |
| receivedData     | bytes   | Any arbitrary data that was sent to the {universalReceiver(...)} function.                                                                                                                        |
| returnedValue    | bytes   | The value returned by the {universalReceiver(...)} function.                                                                                                                                      |

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

### ERC725Y_DataKeysValuesEmptyArray

```solidity
error ERC725Y_DataKeysValuesEmptyArray()
```

_Reverts when one of the array parameter provided to {setDataBatch} function is an empty array._

### ERC725Y_DataKeysValuesLengthMismatch

```solidity
error ERC725Y_DataKeysValuesLengthMismatch()
```

_Reverts when there is not the same number of elements in the `datakeys` and `dataValues` array parameters provided when calling the {setDataBatch} function._

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

### LSP20CallVerificationFailed

```solidity
error LSP20CallVerificationFailed(bool postCall, bytes4 returnedStatus)
```

_reverts when the call to the owner does not return the LSP20 success value_

#### Parameters

| Name           | Type   | Description                                             |
| -------------- | ------ | ------------------------------------------------------- |
| postCall       | bool   | True if the execution call was done, False otherwise    |
| returnedStatus | bytes4 | The bytes4 decoded data returned by the logic verifier. |

### LSP20CallingVerifierFailed

```solidity
error LSP20CallingVerifierFailed(bool postCall)
```

_reverts when the call to the owner fail with no revert reason_

#### Parameters

| Name     | Type | Description                                          |
| -------- | ---- | ---------------------------------------------------- |
| postCall | bool | True if the execution call was done, False otherwise |

### LSP20EOACannotVerifyCall

```solidity
error LSP20EOACannotVerifyCall(address logicVerifier)
```

_Reverts when the logic verifier is an Externally Owned Account (EOA) that cannot return the LSP20 success value._

#### Parameters

| Name          | Type    | Description                       |
| ------------- | ------- | --------------------------------- |
| logicVerifier | address | The address of the logic verifier |

### NoExtensionFoundForFunctionSelector

```solidity
error NoExtensionFoundForFunctionSelector(bytes4 functionSelector)
```

_reverts when there is no extension for the function selector being called with_

#### Parameters

| Name             | Type   | Description |
| ---------------- | ------ | ----------- |
| functionSelector | bytes4 | undefined   |
