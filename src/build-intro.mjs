import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
await build({entryPoints:[path.join(root,'src/intro-scene.js')],outfile:path.join(root,'intro.js'),bundle:true,minify:true,format:'iife',target:['es2022'],legalComments:'eof'});
const version=JSON.parse(fs.readFileSync(path.join(root,'node_modules/three/package.json'),'utf8')).version;
fs.writeFileSync(path.join(root,'THIRD_PARTY_LICENSES.txt'),`The scroll introduction bundles Three.js ${version}.\nhttps://threejs.org/\n\n`+fs.readFileSync(path.join(root,'node_modules/three/LICENSE'),'utf8'));
console.log('Built intro.js with Three.js '+version);
