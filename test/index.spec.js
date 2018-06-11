const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const fixtureBase = path.resolve(__dirname, 'fixtures')

function test(fixtureType, debug) {
  const cwd = path.join(fixtureBase, fixtureType)
  const hash = exec('git rev-parse HEAD').trim()

  function exec(command) {
    const output = String(execSync(command, { cwd }))
    if (debug) {
      console.log(output)
    }
    return output
  }

  function nouhin(args = '') {
    exec(path.resolve(__dirname, '../bin/nouhin.js ') + args)
  }

  function read(file) {
    return fs.readFileSync(path.join(cwd, file))
  }

  function exists(file) {
    expect(fs.existsSync(path.join(cwd, file))).toBe(true)
  }

  function notExist(file) {
    expect(fs.existsSync(path.join(cwd, file))).not.toBe(true)
  }

  function equals(expected, actual) {
    expect(read(actual)).toEqual(read(expected))
  }

  function notEqual(expected, actual) {
    expect(read(actual)).not.toEqual(read(expected))
  }

  function latestCommit(expected) {
    const m = exec('git log --format=%B -n 1 HEAD').trim()
    expect(m).toEqual(expected)
  }

  function reset() {
    exec('git reset --hard ' + hash)
    exec('git clean -df')
  }

  return {
    nouhin,
    read,
    exists,
    notExist,
    equals,
    notEqual,
    latestCommit,
    reset
  }
}

describe('Nouhin', () => {
  let t

  afterEach(() => {
    t.reset()
  })

  it('adds delivery directory', () => {
    t = test('init')
    t.nouhin()
    t.exists('.nouhin')
    t.equals('foo.txt', '.nouhin/foo.txt')
  })

  it('specifies output zip', () => {
    t = test('init')
    t.nouhin('-o specified.zip')
    t.exists('specified.zip')
  })

  it('specifies output zip by using date formatter', () => {
    const year = new Date().getFullYear()
    t = test('init')
    t.nouhin('-o {yyyy}.zip')
    t.exists(year + '.zip')
  })

  it('specifies commit message', () => {
    t = test('init')
    t.nouhin('-m "committed"')
    t.latestCommit('committed')
  })

  it('specifies commit message by using date formatter', () => {
    const year = new Date().getFullYear()
    t = test('init')
    t.nouhin('-m "current year is {yyyy}"')
    t.latestCommit('current year is ' + year)
  })

  it('specifies source and delivery directories', () => {
    t = test('custom')
    t.notEqual('src/foo.txt', '.delivery/foo.txt')
    t.nouhin('-s src -d .delivery')
    t.notExist('.nouhin')
    t.equals('src/foo.txt', '.delivery/foo.txt')
  })
})
