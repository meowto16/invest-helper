import 'dotenv/config'
import * as path from 'path'
import * as sqlite3 from 'sqlite3'

import { createApi } from '../api'

const DATA_PATH = path.resolve(__dirname, '../data/instruments.sqlite')

!(async function main() {
  const api = createApi()

  // const { instruments: etfs } = await api.instruments.Etfs({ instrument_status: 1 });
  api.instruments.Shares({ instrument_status: 1 })
    .then((response: any) => {
      const instruments = response.instruments
      const values = instruments.map((share: any) => `("${share.figi}", "${share.ticker}", "${share.name}")`)

      db.exec(`
        DELETE FROM "shares";

        INSERT INTO "shares" VALUES
        ${values.join(',\n')}
      `)
    })
    .catch((err) => {
      console.error(`Не удалось обновить данные по акциям`)
      console.error(err)
    })
  // const { instruments: bonds } = await api.instruments.Bonds({ instrument_status: 1 });

  const db = new sqlite3.Database(DATA_PATH);
})();