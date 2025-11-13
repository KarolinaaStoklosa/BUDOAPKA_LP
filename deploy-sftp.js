import FtpDeploy from 'ftp-deploy'
import dotenv from 'dotenv'
import process from 'process'

const ftpDeploy = new FtpDeploy()

const modeEnv = dotenv.config({
  path: `.env.${process.argv[2] === 'prod' ? 'production' : 'development'}`,
}).parsed

console.log(`remoteRoot: /public_html${modeEnv.BASE_URL || '/'}`)
const config = {
  user: modeEnv.VITE_SFTP_USER,
  password: modeEnv.VITE_SFTP_PASSWORD,
  host: 's5.mydevil.net',
  port: 21,
  localRoot: './src',
  remoteRoot: `/public_html${modeEnv.BASE_URL || '/'}`,
  include: ['*', '.*'],
  exclude: [],
  deleteRemote: false,
  forcePasv: true,
  sftp: false,
}

ftpDeploy
  .deploy(config)
  .then((res) => console.log('finished:', res))
  .catch((err) => console.log(err))
