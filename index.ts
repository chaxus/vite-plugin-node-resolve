import modules from "node:module";
import type { Plugin } from "vite";
import fs from 'node:fs'

const builtins = new Set([
  ...modules.builtinModules,
  "assert/strict",
  "diagnostics_channel",
  "dns/promises",
  "fs/promises",
  "path/posix",
  "path/win32",
  "readline/promises",
  "stream/consumers",
  "stream/promises",
  "stream/web",
  "timers/promises",
  "util/types",
  "wasi",
]);
const NODE_BUILTIN_NAMESPACE = "node:";

function isBuiltin(id: string): boolean {
  return builtins.has(
    id.startsWith(NODE_BUILTIN_NAMESPACE)
      ? id.slice(NODE_BUILTIN_NAMESPACE.length)
      : id
  );
}
// Vite convention for virtual modules, parsed paths need to be prefixed with '\0'
const nodeModuleId = "\0__vite-node-module";

export default function vitePluginNodeResolve(): Plugin {
  const moduleIdMapImporter = new Map();
  const moduleCacheFile = new Map()
  return {
    name: "vite-plugin-node-resolve",
    enforce: "pre",
    resolveId(id, importer) {
      // 如果 id 是 node 内置模块，记录 id 到 map 中
      console.log("resolveId---->", id, importer);
      if (isBuiltin(id)) {
        moduleIdMapImporter.set(id, importer);
        return `${nodeModuleId}:${id}`;
      }
    },
    load(id) {
      console.log("load----", id);
      // 如果发现有 node 内置模块，阻止 vite 自己的 load 声明周期
      if (id.startsWith(nodeModuleId)) {
        const path = id.replace(`${nodeModuleId}:`, "");
        if (isBuiltin(path)) {
          return `export default {}`;
          // return `const path = require("${path}");export default path`;
          // return `const { builtinModules } = require("${path}"); export { builtinModules }`;
        }
      }
    },
    async transform(source, importer) {
      if (importer.startsWith(nodeModuleId)) {
        const path = importer.replace(`${nodeModuleId}:`, "");
        let content = moduleCacheFile.get(importer)
        if (!content) {
          content = fs.readFileSync(moduleIdMapImporter.get(path), 'utf-8')
          moduleCacheFile.set(importer, content)
        }
        // AST 解析，获取 import 的方式：
        // 1. import fs from 'node:fs'
        // 2. import { readFile } from 'node:fs'
        // 3. import * as fs from 'node:fs'
        // 4. import foo, { name1, name2 as bar } from 'foo
        console.log("transform---------", content, importer, moduleIdMapImporter.get(path));
        if (isBuiltin(path)) {
          const code = `export default require("${path}")`;
          return {
            code,
            map: null,
          };
        }
      }
      return {
        code: source,
        map: null,
      };
    },
  };
}
