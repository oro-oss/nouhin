const path = require('path')
const sh = require('shelljs')
const vfs = require('vinyl-fs')
const dateFormat = require('dateformat')

const defaultOptions = {
  sourceDir: '.',
  deliveryDir: '.nouhin',
  output: '{yyyymmdd}.zip',
  message: ':rocket: {yyyy/mm/dd HH:MM}',
  prefix: '.'
}

function applyDefaults(options) {
  const res = {}
  Object.keys(options).forEach(key => {
    res[key] = options[key] || defaultOptions[key]
  })
  return res
}

function format(date, str) {
  const re = /\{(.*)\}/g
  let from = 0
  let buf = ''
  let matched

  while ((matched = re.exec(str))) {
    const formatted = dateFormat(date, matched[1])
    buf += str.slice(from, matched.index) + formatted
    from = re.lastIndex
  }
  buf += str.slice(from)

  return buf
}

function nouhin(rawOptions) {
  const options = applyDefaults(rawOptions)

  sh.rm('-rf', options.deliveryDir)

  const source = vfs.src(
    [path.join(options.sourceDir, '**/*'), '!' + options.deliveryDir],
    {
      base: options.sourceDir
    }
  )

  const delivery = vfs.dest(options.deliveryDir).on('finish', () => {
    const now = new Date()
    const message = format(now, options.message)

    sh.exec(`git add "${options.deliveryDir}"`)
    sh.exec(`git commit -m "${message}"`)

    const output = format(now, options.output)
    const gdaBin = path.resolve(
      require.resolve('git-diff-archive'),
      '../bin/gda'
    )
    sh.exec(
      `${gdaBin} -f zip ` +
        `-b "${options.deliveryDir}" ` +
        `-p "${options.prefix}" ` +
        `-o "${output}" ` +
        'HEAD HEAD^'
    )
  })

  source.pipe(delivery)
}

module.exports = nouhin
