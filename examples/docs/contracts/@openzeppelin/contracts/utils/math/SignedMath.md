# SignedMath

_Standard signed math utilities missing in the Solidity language._

## Internal Methods

### max

```solidity
function max(int256 a, int256 b) internal pure returns (int256)
```

_Returns the largest of two signed numbers._

### min

```solidity
function min(int256 a, int256 b) internal pure returns (int256)
```

_Returns the smallest of two signed numbers._

### average

```solidity
function average(int256 a, int256 b) internal pure returns (int256)
```

_Returns the average of two signed numbers without overflow.
The result is rounded towards zero._

### abs

```solidity
function abs(int256 n) internal pure returns (uint256)
```

_Returns the absolute unsigned value of a signed value._
