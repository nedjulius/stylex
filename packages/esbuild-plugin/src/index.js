/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

const babel = require('@babel/core');
const stylexBabelPlugin = require('@stylexjs/babel-plugin');
const flowSyntaxPlugin = require('@babel/plugin-syntax-flow');
const hermesParserPlugin = require('babel-plugin-syntax-hermes-parser');
const typescriptSyntaxPlugin = require('@babel/plugin-syntax-typescript');
const jsxSyntaxPlugin = require('@babel/plugin-syntax-jsx');
const path = require('path');
const fs = require('fs/promises');

const PACKAGE_NAME = 'esbuild-plugin-stylex';

const IS_DEV_ENV =
  process.env.NODE_ENV === 'development' ||
  process.env.BABEL_ENV === 'development';

const STYLEX_PLUGIN_ONLOAD_FILTER = /\.(jsx|js|tsx|ts|mjs|cjs|mts|cts)$/;

function stylexPlugin({
  dev = IS_DEV_ENV,
  unstable_moduleResolution = { type: 'commonJS', rootDir: process.cwd() },
  stylexImports = ['@stylexjs/stylex'],
  // file path for the generated CSS file
  generatedCSSFileName = path.resolve(__dirname, 'stylex.css'),
  babelConfig: { plugins = [], presets = [] } = {},
  useCSSLayers,
  ...options
} = {}) {
  return {
    name: PACKAGE_NAME,
    async setup({ onLoad, onEnd, initialOptions }) {
      const stylexRules = {};

      onEnd(async ({ outputFiles }) => {
        const rules = Object.values(stylexRules).flat();

        if (rules.length === 0) {
          return;
        }

        const collectedCSS = stylexBabelPlugin.processStylexRules(
          rules,
          useCSSLayers,
        );
        const shouldWriteToDisk =
          initialOptions.write === undefined || initialOptions.write;

        if (shouldWriteToDisk) {
          await fs.mkdir(path.dirname(generatedCSSFileName), {
            recursive: true,
          });
          await fs.writeFile(generatedCSSFileName, collectedCSS, 'utf8');

          return;
        }

        outputFiles.push({
          path: '<stdout>',
          contents: new TextEncoder().encode(collectedCSS),
          get text() {
            return collectedCSS;
          },
        });
      });

      onLoad({ filter: STYLEX_PLUGIN_ONLOAD_FILTER }, async (args) => {
        const currFilePath = args.path;
        const inputCode = await fs.readFile(currFilePath, 'utf8');

        if (
          !stylexImports.some((importName) => inputCode.includes(importName))
        ) {
          // avoid transform if file doesn't have stylex imports
          // esbuild proceeds to the next callback
          return;
        }

        const { code, metadata } = await babel.transformAsync(inputCode, {
          babelrc: false,
          filename: currFilePath,
          presets,
          plugins: [
            ...plugins,
            ...getFlowOrTypeScriptBabelSyntaxPlugin(currFilePath),
            jsxSyntaxPlugin,
            [
              stylexBabelPlugin,
              {
                dev,
                unstable_moduleResolution,
                ...options,
              },
            ],
          ],
        });

        if (!dev && metadata.stylex !== null && metadata.stylex.length > 0) {
          stylexRules[args.path] = metadata.stylex;
        }

        return {
          contents: code,
          loader: getEsbuildLoader(currFilePath),
        };
      });
    },
  };
}

function getEsbuildLoader(fileName) {
  if (fileName.endsWith('.tsx')) {
    return 'tsx';
  }

  if (fileName.endsWith('.jsx')) {
    return 'jsx';
  }

  if (fileName.endsWith('ts')) {
    return 'ts';
  }

  return 'js';
}

function getFlowOrTypeScriptBabelSyntaxPlugin(fileName) {
  if (/\.jsx?/.test(path.extname(fileName))) {
    return [flowSyntaxPlugin, hermesParserPlugin];
  }

  return [[typescriptSyntaxPlugin, { isTSX: true }]];
}

module.exports = stylexPlugin;
