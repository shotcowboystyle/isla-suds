#!/usr/bin/env node
/**
 * Smoke test: Verify production build completes successfully
 *
 * This test verifies that:
 * - Build command executes without errors
 * - TypeScript compilation succeeds
 * - No build-time errors occur
 */

import {exec} from 'child_process';
import {promisify} from 'util';

const execAsync = promisify(exec);

async function smokeTestBuild() {
  console.log('🔨 Running smoke test: Production build...\n');

  try {
    // Run build command
    const {stdout, stderr} = await execAsync('npm run build', {
      cwd: process.cwd(),
      env: {...process.env, NODE_ENV: 'production'},
    });

    if (stderr && !stderr.includes('warning')) {
      console.error('❌ Build failed with errors:');
      console.error(stderr);
      process.exit(1);
    }

    console.log('✅ Build completed successfully');
    if (stdout) {
      console.log(stdout);
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Build smoke test failed:');
    console.error(error.message);
    if (error.stdout) console.error('STDOUT:', error.stdout);
    if (error.stderr) console.error('STDERR:', error.stderr);
    process.exit(1);
  }
}

smokeTestBuild();
