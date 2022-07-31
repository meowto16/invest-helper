import 'dotenv/config'
import * as process from 'process'
import * as sqlite3 from 'sqlite3';

import { createApi } from '../api'
import { DATA_PATH } from '../config/data'

!(async function main() {
  const token = process.env.TINKOFF_SECRET_TOCKET
  const portfolioId = process.env.TINKOFF_PORTFOLIO_ID

  if (!token) {
    throw new Error('You should define "TINKOFF_SECRET_TOCKET" in .env')
  }

  if (!portfolioId) {
    throw new Error('You should defined "TINKOFF_PORTFOLIO_ID" in .env.')
  }

  const api: any = createApi()
  const db = new (sqlite3.verbose()).Database(DATA_PATH);

  const { positions } = await api.operations.GetPortfolio({
    account_id: portfolioId
  });

  const sharesFigi = positions
    .filter((position: any) => position.instrument_type === 'share')
    .map((position: any) => position.figi)
  const bondsFigi = positions
    .filter((position: any) => position.instrument_type === 'bond')
    .map((position: any) => position.figi)

  let sharesInfoByFigi: any = {}
  let bondsInfoByFigi: any = {}

  const toParamList = (acc: any, _: any, idx: number) => acc + (idx === 0 ? '' : ',') + '?'

  if (sharesFigi.length) {
    db.all(`
      SELECT figi, ticker, name
      FROM shares
      WHERE figi IN(${sharesFigi.reduce(toParamList, '')})
    `, sharesFigi, (err: any, rows: any) => {
      if (err) {
        console.error(err)
      } else {
        rows.forEach((row: any) => sharesInfoByFigi[row.figi] = row)
      }
    })
  }

  if (bondsFigi.length) {
    db.all(`
      SELECT figi, ticker, name
      FROM bonds
      WHERE figi IN(${bondsFigi.reduce(toParamList, '')})
    `, bondsFigi, (err: any, rows: any) => {
      if (err) {
        console.error(err)
      } else {
        rows.forEach((row: any) => bondsInfoByFigi[row.figi] = row)
      }
    })
  }

  setTimeout(() => {
    console.log({
      bondsInfoByFigi,
      sharesInfoByFigi
    })
  }, 3000)
})();
