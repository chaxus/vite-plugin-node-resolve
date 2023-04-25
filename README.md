[npm]: https://img.shields.io/npm/v/vite-plugin-node-resolve
[npm-url]: https://www.npmjs.com/package/vite-plugin-node-resolve
[size]: https://packagephobia.now.sh/badge?p=vite-plugin-node-resolve
[size-url]: https://packagephobia.now.sh/result?p=vite-plugin-node-resolve

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![libera manifesto](https://img.shields.io/badge/libera-manifesto-lightgrey.svg)](https://liberamanifesto.com)

# vite-plugin-node-resolve

A vite plugin to solve the problem that vite natively does not support packaging node built-in modules

## Install

Using npm:

```console
npm install vite-plugin-node-resolve --save-dev
```

## Usage

Create a vite.config.ts configuration file and import the plugin:

```ts
import nodeResolve from 'vite-plugin-node-resolve';

export default defineConfig({
  plugins: [nodeResolve()],
});
```

### Meta

[LICENSE (MIT)](/LICENSE)
