const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const fixtureBase = path.resolve(__dirname, 'fixtures')

function test(fixtureType) {
  const cwd = path.join(fixtureBase, fixtureType)
  const hash = execSync('git rev-parse HEAD', { cwd })

  function nouhin(args = '') {
    execSync(path.resolve(__dirname, '../bin/nouhin.js ') + args, {
      cwd
    })
  }

  function read(file) {
    return fs.readFileSync(path.join(cwd, file))
  }

  function exists(file) {
    return fs.existsSync(path.join(cwd, file))
  }

  function equals(expected, actual) {
    expect(read(expected)).toEqual(read(actual))
  }

  function reset() {
    execSync('git reset --hard ' + hash, { cwd })
    execSync('git clean -df', { cwd })
  }

  return {
    nouhin,
    read,
    exists,
    equals,
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
})
