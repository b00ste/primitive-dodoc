# Address

_Collection of functions related to the address type_

## Internal Methods

### isContract

```solidity
function isContract(address account) internal view returns (bool)
```

\*Returns true if `account` is a contract.
[IMPORTANT]
====
It is unsafe to assume that an address for which this function returns
false is an externally-owned account (EOA) and not a contract.
Among others, `isContract` will return false for the following
types of addresses:

- an externally-owned account
- a contract in construction
- an address where a contract will be created
- an address where a contract lived, but was destroyed
  Furthermore, `isContract` will also return true if the target contract within
  the same transaction is already scheduled for destruction by `SELFDESTRUCT`,
  which only has an effect at the end of a transaction.
  ====
  [IMPORTANT]
  ====
  You shouldn&#39;t rely on `isContract` to protect against flash loan attacks!
  Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
  like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
  constructor.
  ====\*

### sendValue

```solidity
function sendValue(address payable recipient, uint256 amount) internal nonpayable
```

_Replacement for Solidity&#39;s `transfer`: sends `amount` wei to
`recipient`, forwarding all available gas and reverting on errors.
https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
of certain opcodes, possibly making contracts go over the 2300 gas limit
imposed by `transfer`, making them unable to receive funds via
`transfer`. {sendValue} removes this limitation.
https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
IMPORTANT: because control is transferred to `recipient`, care must be
taken to not create reentrancy vulnerabilities. Consider using
{ReentrancyGuard} or the
https://solidity.readthedocs.io/en/v0.8.0/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern]._

### functionCall

```solidity
function functionCall(address target, bytes data) internal nonpayable returns (bytes)
```

\*Performs a Solidity function call using a low level `call`. A
plain `call` is an unsafe replacement for a function call: use this
function instead.
If `target` reverts with a revert reason, it is bubbled up by this
function (like regular Solidity function calls).
Returns the raw returned data. To convert to the expected return value,
use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
Requirements:

- `target` must be a contract.
- calling `target` with `data` must not revert.
  _Available since v3.1._\*

### functionCall

```solidity
function functionCall(address target, bytes data, string errorMessage) internal nonpayable returns (bytes)
```

_Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
`errorMessage` as a fallback revert reason when `target` reverts.
*Available since v3.1.*_

### functionCallWithValue

```solidity
function functionCallWithValue(address target, bytes data, uint256 value) internal nonpayable returns (bytes)
```

\*Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
but also transferring `value` wei to `target`.
Requirements:

- the calling contract must have an ETH balance of at least `value`.
- the called Solidity function must be `payable`.
  _Available since v3.1._\*

### functionCallWithValue

```solidity
function functionCallWithValue(address target, bytes data, uint256 value, string errorMessage) internal nonpayable returns (bytes)
```

_Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
with `errorMessage` as a fallback revert reason when `target` reverts.
*Available since v3.1.*_

### functionStaticCall

```solidity
function functionStaticCall(address target, bytes data) internal view returns (bytes)
```

_Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
but performing a static call.
*Available since v3.3.*_

### functionStaticCall

```solidity
function functionStaticCall(address target, bytes data, string errorMessage) internal view returns (bytes)
```

_Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
but performing a static call.
*Available since v3.3.*_

### functionDelegateCall

```solidity
function functionDelegateCall(address target, bytes data) internal nonpayable returns (bytes)
```

_Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
but performing a delegate call.
*Available since v3.4.*_

### functionDelegateCall

```solidity
function functionDelegateCall(address target, bytes data, string errorMessage) internal nonpayable returns (bytes)
```

_Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
but performing a delegate call.
*Available since v3.4.*_

### verifyCallResultFromTarget

```solidity
function verifyCallResultFromTarget(address target, bool success, bytes returndata, string errorMessage) internal view returns (bytes)
```

_Tool to verify that a low level call to smart-contract was successful, and revert (either by bubbling
the revert reason or using the provided one) in case of unsuccessful call or if target was not a contract.
*Available since v4.8.*_

### verifyCallResult

```solidity
function verifyCallResult(bool success, bytes returndata, string errorMessage) internal pure returns (bytes)
```

_Tool to verify that a low level call was successful, and revert if it wasn&#39;t, either by bubbling the
revert reason or using the provided one.
*Available since v4.3.*_
