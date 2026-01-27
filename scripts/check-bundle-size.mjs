#!/usr/bin/env node

/**
 * Bundle Size Verification Script
 *
 * Checks that the production JavaScript bundle is under 200KB gzipped.
 * This is a CI quality gate per AC6 and project-context.md bundle budget.
 */

import {readFileSync, statSync} from 'fs';
import {glob} from 'glob';
import {gzipSync} from 'zlib';
import {relative} from 'path';

const MAX_BUNDLE_SIZE_KB = 200;
const DIST_DIR = 'dist/client';

// ANSI color codes
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

async function checkBundleSize() {
  // eslint-disable-next-line no-console
  console.log('🔍 Checking bundle size...\n');

  try {
    // Find all JS files in dist/client
    const jsFiles = await glob(`${DIST_DIR}/**/*.js`, {
      ignore: ['**/*.map', '**/node_modules/**'],
    });

    if (jsFiles.length === 0) {
      console.error(`${RED}❌ No JavaScript files found in ${DIST_DIR}${RESET}`);
      console.error(`   Did you run 'pnpm build' first?`);
      process.exit(1);
    }

    let totalSize = 0;
    let totalGzipSize = 0;
    const fileSizes = [];

    // Calculate size for each file
    for (const file of jsFiles) {
      const content = readFileSync(file);
      const size = statSync(file).size;
      const gzipSize = gzipSync(content).length;

      totalSize += size;
      totalGzipSize += gzipSize;

      fileSizes.push({
        path: relative(process.cwd(), file),
        size,
        gzipSize,
      });
    }

    // Sort by gzip size (largest first)
    fileSizes.sort((a, b) => b.gzipSize - a.gzipSize);

    // Display results
    // eslint-disable-next-line no-console
    console.log('📦 Bundle Analysis:\n');
    // eslint-disable-next-line no-console
    console.log('File                                          Raw       Gzipped');
    // eslint-disable-next-line no-console
    console.log('─'.repeat(70));

    for (const file of fileSizes.slice(0, 10)) {
      // Show top 10
      const rawKb = (file.size / 1024).toFixed(1);
      const gzipKb = (file.gzipSize / 1024).toFixed(1);
      const fileName = file.path.split('/').pop();
      // eslint-disable-next-line no-console
      console.log(
        `${fileName.padEnd(45)} ${rawKb.padStart(6)} KB  ${gzipKb.padStart(6)} KB`,
      );
    }

    if (fileSizes.length > 10) {
      // eslint-disable-next-line no-console
      console.log(`... and ${fileSizes.length - 10} more files`);
    }

    // eslint-disable-next-line no-console
    console.log('─'.repeat(70));

    const totalSizeKb = (totalSize / 1024).toFixed(1);
    const totalGzipSizeKb = (totalGzipSize / 1024).toFixed(1);

    // eslint-disable-next-line no-console
    console.log(
      `Total:                                        ${totalSizeKb.padStart(6)} KB  ${totalGzipSizeKb.padStart(6)} KB\n`,
    );

    // Check against budget
    const budgetUsed = ((totalGzipSize / 1024 / MAX_BUNDLE_SIZE_KB) * 100).toFixed(1);

    if (totalGzipSize / 1024 > MAX_BUNDLE_SIZE_KB) {
      console.error(
        `${RED}❌ BUNDLE SIZE EXCEEDS BUDGET${RESET}\n`,
      );
      console.error(
        `   Bundle size: ${totalGzipSizeKb} KB gzipped`,
      );
      console.error(
        `   Budget:      ${MAX_BUNDLE_SIZE_KB} KB gzipped`,
      );
      console.error(
        `   Overage:     ${(totalGzipSize / 1024 - MAX_BUNDLE_SIZE_KB).toFixed(1)} KB (${budgetUsed}% of budget)\n`,
      );
      console.error(
        `   ${YELLOW}💡 Tips:${RESET}`,
      );
      console.error(
        `      - Ensure Framer Motion is dynamically imported`,
      );
      console.error(
        `      - Check for duplicate dependencies`,
      );
      console.error(
        `      - Use code splitting for large components`,
      );
      console.error(
        `      - Run 'pnpm why <package>' to find heavy dependencies\n`,
      );

      process.exit(1);
    } else if (totalGzipSize / 1024 > MAX_BUNDLE_SIZE_KB * 0.9) {
      console.warn(
        `${YELLOW}⚠️  WARNING: Bundle size is approaching budget limit${RESET}\n`,
      );
      console.warn(
        `   Bundle size: ${totalGzipSizeKb} KB gzipped (${budgetUsed}% of ${MAX_BUNDLE_SIZE_KB} KB budget)`,
      );
      console.warn(
        `   Remaining:   ${(MAX_BUNDLE_SIZE_KB - totalGzipSize / 1024).toFixed(1)} KB\n`,
      );
    } else {
      // eslint-disable-next-line no-console
      console.log(
        `${GREEN}✅ Bundle size is within budget${RESET}\n`,
      );
      // eslint-disable-next-line no-console
      console.log(
        `   Bundle size: ${totalGzipSizeKb} KB gzipped (${budgetUsed}% of ${MAX_BUNDLE_SIZE_KB} KB budget)`,
      );
      // eslint-disable-next-line no-console
      console.log(
        `   Remaining:   ${(MAX_BUNDLE_SIZE_KB - totalGzipSize / 1024).toFixed(1)} KB\n`,
      );
    }

    process.exit(0);
  } catch (error) {
    console.error(`${RED}❌ Bundle size check failed:${RESET}`, error.message);
    process.exit(1);
  }
}

checkBundleSize();
