const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const fixtureBase = path.resolve(__dirname, 'fixtures')

function test(fixtureType) {
  function nouhin(args = '') {
    execSync(path.resolve(__dirname, '../bin/nouhin.js ') + args, {
      cwd: path.join(fixtureBase, fixtureType)
    })
  }

  function read(file) {
    return fs.readFileSync(path.join(fixtureBase, fixtureType, file))
  }

  function exists(file) {
    return fs.existsSync(path.join(fixtureBase, fixtureType, file))
  }

  function equals(expected, actual) {
    expect(read(expected)).toEqual(read(actual))
  }

  return {
    nouhin,
    read,
    exists,
    equals
  }
}

describe('Nouhin', () => {
  it('adds delivery directory', () => {
    const t = test('init')
    t.nouhin()
    t.exists('.nouhin')
    t.equals('foo.txt', '.nouhin/foo.txt')
  })
})
