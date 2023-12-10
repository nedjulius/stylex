/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

'use strict';

const path = require('path');
const esbuild = require('esbuild');
const stylexPlugin = require('../src/index');

async function build(options = {}) {
  const { outputFiles } = await esbuild.build({
    entryPoints: [path.resolve(__dirname, '__fixtures__/index.js')],
    external: ['@stylexjs/stylex'],
    minify: false,
    bundle: true,
    write: false,
    plugins: [stylexPlugin({ useCSSLayers: true, ...options })],
  });

  return { js: outputFiles[0], css: outputFiles[1] };
}

describe('esbuild-plugin-stylex', () => {
  it('extracts and bundles CSS without inject calls, bundles JS', async () => {
    const { js, css } = await build();

    expect(js.text).toMatchInlineSnapshot(`
      ""use strict";
      (() => {
        var __create = Object.create;
        var __defProp = Object.defineProperty;
        var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
        var __getOwnPropNames = Object.getOwnPropertyNames;
        var __getProtoOf = Object.getPrototypeOf;
        var __hasOwnProp = Object.prototype.hasOwnProperty;
        var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
          get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
        }) : x)(function(x) {
          if (typeof require !== "undefined")
            return require.apply(this, arguments);
          throw Error('Dynamic require of "' + x + '" is not supported');
        });
        var __copyProps = (to, from, except, desc) => {
          if (from && typeof from === "object" || typeof from === "function") {
            for (let key of __getOwnPropNames(from))
              if (!__hasOwnProp.call(to, key) && key !== except)
                __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
          }
          return to;
        };
        var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
          // If the importer is in node compatibility mode or this is not an ESM
          // file that has been converted to a CommonJS file using a Babel-
          // compatible transform (i.e. "__esModule" has not been set), then set
          // "default" to the CommonJS "module.exports" for node compatibility.
          isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
          mod
        ));

        // __tests__/__fixtures__/index.js
        var import_stylex2 = __toESM(__require("@stylexjs/stylex"));

        // __tests__/__fixtures__/fooStyles.js
        var import_stylex = __toESM(__require("@stylexjs/stylex"));
        var fooStyles_default = {
          foo: {
            display: "xt0psk2",
            width: "xh8yej3",
            $$css: true
          }
        };

        // __tests__/__fixtures__/index.js
        var styles = {
          bar: {
            animationName: "x127lhb5",
            display: "x78zum5",
            marginLeft: "x16ydxro",
            marginInlineStart: null,
            marginInlineEnd: null,
            height: "x1xa6b72",
            backgroundColor: "xrkmrrc x1r3o6fz",
            $$css: true
          }
        };
        function App() {
          return import_stylex2.default.props(fooStyles_default.foo, styles.bar);
        }
      })();
      "
    `);

    expect(css.text).toMatchInlineSnapshot(`
      "
      @layer priority1, priority2, priority3;
      @layer priority1{
      @keyframes xekv6nw-B{0%{opacity:0;}100%{opacity:1;}}
      }
      @layer priority2{
      .x127lhb5{animation-name:xekv6nw-B}
      .xrkmrrc{background-color:red}
      .x78zum5{display:flex}
      .xt0psk2{display:inline}
      .x1r3o6fz:hover{background-color:pink}
      }
      @layer priority3{
      .x1xa6b72{height:700px}
      .x16ydxro{margin-left:10px}
      .xh8yej3{width:100%}
      }"
    `);
  });

  it('preserves stylex.inject calls and does not extract CSS in development mode', async () => {
    const { js, css } = await build({ dev: true });

    expect(js.text).toMatchInlineSnapshot(`
      ""use strict";
      (() => {
        var __create = Object.create;
        var __defProp = Object.defineProperty;
        var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
        var __getOwnPropNames = Object.getOwnPropertyNames;
        var __getProtoOf = Object.getPrototypeOf;
        var __hasOwnProp = Object.prototype.hasOwnProperty;
        var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
          get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
        }) : x)(function(x) {
          if (typeof require !== "undefined")
            return require.apply(this, arguments);
          throw Error('Dynamic require of "' + x + '" is not supported');
        });
        var __copyProps = (to, from, except, desc) => {
          if (from && typeof from === "object" || typeof from === "function") {
            for (let key of __getOwnPropNames(from))
              if (!__hasOwnProp.call(to, key) && key !== except)
                __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
          }
          return to;
        };
        var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
          // If the importer is in node compatibility mode or this is not an ESM
          // file that has been converted to a CommonJS file using a Babel-
          // compatible transform (i.e. "__esModule" has not been set), then set
          // "default" to the CommonJS "module.exports" for node compatibility.
          isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
          mod
        ));

        // __tests__/__fixtures__/index.js
        var import_stylex2 = __toESM(__require("@stylexjs/stylex"));

        // __tests__/__fixtures__/fooStyles.js
        var import_stylex = __toESM(__require("@stylexjs/stylex"));
        import_stylex.default.inject(".xt0psk2{display:inline}", 3e3);
        import_stylex.default.inject(".xh8yej3{width:100%}", 4e3);
        var fooStyles_default = {
          foo: {
            fooStyles__foo: "fooStyles__foo",
            display: "xt0psk2",
            width: "xh8yej3",
            $$css: true
          }
        };

        // __tests__/__fixtures__/index.js
        import_stylex2.default.inject("@keyframes xekv6nw-B{0%{opacity:0;}100%{opacity:1;}}", 1);
        import_stylex2.default.inject(".x127lhb5{animation-name:xekv6nw-B}", 3e3);
        import_stylex2.default.inject(".x78zum5{display:flex}", 3e3);
        import_stylex2.default.inject(".x16ydxro{margin-left:10px}", 4e3);
        import_stylex2.default.inject(".x1xa6b72{height:700px}", 4e3);
        import_stylex2.default.inject(".xrkmrrc{background-color:red}", 3e3);
        import_stylex2.default.inject(".x1r3o6fz:hover{background-color:pink}", 3130);
        var styles = {
          bar: {
            "index__styles.bar": "index__styles.bar",
            animationName: "x127lhb5",
            display: "x78zum5",
            marginLeft: "x16ydxro",
            marginInlineStart: null,
            marginInlineEnd: null,
            height: "x1xa6b72",
            backgroundColor: "xrkmrrc x1r3o6fz",
            $$css: true
          }
        };
        function App() {
          return import_stylex2.default.props(fooStyles_default.foo, styles.bar);
        }
      })();
      "
    `);

    expect(css).toBeUndefined();
  });
});
