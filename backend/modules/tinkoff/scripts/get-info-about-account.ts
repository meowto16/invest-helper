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
  const db = new sqlite3.Database(DATA_PATH);

  const { positions } = await api.operations.GetPortfolio({
    account_id: portfolioId
  });

  const sharesFigi = positions
    .filter((position: any) => position.instrument_type === 'share')
    .map((position: any) => position.figi)
  const bondsFigi = positions
    .filter((position: any) => position.instrument_type === 'bond')
    .map((position: any) => position.figi)

  let sharesInfoByFigi = {}
  let bondsInfoByFigi = {}

  if (sharesFigi.length) {
    db.all(`
      SELECT figi, ticker, name
      FROM shares;
    `, { $figiArr: sharesFigi }, (err, rows) =>
      console.log(rows));
  }

  if (bondsFigi.length) {

  }

  // const
})();

//