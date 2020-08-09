/* eslint-disable no-console */
import * as cp from 'child_process'

export async function wait(milliseconds: number): Promise<string> {
  console.log('PRINTING LS')
  console.log(cp.execSync('ls -alh', {encoding: 'utf8'}))

  console.log('PRINTING PWD')
  console.log(cp.execSync('pwd', {encoding: 'utf8'}))

  return new Promise(resolve => {
    if (isNaN(milliseconds)) {
      throw new Error('milliseconds not a number')
    }

    setTimeout(() => resolve('done!'), milliseconds)
  })
}
