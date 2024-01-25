# ECDSA

_Elliptic Curve Digital Signature Algorithm (ECDSA) operations. These functions can be used to verify that a message was signed by the holder of the private keys of a given address._

## Internal Methods

### tryRecover

```solidity
function tryRecover(bytes32 hash, bytes signature) internal pure returns (address, enum ECDSA.RecoverError)
```

\*Returns the address that signed a hashed message (`hash`) with
`signature` or error string. This address can then be used for verification purposes.
The `ecrecover` EVM opcode allows for malleable (non-unique) signatures:
this function rejects them by requiring the `s` value to be in the lower
half order, and the `v` value to be either 27 or 28.
IMPORTANT: `hash` _must_ be the result of a hash operation for the
verification to be secure: it is possible to craft signatures that
recover to arbitrary addresses for non-hashed data. A safe way to ensure
this is by receiving a hash of the original message (which may otherwise
be too long), and then calling {toEthSignedMessageHash} on it.
Documentation for signature generation:

- with https://web3js.readthedocs.io/en/v1.3.4/web3-eth-accounts.html#sign[Web3.js]
- with https://docs.ethers.io/v5/api/signer/#Signer-signMessage[ethers]
  _Available since v4.3._\*

### recover

```solidity
function recover(bytes32 hash, bytes signature) internal pure returns (address)
```

_Returns the address that signed a hashed message (`hash`) with
`signature`. This address can then be used for verification purposes.
The `ecrecover` EVM opcode allows for malleable (non-unique) signatures:
this function rejects them by requiring the `s` value to be in the lower
half order, and the `v` value to be either 27 or 28.
IMPORTANT: `hash` *must* be the result of a hash operation for the
verification to be secure: it is possible to craft signatures that
recover to arbitrary addresses for non-hashed data. A safe way to ensure
this is by receiving a hash of the original message (which may otherwise
be too long), and then calling {toEthSignedMessageHash} on it._

### tryRecover

```solidity
function tryRecover(bytes32 hash, bytes32 r, bytes32 vs) internal pure returns (address, enum ECDSA.RecoverError)
```

_Overload of {ECDSA-tryRecover} that receives the `r` and `vs` short-signature fields separately.
See https://eips.ethereum.org/EIPS/eip-2098[EIP-2098 short signatures]
*Available since v4.3.*_

### recover

```solidity
function recover(bytes32 hash, bytes32 r, bytes32 vs) internal pure returns (address)
```

_Overload of {ECDSA-recover} that receives the `r and `vs` short-signature fields separately.
*Available since v4.2.*_

### tryRecover

```solidity
function tryRecover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) internal pure returns (address, enum ECDSA.RecoverError)
```

_Overload of {ECDSA-tryRecover} that receives the `v`,
`r` and `s` signature fields separately.
*Available since v4.3.*_

### recover

```solidity
function recover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) internal pure returns (address)
```

_Overload of {ECDSA-recover} that receives the `v`,
`r` and `s` signature fields separately._

### toEthSignedMessageHash

```solidity
function toEthSignedMessageHash(bytes32 hash) internal pure returns (bytes32 message)
```

_Returns an Ethereum Signed Message, created from a `hash`. This
produces hash corresponding to the one signed with the
https://eth.wiki/json-rpc/API#eth_sign[`eth_sign`]
JSON-RPC method as part of EIP-191.
See {recover}._

### toEthSignedMessageHash

```solidity
function toEthSignedMessageHash(bytes s) internal pure returns (bytes32)
```

_Returns an Ethereum Signed Message, created from `s`. This
produces hash corresponding to the one signed with the
https://eth.wiki/json-rpc/API#eth_sign[`eth_sign`]
JSON-RPC method as part of EIP-191.
See {recover}._

### toTypedDataHash

```solidity
function toTypedDataHash(bytes32 domainSeparator, bytes32 structHash) internal pure returns (bytes32 data)
```

_Returns an Ethereum Signed Typed Data, created from a
`domainSeparator` and a `structHash`. This produces hash corresponding
to the one signed with the
https://eips.ethereum.org/EIPS/eip-712[`eth_signTypedData`]
JSON-RPC method as part of EIP-712.
See {recover}._

### toDataWithIntendedValidatorHash

```solidity
function toDataWithIntendedValidatorHash(address validator, bytes data) internal pure returns (bytes32)
```

_Returns an Ethereum Signed Data with intended validator, created from a
`validator` and `data` according to the version 0 of EIP-191.
See {recover}._
