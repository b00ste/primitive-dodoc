# Strings

_String operations._

## Internal Methods

### toString

```solidity
function toString(uint256 value) internal pure returns (string)
```

_Converts a `uint256` to its ASCII `string` decimal representation._

### toString

```solidity
function toString(int256 value) internal pure returns (string)
```

_Converts a `int256` to its ASCII `string` decimal representation._

### toHexString

```solidity
function toHexString(uint256 value) internal pure returns (string)
```

_Converts a `uint256` to its ASCII `string` hexadecimal representation._

### toHexString

```solidity
function toHexString(uint256 value, uint256 length) internal pure returns (string)
```

_Converts a `uint256` to its ASCII `string` hexadecimal representation with fixed length._

### toHexString

```solidity
function toHexString(address addr) internal pure returns (string)
```

_Converts an `address` with fixed length of 20 bytes to its not checksummed ASCII `string` hexadecimal representation._

### equal

```solidity
function equal(string a, string b) internal pure returns (bool)
```

_Returns true if the two strings are equal._
