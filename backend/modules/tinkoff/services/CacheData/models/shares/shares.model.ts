import { Shared } from '../../../TinkoffAPI/types'
import InstrumentModel from '../../core/models/instrument.model'

class SharesModel extends InstrumentModel {
  sector: Shared.SharesSector;
}

export default SharesModel