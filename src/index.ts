/* eslint-disable guard-for-in, max-len, no-await-in-loop, no-restricted-syntax */
import fs from 'fs';
import path from 'path';
import { extendConfig, task } from 'hardhat/config';
import { TASK_COMPILE } from 'hardhat/builtin-tasks/task-names';
import { HardhatConfig, HardhatRuntimeEnvironment, HardhatUserConfig } from 'hardhat/types';
import * as Sqrl from 'squirrelly';

import { CompilerOutputContractWithDocumentation, Doc, Error, Param } from './dodocTypes';
import { decodeAbi } from './abiDecoder';
import './type-extensions';
import { clearWhitespaces } from './utils';

extendConfig((config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
  // eslint-disable-next-line no-param-reassign
  config.dodoc = {
    include: userConfig.dodoc?.include || [],
    exclude: userConfig.dodoc?.exclude || [],
    libraries: userConfig.dodoc?.libraries || [],
    runOnCompile: userConfig.dodoc?.runOnCompile !== undefined ? userConfig.dodoc?.runOnCompile : true,
    debugMode: userConfig.dodoc?.debugMode || false,
    outputDir: userConfig.dodoc?.outputDir || './docs',
    templatePath: userConfig.dodoc?.templatePath || path.join(__dirname, './template.sqrl'),
    keepFileStructure: userConfig.dodoc?.keepFileStructure ?? true,
    freshOutput: userConfig.dodoc?.freshOutput ?? true,
    helpers: userConfig.dodoc?.helpers || [],
  };
});

