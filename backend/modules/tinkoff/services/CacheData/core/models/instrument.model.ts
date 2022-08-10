import { Shared } from '../../../TinkoffAPI/types'

type InstrumentModelConstructor = {
  figi: Shared.Figi
  ticker: Shared.Ticker
  name: Shared.Name
}

class InstrumentModel {
  figi: Shared.Figi
  ticker: Shared.Ticker
  name: Shared.Name

  constructor({ figi, ticker, name }: InstrumentModelConstructor) {
    this.figi = figi
    this.ticker = ticker
    this.name = name
  }
}

export default InstrumentModel