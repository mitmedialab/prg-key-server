import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from "rollup-plugin-dts";

export default [{
  input: "./endpoints/ai-blocks/drive.ts",
  external: ["crypto-js"],
	output: {
		file: './endpoints/ai-blocks/bundle.js',
		format: "es",
	},
  plugins: [
    typescript(),
    commonjs(),
    nodeResolve({browser: true, preferBuiltins: false }),
    terser(),
  ]
}, 
{
  input: "./endpoints/ai-blocks/drive.ts",
  external: ["crypto-js"],
	output: {
		file: './endpoints/ai-blocks/bundle.d.ts',
		format: "es",
	},
  plugins: [
    dts()
  ]
}];