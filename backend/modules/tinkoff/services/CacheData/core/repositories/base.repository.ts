import TinkoffApi from '../../../TinkoffAPI'

import CacheDatabase, { CacheDatabaseInstance } from '../cache.database'

class BaseRepository {
  protected db: CacheDatabaseInstance
  protected api: typeof TinkoffApi;

  constructor() {
    this.db = CacheDatabase;
    this.api = TinkoffApi;
  }
}

export default BaseRepository