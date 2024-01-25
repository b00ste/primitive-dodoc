# IERC725Y

> The interface for ERC725Y sub-standard, a generic data key/value store.

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
