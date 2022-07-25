import 'dotenv/config'
import * as process from 'process'

import { createApi } from '../api'

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

  const { securities } = await api.Operations.GetPositions({
    account_id: portfolioId
  });

  console.log({ securities })
})();

//