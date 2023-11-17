/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

export type {
  RawStyles,
  StyleRule,
  TNestableStyleValue,
  TRawValue,
  TStyleValue,
} from './common-types';

// All functions exposed from `stylex` are defined in a way that can be run
// entirely in the browser.

// These are the implementations of those functions.

import styleXCreateSet from './stylex-create';
import styleXDefineVars from './stylex-define-vars';
import styleXCreateTheme from './stylex-create-theme';
import stylexKeyframes from './stylex-keyframes';
import stylexInclude, {
  IncludedStyles as _IncludedStyles,
} from './stylex-include';
import stylexFirstThatWorks from './stylex-first-that-works';
import hash from './hash';
import genFileBasedIdentifier from './utils/file-based-identifier';
import * as m from './messages';
export * as types from './types';

import type {
  InjectableStyle as _InjectableStyle,
  CompiledNamespaces as _CompiledNamespaces,
  MutableCompiledNamespaces as _MutableCompiledNamespaces,
  StyleXOptions as _StyleXOptions,
} from './common-types';

export const create: typeof styleXCreateSet = styleXCreateSet;
export const defineVars: typeof styleXDefineVars = styleXDefineVars;
export const createTheme: typeof styleXCreateTheme = styleXCreateTheme;
export const keyframes: typeof stylexKeyframes = stylexKeyframes;
export const include: typeof stylexInclude = stylexInclude;
export const utils: {
  hash: typeof hash,
  genFileBasedIdentifier: typeof genFileBasedIdentifier,
} = {
  hash,
  genFileBasedIdentifier,
};
export const messages: typeof m = m;
export const IncludedStyles: typeof _IncludedStyles = _IncludedStyles;
export const firstThatWorks: typeof stylexFirstThatWorks = stylexFirstThatWorks;

export type InjectableStyle = _InjectableStyle;
export type CompiledNamespaces = _CompiledNamespaces;
export type MutableCompiledNamespaces = _MutableCompiledNamespaces;
export type StyleXOptions = _StyleXOptions;
