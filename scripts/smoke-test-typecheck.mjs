#!/usr/bin/env node
/**
 * Smoke test: Verify TypeScript type checking passes
 *
 * This test verifies that:
 * - TypeScript strict mode is working
 * - No type errors exist
 * - React Router typegen completes
 */

import {exec} from 'child_process';
import {promisify} from 'util';

const execAsync = promisify(exec);

async function smokeTestTypecheck() {
  console.warn('🔍 Running smoke test: TypeScript typecheck...\n');

  try {
    // Run typecheck command
    const {stdout, stderr} = await execAsync('npm run typecheck', {
      cwd: process.cwd(),
    });

    // TypeScript outputs errors to stderr, but exit code should be 0 if successful
    if (stderr && stderr.includes('error TS')) {
      console.error('❌ Typecheck failed with type errors:');
      console.error(stderr);
      process.exit(1);
    }

    console.warn('✅ Typecheck passed - no type errors');
    if (stdout) {
      console.warn(stdout);
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Typecheck smoke test failed:');
    console.error(error.message);
    if (error.stdout) console.error('STDOUT:', error.stdout);
    if (error.stderr) console.error('STDERR:', error.stderr);
    process.exit(1);
  }
}

smokeTestTypecheck();
