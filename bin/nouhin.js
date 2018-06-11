#!/usr/bin/env node

const main = require('../lib')

const argv = require('yargs')
  .version()
  .option('s', {
    alias: 'source',
    type: 'string',
    describe:
      'Path to the directory that contains source codes (may be a directory having built files when you use any build process)'
  })
  .option('d', {
    alias: 'delivery',
    type: 'string',
    describe:
      'Path to the directory that contains delivered files which diffs are managed by git'
  })
  .option('o', {
    alias: 'output',
    type: 'string',
    describe: 'File name of output zip file'
  })
  .option('m', {
    alias: 'message',
    type: 'string',
    describe: 'Commit message when committing the delivery directory'
  })
  .option('p', {
    alias: 'prefix',
    type: 'string',
    describe: 'Internal prefix path of output zip file'
  })
  .help()

main({
  sourceDir: argv.s,
  deliveryDir: argv.d,
  output: argv.o,
  message: argv.m,
  prefix: argv.p
})
