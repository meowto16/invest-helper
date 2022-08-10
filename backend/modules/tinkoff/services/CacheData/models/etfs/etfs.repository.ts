import InstrumentRepository from '../../core/repositories/instrument.repository'

class EtfsRepository extends InstrumentRepository {
  constructor() {
    super()
    this.tableName = 'etfs'
  }
}

export default EtfsRepository