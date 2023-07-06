# Dodoc

![version](https://img.shields.io/npm/v/@b00ste/hardhat-dodoc) ![npm](https://img.shields.io/npm/dt/@b00ste/hardhat-dodoc) ![license](https://img.shields.io/npm/l/@b00ste/hardhat-dodoc)

Zero-config Hardhat plugin to generate documentation for all your Solidity contracts.

- 🤪 Zero-configuration required
- ✅ Compatible with latest Solidity versions (>= 0.8.0)
- 🔍 Supports events, errors and external / public functions
- 📖 Default output to Markdown
- 🔧 Extendable using custom templates

Want to see a live example? Check out [Primitive documentation](https://docs.primitive.finance/)!

## 📦 Installation

First thing to do is to install the plugin in your Hardhat project:

```bash
# Using yarn
yarn add @b00ste/hardhat-dodoc

# Or using npm
npm i @b00ste/hardhat-dodoc
```

Next step is simply to include the plugin into your `hardhat.config.js` or `hardhat.config.ts` file:

```typescript
// Using JavaScript
require('@b00ste/hardhat-dodoc');

// Using ES6 or TypeScript
import '@b00ste/hardhat-dodoc';
```

And you're done! Documentation will be automatically generated on the next compilation and saved into the `docs` folder at the root of your project.

## 📝 Usage

The only requirement to use Dodoc is to comment your Solidity contracts using [NatSpec](https://docs.soliditylang.org/en/v0.8.9/natspec-format.html) format. For example, given the following function:

```solidity
/// @notice Does another thing when the function is called.
/// @dev More info about doing another thing when the function is called.
/// @param num A random number
/// @return A random variable
/// @custom:requirement Must be at lease 18 years old to use this function.
/// @custom:danger Another thing is extremely random, use at your own risk!
/// @custom:info Another thing 2 coming soon.
function anotherThing(uint256 num) external pure returns (uint256);
```

Dodoc will take care of everything and will generate the following output:

> ## Methods
>
> ### anotherThing
>
> ```solidity
> function anotherThing(uint256 num) external pure returns (uint256)
> ```
>
> Does another thing when the function is called.
>
> _More info about doing another thing when the function is called._
>
> **Requirement:** _Must be at lease 18 years old to use this function._
>
> **Danager:** _Another thing is extremely random, use at your own risk!_
>
> **Info:** _Another thing 2 coming soon._
>
> #### Parameters
>
> | Name | Type    | Description     |
> | ---- | ------- | --------------- |
> | num  | uint256 | A random number |
>
> #### Returns
>
> | Name | Type    | Description       |
> | ---- | ------- | ----------------- |
> | \_0  | uint256 | A random variable |

Dodoc is compatible with all the NatSpec tags (except custom ones for now), and can generate documentation for events, custom errors and external / public functions.

By default Dodoc generates new documentation after each compilation, but you can also trigger the task with the following command:

```bash
# Using yarn
yarn hardhat dodoc

# Or using npx
npx hardhat dodoc
```

## 🔧 Config

Dodoc comes with a default configuration but you can still tweak some parameters. To do it, change your Hardhat config file like this:

```typescript
import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import '@b00ste/hardhat-dodoc';

const config: HardhatUserConfig = {
  // Your Hardhat config...
  dodoc: {
    runOnCompile: true,
    debugMode: true,
    // More options...
  },
};

export default config;
```

Here are all the configuration parameters that are currently available, but as said above, all of them are entirely optional:

| Parameter           | Description                                                                                                                                                                                                  | Default value     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| `runOnCompile`      | True if the plugin should generate the documentation on every compilation                                                                                                                                    | `true`            |
| `include`           | List of all the contract / interface / library relative paths to include in the documentation generation. An empty array will generate documentation for everything                                          | `[]`              |
| `exclude`           | List of all the contract / interface / library relative paths to exclude from the documentation generation                                                                                                   | `[]`              |
| `libraries`         | Used to separate the generated docs into two folders: 1. _contracts_ & 2. _libraries_. Add the relative path of the library to the array if you want to separate it to the libraries folder.                 | `[]`              |
| `outputDir`         | Output directory of the documentation                                                                                                                                                                        | `docs`            |
| `templatePath`      | Path to the documentation template                                                                                                                                                                           | `./template.sqrl` |
| `debugMode`         | Test mode generating additional JSON files used for debugging                                                                                                                                                | `false`           |
| `keepFileStructure` | True if you want to preserve your contracts file structure in the output directory                                                                                                                           | `true`            |
| `freshOutput`       | True if you want to clean the output directory before generating new documentation                                                                                                                           | `true`            |
| `helpers`           | List of objects with `helperName` & `helperFunc`, `helperFunc` MUST be of type [**HelperFunction**](https://squirrellyjs.github.io/squirrelly/modules/_containers_.html#helperfunction) from _squirrelly.js_ | `[]`              |

## 💅 Customize

Dodoc integrates a super cool template engine called [SquirrellyJS](https://github.com/squirrellyjs/squirrelly), allowing anyone to create new output formats easily.

You can checkout the [default Markdown template](https://) to get some inspiration, as well as [SquirrellyJS documentation](https://squirrelly.js.org/docs) to learn more about it. Feel free to be creative, any kind of output such as Markdown, MDX, HTML or even JSON is supported!

Once you're satisfied, simply refer to your template using the `templatePath` parameter in your configuration and Dodoc will use it to output the documentation!

## ⛑ Help

Feel free to open an issue if you need help or if you encounter a problem! Here are some already known problems though:

- Due to the technical limitations of the Solidity compiler, the documentation of `private` and `internal` functions is not rendered. Hence, the documentation of libraries might be close to empty!
- Functions that are not commented at all might not be rendered.
- State variables overriding functions defined by an interface might "erase" the name of the parameters. A current workaround is to name the function parameters using the `_0`, `_1`, ... format.
