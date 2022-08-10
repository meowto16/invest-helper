import InstrumentRepository from '../../core/repositories/instrument.repository'

class CurrenciesRepository extends InstrumentRepository {
  constructor() {
    super()
    this.tableName = 'currencies'
  }

}

export default CurrenciesRepository