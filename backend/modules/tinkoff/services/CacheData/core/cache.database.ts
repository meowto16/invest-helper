import { Database as SqliteDatabase } from 'sqlite3'
import * as sqlite3 from 'sqlite3'

import { DATA_PATH } from '../../../config/data'

const CacheDatabase = (() => {
  return new sqlite3.Database(DATA_PATH)
})()

export type CacheDatabaseInstance = SqliteDatabase

export default CacheDatabase