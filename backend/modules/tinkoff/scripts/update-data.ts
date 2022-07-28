import 'dotenv/config'
import * as path from 'path'
import * as sqlite3 from 'sqlite3'

import { createApi } from '../api'

const DATA_PATH = path.resolve(__dirname, '../data/instruments.sqlite')

!(async function main() {
  const api = createApi()

  api.instruments.Etfs({ instrument_status: 1 })
    .then((response: any) => {
      const instruments = response.instruments
      const values = instruments.map((etf: any) => `("${etf.figi}", "${etf.ticker}", "${etf.name}")`)

      db.exec(`
        DELETE FROM "etfs";

        INSERT INTO "etfs" VALUES
        ${values.join(',\n')}
      `)

      console.log('Обновлены данные по ETF')
    })
    .catch((err: any) => {
      console.error(`Не удалось обновить данные по ETF`)
      console.error(err)
    })

  api.instruments.Shares({ instrument_status: 1 })
    .then((response: any) => {
      const instruments = response.instruments
      const values = instruments.map((share: any) => `("${share.figi}", "${share.ticker}", "${share.name}")`)

      db.exec(`
        DELETE FROM "shares";

        INSERT INTO "shares" VALUES
        ${values.join(',\n')}
      `)

      console.log('Обновлены данные по акциям')
    })
    .catch((err: any) => {
      console.error(`Не удалось обновить данные по акциям`)
      console.error(err)
    })

  api.instruments.Bonds({ instrument_status: 1 })
    .then((response: any) => {
      const instruments = response.instruments
      const values = instruments.map((bond: any) => `("${bond.figi}", "${bond.ticker}", "${bond.name}")`)

      db.exec(`
        DELETE FROM "bonds";

        INSERT INTO "bonds" VALUES
        ${values.join(',\n')}
      `)

      console.log('Обновлены данные по облигациям')
    })
    .catch((err: any) => {
      console.error(`Не удалось обновить данные по акциям`)
      console.error(err)
    })

  const db = new sqlite3.Database(DATA_PATH);
})();