async function generateDocumentation(hre: HardhatRuntimeEnvironment): Promise<void> {
  const config = hre.config.dodoc;
  const docs: Doc[] = [];

  const qualifiedNames = await hre.artifacts.getAllFullyQualifiedNames();
  const filteredQualifiedNames = qualifiedNames.filter((filePath: string) => {
    const [relativeFilePath, contractName] = filePath.split(':');
    // Checks if the documentation has to be generated for this contract
    const includesPath = config.include.some((str) => relativeFilePath === str || contractName === str);
    const excludesPath = config.exclude.some((str) => relativeFilePath === str || contractName === str);
    return (config.include.length === 0 || includesPath) && !excludesPath;
  });

  // Loops through all the qualified names to get all the compiled contracts
  const sourcesPath = hre.config.paths.sources.substr(process.cwd().length + 1); // trick to get relative path to files, and trim the first /

  for (const qualifiedName of filteredQualifiedNames) {
    const [source, name] = qualifiedName.split(':');

    const buildInfo = await hre.artifacts.getBuildInfo(qualifiedName);
    const info = buildInfo?.output.contracts[source][name] as CompilerOutputContractWithDocumentation;

    // Getting inheritance of the contract and combining the natspec
    for (const inheritanceSource in buildInfo?.output.contracts) {
      const fileContracts = buildInfo?.output.contracts[inheritanceSource];
      for (const inheritanceContract in fileContracts) {
        const contractBuildInfo = fileContracts[
          inheritanceContract
        ] as CompilerOutputContractWithDocumentation;
        // Combining devdoc
        const contractDevdoc = info.devdoc;
        const parentContractDevdoc = contractBuildInfo.devdoc;
        if (parentContractDevdoc) {
          if (contractDevdoc) {
            if (parentContractDevdoc.events) {
              if (!contractDevdoc.events) {
                contractDevdoc.events = {
                  ...parentContractDevdoc.events,
                };
              } else {
                for (const eventSig in parentContractDevdoc.events) {
                  if (parentContractDevdoc.events[eventSig]) {
                    if (!contractDevdoc.events[eventSig]) {
                      contractDevdoc.events[eventSig] = parentContractDevdoc.events[eventSig];
                    } else {
                      if (parentContractDevdoc.events[eventSig].details) {
                        if (!contractDevdoc.events[eventSig].details) {
                          contractDevdoc.events[eventSig].details =
                            parentContractDevdoc.events[eventSig].details;
                        }
                      }

                      if (parentContractDevdoc.events[eventSig].params) {
                        if (!contractDevdoc.events[eventSig].params) {
                          contractDevdoc.events[eventSig].params =
                            parentContractDevdoc.events[eventSig].params;
                        } else {
                          for (const param in parentContractDevdoc.events[eventSig].params) {
                            if (parentContractDevdoc.events[eventSig].params[param]) {
                              if (!contractDevdoc.events[eventSig].params[param]) {
                                contractDevdoc.events[eventSig].params[param] =
                                  parentContractDevdoc.events[eventSig].params[param];
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          info.devdoc = contractDevdoc;
        }
      }
    }

    if (config.debugMode) {
      console.log('ABI:\n');
      console.log(JSON.stringify(info.abi, null, 4));
      console.log('\n\n');
      console.log('User doc:\n');
      console.log(JSON.stringify(info.userdoc, null, 4));
      console.log('\n\n');
      console.log('Dev doc:\n');
      console.log(JSON.stringify(info.devdoc, null, 4));
    }

    const doc: Doc = {
      ...decodeAbi(info.abi),
      path: source.startsWith(sourcesPath)
        ? source.substring(sourcesPath.length).split('/').slice(0, -1).join('/')
        : source
            .split('/')
            .filter((elem) => !elem.endsWith('.sol'))
            .join('/'),
    }; // get file path without filename

    // Fetches info from userdoc
    for (const errorSig in info.userdoc?.errors) {
      const error = info.userdoc?.errors[errorSig][0];

      if (doc.errors[errorSig] !== undefined) doc.errors[errorSig].notice = error?.notice;
    }

    for (const eventSig in info.userdoc?.events) {
      const event = info.userdoc?.events[eventSig];

      if (doc.events[eventSig] !== undefined) doc.events[eventSig].notice = event?.notice;
    }

    for (const methodSig in info.userdoc?.methods) {
      const method = info.userdoc?.methods[methodSig];

      if (doc.methods[methodSig] !== undefined) doc.methods[methodSig].notice = method?.notice;
    }

    // Fetches info from devdoc
    for (const errorSig in info.devdoc?.errors) {
      const error = info.devdoc?.errors[errorSig][0];

      if (doc.errors[errorSig] !== undefined) doc.errors[errorSig].details = error?.details;

      for (const param in error?.params) {
        if (doc.errors[errorSig]?.inputs[param]) {
          doc.errors[errorSig].inputs[param].description = error?.params[param];
        }
      }

      for (const value in error) {
        if (value.startsWith('custom:')) {
          const strippedValue = value.replace('custom:', '');
          if (strippedValue.length > 0) {
            if (doc.errors[errorSig]) {
              doc.errors[errorSig][`custom:${strippedValue}`] = error[`custom:${strippedValue}`];
            }
          }
        }
      }
    }

    for (const eventSig in info.devdoc?.events) {
      const event = info.devdoc?.events[eventSig];

      if (doc.events[eventSig] !== undefined) doc.events[eventSig].details = event?.details;

      for (const param in event?.params) {
        if (doc.events[eventSig]?.inputs[param]) {
          doc.events[eventSig].inputs[param].description = event?.params[param];
        }
      }

      for (const value in event) {
        if (value.startsWith('custom:')) {
          const strippedValue = value.replace('custom:', '');
          if (strippedValue.length > 0) {
            if (doc.events[eventSig]) {
              doc.events[eventSig][`custom:${strippedValue}`] = event[`custom:${strippedValue}`];
            }
          }
        }
      }
    }

    /**
     * @dev Parse Natspec user and devdocs and write them into the `doc` object.
     * This function is used in this Hardhat plugin only to parse:
     * - the `receive` function.
     * - the `fallback` function.
     * - functions marked with the `internal` visibility.
     *
     * Caution if using this function to parse the Natspec of other part of the contract AST (e.g: struct, enum, modifier, etc...)
     */
    const parseNatspecFromAST = (functionSig: string, functionASTNode: any) => {
      if ('documentation' in functionASTNode === false) return;

      const tags = functionASTNode.documentation.text.split('@');

      const docEntry = doc.methods[functionSig] || doc.internalMethods[functionSig];

      tags.forEach((natspecTag: any) => {
        if (natspecTag.replace(' ', '').length === 0) {
          return;
        }

        if (natspecTag.startsWith('dev ')) {
          docEntry.details = natspecTag.replace('dev ', '').trim();
        }

        if (natspecTag.startsWith('notice ')) {
          docEntry.notice = natspecTag.replace('notice ', '').trim();
        }

        // add custom any `@custom:` tags
        if (natspecTag.startsWith('custom:')) {
          const customTagName = natspecTag.substring('custom:'.length, natspecTag.trim().indexOf(' '));
          docEntry[`custom:${customTagName}`] = natspecTag.replace(`custom:${customTagName} `, '');
        }
      });
    };

    // transform the code field in the user doc from `fallback() external` to `fallback(bytes calldata paramName) external returns (bytes memory)`
    const modifyFallbackFunctionSyntax = (fallbackASTNode: any) => {
      const paramVariableName = fallbackASTNode.parameters.parameters[0].name;
      const returnVariableName = fallbackASTNode.returnParameters.parameters[0].name;
      const { stateMutability } = fallbackASTNode;

      let newFallbackCode = 'fallback(bytes calldata';

      if (paramVariableName !== '') {
        newFallbackCode += ` ${paramVariableName}`;
      }

      newFallbackCode += `) external ${stateMutability} returns (bytes memory`;

      if (returnVariableName !== '') {
        newFallbackCode += ` ${returnVariableName}`;
      }

      newFallbackCode += ')';

      doc.methods['fallback()'].code = newFallbackCode;
    };

    const parseParamsAndReturnNatspecFromAST = (
      astNode: any,
      functionName: string,
      docEntry: 'methods' | 'internalMethods' | 'events' | 'errors',
    ) => {
      if ('documentation' in astNode === false) return;

      const paramDocs = astNode.documentation.text
        .match(/@.*/g)
        .filter((text: string) => text.match(/@param.*/));

      if (paramDocs.length > 0) {
        astNode.parameters.parameters.forEach((param: any) => {
          paramDocs.forEach((paramDoc: any) => {
            const paramName = param.name;
            const paramType = param.typeDescriptions.typeString;
            if (paramDoc.replace('@param ', '').startsWith(param.name)) {
              doc[docEntry][functionName].inputs[paramName] = {
                type: paramType,
                description: paramDoc.replace(`@param ${paramName} `, ''),
              };
            } else {
              doc[docEntry][functionName].inputs[paramName] = {
                ...doc[docEntry][functionName].inputs[paramName],
                type: paramType,
              };
            }
          });
        });
      }

      const returnDoc = astNode.documentation.text
        .match(/@.*/g)
        .filter((text: string) => text.match(/@return.*/));

      // custom errors and events do not have return parameters
      if (returnDoc.length > 0 && docEntry !== 'errors' && docEntry !== 'events') {
        astNode.returnParameters.parameters.forEach((returnParam: any, index: number) => {
          // Check if there is not the same number of Natspec @return tags compared
          // to the number of return params for the function in the AST node.
          if (returnDoc[index] === undefined) return;

          const returnVariableName = returnParam.name === '' ? `_${index}` : returnParam.name;
          const returnParamType = returnParam.typeDescriptions.typeString;

          doc[docEntry][functionName].outputs[returnVariableName] = {
            type: returnParamType,
            // return tag param is not mandatory
            description:
              returnDoc[index] === `@return ${returnVariableName}`
                ? undefined
                : returnDoc[index]
                    .replace(`@return ${returnVariableName} `, '') // this will be removed if param is present with description
                    .replace(`@return ${returnVariableName}`, undefined) // this will be removed if param is present and no description
                    .replace('@return ', ''), // this will be removed if param is not present
          };
        });
      }
    };

    // Natspec docs from `receive()` and `fallback()` functions are not included in devdoc or userdoc
    // Need to be fetched manually from AST
    const AST = buildInfo?.output.sources[source].ast.nodes;

    // find the first AST node that is `contract`
    const contractNode = AST.filter((node: any) => node.contractKind === 'contract')[0];

    if (doc.methods['receive()'] !== undefined) {
      const receiveASTNode = contractNode.nodes.find((node: any) => node.kind === 'receive');

      if (receiveASTNode !== undefined && receiveASTNode.hasOwnProperty('documentation')) {
        parseNatspecFromAST('receive()', receiveASTNode);
      } else {
        // search in the parent contracts
        // eslint-disable-next-line no-lonely-if
        if (contractNode.hasOwnProperty('baseContracts')) {
          contractNode.baseContracts.forEach((baseContract: any) => {
            for (const inheritedSource in buildInfo?.output.sources) {
              const inheritedContractAST = buildInfo?.output.sources[inheritedSource].ast.nodes.filter(
                (node: any) => node.contractKind === 'contract',
              );

              if (
                inheritedContractAST.length > 0 &&
                baseContract.baseName.referencedDeclaration === inheritedContractAST[0].id
              ) {
                const receiveParentASTNode = inheritedContractAST[0].nodes.find(
                  (node: any) => node.kind === 'receive',
                );

                if (
                  receiveParentASTNode !== undefined &&
                  receiveParentASTNode.hasOwnProperty('documentation')
                ) {
                  parseNatspecFromAST('receive()', receiveParentASTNode);
                  // stop searching as soon as we find the most overriden function in the most derived contract
                  break;
                }
              }
            }
          });
        }
      }
    }

    if (doc.methods['fallback()'] !== undefined) {
      // look for the `fallback()` function
      const derivedFallbackASTNode = contractNode.nodes.find((node: any) => node.kind === 'fallback');

      const parseNatspecFromFallback = (fallbackASTNode: any) => {
        parseNatspecFromAST('fallback()', fallbackASTNode);

        // parse any @param or @return tags if fallback function is written as
        // `fallback(bytes calldata fallbackParam) external <payable> returns (bytes memory)`
        //
        // Note: we should ideally have only a single `@param` or `@return` tag in this case
        parseParamsAndReturnNatspecFromAST(fallbackASTNode, 'fallback()', 'methods');

        // modify the code if the fallback is written as `fallback(bytes calldata fallbackParam) external <payable> returns (bytes memory)`
        if (
          fallbackASTNode.parameters.parameters.length === 1 &&
          fallbackASTNode.returnParameters.parameters.length === 1
        ) {
          modifyFallbackFunctionSyntax(fallbackASTNode);
        }
      };

      if (derivedFallbackASTNode !== undefined && derivedFallbackASTNode.hasOwnProperty('documentation')) {
        parseNatspecFromFallback(derivedFallbackASTNode);
      } else {
        // search in the parent contracts
        // eslint-disable-next-line no-lonely-if, no-prototype-builtins
        if (contractNode.hasOwnProperty('baseContracts')) {
          contractNode.baseContracts.forEach((baseContract: any) => {
            for (const inheritedSource in buildInfo?.output.sources) {
              const inheritedContractAST = buildInfo?.output.sources[inheritedSource].ast.nodes.filter(
                (node: any) => node.contractKind === 'contract',
              );

              if (
                inheritedContractAST.length > 0 &&
                baseContract.baseName.referencedDeclaration === inheritedContractAST[0].id
              ) {
                const parentFallbackASTNode = inheritedContractAST[0].nodes.find(
                  (node: any) => node.kind === 'fallback',
                );

                if (
                  parentFallbackASTNode !== undefined &&
                  parentFallbackASTNode.hasOwnProperty('documentation')
                ) {
                  parseNatspecFromFallback(parentFallbackASTNode);

                  // stop searching as soon as we find the most overriden function in the most derived contract
                  break;
                }
              }
            }
          });
        }
      }
    }

    const parseNatspecOfInternalFunctionsFromAST = async (contract: any) => {
      // Get Natspec of internal functions from AST
      const internalFunctionsNodes = contract.nodes.filter(
        (node: any) =>
          node.kind === 'function' &&
          node.nodeType === 'FunctionDefinition' &&
          node.visibility === 'internal',
      );

      if (internalFunctionsNodes.length > 0) {
        // create entries for internal functions in doc.internalMethods
        internalFunctionsNodes.forEach((internalFunctionNode: any) => {
          const {
            name: functionName,
            stateMutability,
            parameters: { parameters: params } = { parameters: [] },
            returnParameters: { parameters: returnParams } = { parameters: [] },
          } = internalFunctionNode;

          // this is non-standard, but our best attempt to create unique property name for each internal functions in the object
          // there are no concept of function signatures and selector for internal functions
          // (internal functions are not callable from outside the contract, and are of type 'function type)
          // but we are using this way to store the natspec for each internal functions and differentiate them uniquely.
          const internalFunctionSig = `${functionName}(${params
            .map((param: any) => param.typeDescriptions.typeString)
            .join(',')})`;

          let internalFunctionCode = `function ${functionName}(${params
            .map((param: any) => `${param.typeDescriptions.typeString} ${param.name}`)
            .join(', ')}) internal`;

          internalFunctionCode += ` ${stateMutability}`;

          if (returnParams.length > 0) {
            internalFunctionCode += ` returns (${returnParams
              .map((returnParam: any) => {
                let returnStatement = `${returnParam.typeDescriptions.typeString}`;

                if (returnParam.name !== '') {
                  returnStatement += ` ${returnParam.name}`;
                }

                return returnStatement;
              })
              .join(', ')})`;
          }

          if (!doc.internalMethods) {
            doc.internalMethods = {};
          }

          doc.internalMethods[internalFunctionSig] = {
            code: internalFunctionCode,
            inputs: {},
            outputs: {},
          };

          parseNatspecFromAST(internalFunctionSig, internalFunctionNode);
          parseParamsAndReturnNatspecFromAST(internalFunctionNode, internalFunctionSig, 'internalMethods');
        });
      }
    };

    const parseNatspecOfErrorsFromAST = async () => {
      AST.forEach((astNode: any) => {
        if (astNode.nodeType === 'ErrorDefinition') {
          const errorName: string = astNode.name;

          const errorDocs: { tag?: string; description?: string }[] = astNode.documentation?.text
            .split('@')
            .map((elem: string) => ({
              tag: elem.substring(0, elem.indexOf(' ')),
              description: elem.substring(elem.indexOf(' ') + 1),
            }));

          const errorParams: { paramType: string; paramName: string }[] = astNode.parameters.parameters.map(
            (elem: any) => ({
              paramType: elem.typeName.name,
              paramName: elem.name,
            }),
          );

          const code = `${errorName}(${errorParams.map(
            (elem: { paramType: string; paramName: string }) => elem.paramType,
          )})`;
          const notice = errorDocs?.filter(
            (elem: { tag?: string; description?: string }) => elem.tag === 'notice',
          )[0];
          const dev = errorDocs?.filter(
            (elem: { tag?: string; description?: string }) => elem.tag === 'dev',
          )[0];
          const custom = errorDocs?.filter((elem: { tag?: string; description?: string }) =>
            elem.tag?.startsWith('custom'),
          );

          const inputs: { [key: string]: Param } = {};
          errorParams.forEach((elem: { paramType: string; paramName: string }) => {
            let elemDescription: string = '';
            errorDocs?.forEach((docsElem: { tag?: string; description?: string }) => {
              if (docsElem.tag === 'param' && docsElem.description) {
                elemDescription = docsElem.description.replace(`${elem.paramName}`, '');
              }
            });

            inputs[elem.paramName] = {
              type: elem.paramType,
              description: clearWhitespaces(elemDescription),
            };
          });

          const error: Error = {
            code,
            notice: clearWhitespaces(notice?.description ? notice.description : ''),
            details: clearWhitespaces(dev?.description ? dev.description : ''),
            inputs,
          };

          custom?.forEach((elem) => {
            if (elem.tag) {
              const strippedValue = elem.tag.replace('custom:', '');
              if (strippedValue.length > 0 && elem.description) {
                error[`custom:${strippedValue}`] = clearWhitespaces(elem.description);
              }
            }
          });

          doc.errors[errorName] = error;
        }
      });
    };

    const libraryNodes: any[] = [];
    AST.forEach((node: any, index: number) => {
      if (node.contractKind === 'library') {
        libraryNodes.push({ node, index });
      }
    });

    // library do not have inheritance, so we can parse the Natspec directly
    libraryNodes.forEach(({ node }) => {
      parseNatspecOfInternalFunctionsFromAST(node);
      parseNatspecOfErrorsFromAST();
    });

    // contract have inheritance, so we need to search for all the internal functions
    // through the linearized inheritance graph,
    // from the most base (parent) to the most derived (child) contract
    const contractsNode = AST.filter((node: any) => node.contractKind === 'contract');

    contractsNode.forEach((contract: any) => {
      const { linearizedBaseContracts } = contract;

      if (linearizedBaseContracts.length > 1) {
        let ii = linearizedBaseContracts.length - 1;

        while (ii >= 0) {
          const contractId = linearizedBaseContracts[ii];

          for (const sourceFile in buildInfo?.output.sources) {
            const matchingASTNode = buildInfo?.output.sources[sourceFile].ast.nodes.find(
              (node: any) => node.contractKind === 'contract' && node.id === contractId,
            );

            if (matchingASTNode !== undefined) {
              parseNatspecOfInternalFunctionsFromAST(matchingASTNode);
            }
          }

          ii--;
        }
      } else {
        // parse directly if the contract does not inherit any other contract
        parseNatspecOfInternalFunctionsFromAST(contract);
      }
    });

    for (const methodSig in info.devdoc?.methods) {
      const method = info.devdoc?.methods[methodSig];

      if (doc.methods[methodSig] !== undefined) {
        doc.methods[methodSig].details = method?.details;

        for (const param in method?.params) {
          if (doc.methods[methodSig].inputs) {
            if (doc.methods[methodSig].inputs[param]) {
              doc.methods[methodSig].inputs[param].description = method?.params[param];
            }
          }
        }

        for (const output in method?.returns) {
          if (doc.methods[methodSig].outputs) {
            if (doc.methods[methodSig].outputs[output]) {
              if (method?.returns[output] !== output) {
                doc.methods[methodSig].outputs[output].description = method?.returns[output];
              }
            }
          }
        }
      }

      for (const value in method) {
        if (value.startsWith('custom:')) {
          const strippedValue = value.replace('custom:', '');
          if (strippedValue.length > 0) {
            if (doc.methods[methodSig]) {
              doc.methods[methodSig][`custom:${strippedValue}`] = method[`custom:${strippedValue}`];
            }
          }
        }
      }
    }

    for (const varName in info.devdoc?.stateVariables) {
      const variable = info.devdoc?.stateVariables[varName];
      const abiInfo = info.abi.find((a: any) => a.name === varName);

      const varNameWithParams = `${varName}(${
        abiInfo?.inputs ? abiInfo.inputs.map((inp: any) => inp.type).join(',') : ''
      })`;

      if (doc.methods[varNameWithParams]) doc.methods[varNameWithParams].details = variable?.details;

      for (const param in variable?.params) {
        if (doc.methods[varNameWithParams].inputs[param]) {
          doc.methods[varNameWithParams].inputs[param].description = variable?.params[param];
        }
      }

      for (const output in variable?.returns) {
        if (doc.methods[varNameWithParams].outputs[output]) {
          doc.methods[varNameWithParams].outputs[output].description = variable?.returns[output];
        }
      }
    }

    // Fetches global info
    if (info.devdoc?.title) doc.title = info.devdoc.title;
    if (info.userdoc?.notice) doc.notice = info.userdoc.notice;
    if (info.devdoc?.details) doc.details = info.devdoc.details;
    if (info.devdoc?.author) doc.author = info.devdoc.author;

    for (const value in info.devdoc) {
      if (value.startsWith('custom:')) {
        const strippedValue = value.replace('custom:', '');
        if (strippedValue.length > 0) {
          doc[`custom:${strippedValue}`] = info.devdoc[`custom:${strippedValue}`];
        }
      }
    }

    doc.name = name;
    docs.push(doc);
  }

  try {
    await fs.promises.access(config.outputDir);

    if (config.freshOutput) {
      await fs.promises.rm(config.outputDir, {
        recursive: true,
      });
      await fs.promises.mkdir(config.outputDir);
    }
  } catch (e) {
    await fs.promises.mkdir(config.outputDir);
  }

  const template = await fs.promises.readFile(config.templatePath, {
    encoding: 'utf-8',
  });

  for (let i = 0; i < docs.length; i += 1) {
    config.helpers?.forEach((elem) => {
      Sqrl.helpers.define(elem.helperName, elem.helperFunc);
    });
    const result = Sqrl.render(template, docs[i]);
    let docfileName = `${docs[i].name}.md`;
    let testFileName = `${docs[i].name}.json`;
    if (config.keepFileStructure && docs[i].path !== undefined) {
      if (!fs.existsSync(path.join(config.outputDir, <string>docs[i].path))) {
        if (config.libraries.length === 0) {
          await fs.promises.mkdir(path.join(config.outputDir, <string>docs[i].path), {
            recursive: true,
          });
        } else {
          const [relativeFilePath, contractName] = filteredQualifiedNames[i].split(':');
          let { outputDir } = config;

          if (config.libraries.includes(relativeFilePath) || config.libraries.includes(contractName)) {
            outputDir = `${config.outputDir}/libraries`;
          } else {
            outputDir = `${config.outputDir}/contracts`;
          }

          try {
            await fs.promises.access(outputDir);
          } catch (e) {
            await fs.promises.mkdir(outputDir);
          }

          await fs.promises.mkdir(path.join(outputDir, <string>docs[i].path), {
            recursive: true,
          });
        }
      }
      docfileName = path.join(<string>docs[i].path, docfileName);
      testFileName = path.join(<string>docs[i].path, testFileName);
    }

    if (config.libraries.length === 0) {
      await fs.promises.writeFile(path.join(config.outputDir, docfileName), result, {
        encoding: 'utf-8',
      });
    } else {
      const [relativeFilePath, contractName] = filteredQualifiedNames[i].split(':');
      let { outputDir } = config;

      if (config.libraries.includes(relativeFilePath) || config.libraries.includes(contractName)) {
        outputDir = `${config.outputDir}/libraries`;
      } else {
        outputDir = `${config.outputDir}/contracts`;
      }

      try {
        await fs.promises.access(outputDir);
      } catch (e) {
        await fs.promises.mkdir(outputDir);
      }

      await fs.promises.writeFile(path.join(outputDir, docfileName), result, {
        encoding: 'utf-8',
      });
    }

    if (config.debugMode) {
      if (config.libraries.length === 0) {
        await fs.promises.writeFile(
          path.join(config.outputDir, testFileName),
          JSON.stringify(docs[i], null, 4),
          {
            encoding: 'utf-8',
          },
        );
      } else {
        const [relativeFilePath, contractName] = filteredQualifiedNames[i].split(':');
        let { outputDir } = config;

        if (config.libraries.includes(relativeFilePath) || config.libraries.includes(contractName)) {
          outputDir = `${config.outputDir}/libraries`;
        } else {
          outputDir = `${config.outputDir}/contracts`;
        }

        try {
          await fs.promises.access(outputDir);
        } catch (e) {
          await fs.promises.mkdir(outputDir);
        }

        await fs.promises.writeFile(path.join(outputDir, testFileName), JSON.stringify(docs[i], null, 4), {
          encoding: 'utf-8',
        });
      }
    }
  }

  console.log('✅ Generated documentation for', docs.length, docs.length > 1 ? 'contracts' : 'contract');
}

// Custom standalone task
task('dodoc', 'Generates NatSpec documentation for the project')
  .addFlag('noCompile', 'Prevents compiling before running this task')
  .setAction(async (args, hre) => {
    if (!args.noCompile) {
      await hre.run(TASK_COMPILE, { noDodoc: true });
    }

    await generateDocumentation(hre);
  });

// Overriding task triggered when COMPILE is called
task(TASK_COMPILE)
  .addFlag('noDodoc', 'Prevents generating NatSpec documentation for the project')
  .setAction(async (args, hre, runSuper) => {
    // Updates the compiler settings
    for (const compiler of hre.config.solidity.compilers) {
      compiler.settings.outputSelection['*']['*'].push('devdoc');
      compiler.settings.outputSelection['*']['*'].push('userdoc');
    }

    // Compiles the contracts
    await runSuper();

    if (hre.config.dodoc.runOnCompile && !args.noDodoc) {
      await hre.run('dodoc', { noCompile: true });
    }
  });
