/**
 * Post-build obfuscation script for Angular production builds.
 * Run AFTER `ng build --configuration production`
 *
 * Usage: node scripts/obfuscate-build.js
 *
 * Requires: npm install --save-dev javascript-obfuscator
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const DIST_DIR = path.join(__dirname, '..', 'dist', 'melizzo-ui', 'browser');

function obfuscateDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.warn(`Directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      obfuscateDirectory(filePath);
      continue;
    }

    // Only obfuscate .js / .mjs files (skip source maps, HTML, CSS, etc.)
    if (!file.endsWith('.js') && !file.endsWith('.mjs')) {
      continue;
    }

    // Skip Angular's critical chunks that must stay compatible
    if (file.startsWith('polyfills') || file === 'runtime.mjs' || file === 'runtime.js') {
      continue;
    }

    // Skip Angular's internal polyfill and runtime chunks that must stay compatible
    if (file.startsWith('polyfills') || file === 'runtime.mjs') {
      continue;
    }

    console.log(`Obfuscating: ${path.relative(DIST_DIR, filePath)}`);

    const originalCode = fs.readFileSync(filePath, 'utf-8');

    const obfuscatedCode = JavaScriptObfuscator.obfuscate(originalCode, {
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.75,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      domainLock: [],
      identifierNamesGenerator: 'hexadecimal',
      identifiersDictionary: [],
      identifiersPrefix: '',
      ignoreImports: false,
      inputFileName: '',
      log: false,
      numbersToExpressions: true,
      obfuscator: true,
      optionsPreset: 'high-obfuscation',
      renameGlobals: true,
      renameProperties: true,
      renamePropertiesMode: 'safe',
      reservedNames: [],
      reservedStrings: [],
      seed: 0,
      selfDefending: true,
      shuffleStringArray: true,
      simplify: true,
      sourceMapBaseUrl: '',
      sourceMapFileName: '',
      sourceMapMode: 'inline',
      sourceMapSourcesMode: 'off',
      splitStrings: true,
      splitStringsChunkLength: 5,
      stringArray: true,
      stringArrayCallsTransform: true,
      stringArrayCallsTransformThreshold: 0.75,
      stringArrayEncoding: ['base64'],
      stringArrayIndexesType: ['hexadecimal'],
      stringArrayRotation: true,
      stringArrayThreshold: 0.75,
      target: 'browser',
      transformObjectKeys: true,
      unicodeEscapeSequence: true,
    }).getObfuscatedCode();

    fs.writeFileSync(filePath, obfuscatedCode);
  }
}

console.log('Starting post-build obfuscation...');
console.log(`Target: ${DIST_DIR}\n`);

try {
  obfuscateDirectory(DIST_DIR);
  console.log('\nObfuscation complete!');
} catch (error) {
  console.error('Obfuscation failed:', error.message);
  process.exit(1);
}
