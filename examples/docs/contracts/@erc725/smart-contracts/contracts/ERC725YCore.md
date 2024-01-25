# ERC725YCore

_Fabian Vogelsteller &lt;fabian@lukso.network&gt;_

> Core implementation of ERC725Y sub-standard, a general data key/value store.

_ERC725Y provides the ability to set arbitrary data key/value pairs that can be changed over time. It is intended to standardise certain data key/value pairs to allow automated read and writes from/to the contract storage._

## Methods

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



## Events

### DataChanged

```solidity
event DataChanged(bytes32 indexed dataKey, bytes dataValue)
````

The following data key/value pair has been changed in the ERC725Y storage: Data key: `dataKey`, data value: `dataValue`.
_Emitted when data at a specific `dataKey` was changed to a new value `dataValue`._

#### Parameters

| Name              | Type    | Description                                  |
| ----------------- | ------- | -------------------------------------------- |
| dataKey `indexed` | bytes32 | The data key for which a bytes value is set. |
| dataValue         | bytes   | The value to set for the given data key.     |

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

### ERC725Y_MsgValueDisallowed

```solidity
error ERC725Y_MsgValueDisallowed()
```

_Reverts when sending value to the {setData} or {setDataBatch} function._

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
