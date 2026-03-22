#!/usr/bin/env node

import 'dotenv/config';
import { readFileSync } from 'fs';
import { summarizeText } from './llm.js';
import { validateInput } from './validate.js';
import { printResult } from './display.js';

async function main() {
  let inputText = '';

  const args = process.argv.slice(2);

  // Mode 1: file path passed as argument
  if (args.length > 0) {
    const filePath = args[0];
    try {
      inputText = readFileSync(filePath, 'utf-8').trim();
    } catch {
      console.error(`Error: Could not read file "${filePath}". Check the path and try again.`);
      process.exit(1);
    }
  } else {
    // Mode 2: piped stdin
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    inputText = Buffer.concat(chunks).toString('utf-8').trim();
  }

  // Validate
  const validationError = validateInput(inputText);
  if (validationError) {
    console.error(`Validation Error: ${validationError}`);
    process.exit(1);
  }

  console.log('\nAnalyzing text...\n');

  const result = await summarizeText(inputText);
  printResult(result);
}

main().catch((err) => {
  console.error(`Unexpected Error: ${err.message}`);
  process.exit(1);
});