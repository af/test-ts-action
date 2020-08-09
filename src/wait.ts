/* eslint-disable no-console */
import * as cp from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as core from '@actions/core'
import TOML from '@iarna/toml'

const configName = core.getInput('config_file')
// TODO: getInput() doesn't seem to get the yaml default value during tests?
const configPath = path.join(process.cwd(), configName || 'myconfig.toml')

export async function wait(milliseconds: number): Promise<string> {
  console.log('PRINTING LS')
  console.log(cp.execSync('ls -alh', {encoding: 'utf8'}))

  console.log('PRINTING PWD')
  console.log(cp.execSync('pwd', {encoding: 'utf8'}))

  console.log('CONFIG PATH IS', configName, configPath)
  const parsedConfig = TOML.parse(fs.readFileSync(configPath, 'utf8'))

  console.log('PRINTING PARSED CONFIG')
  console.log(JSON.stringify(parsedConfig, null, 2))

  return new Promise(resolve => {
    if (isNaN(milliseconds)) {
      throw new Error('milliseconds not a number')
    }

    setTimeout(() => resolve('done!'), milliseconds)
  })
}
