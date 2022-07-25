import 'dotenv/config'
import * as process from 'process'
// @ts-ignore
import tinkoffV2 from 'tinkoff-invest-v2-sdk'

!(async function main() {
  const token = process.env.TINKOFF_SECRET_TOCKET
  const portfolioId = process.env.TINKOFF_PORTFOLIO_ID

  if (!token) {
    throw new Error('You should define "TINKOFF_SECRET_TOCKET" in .env')
  }

  if (!portfolioId) {
    throw new Error('You should defined "TINKOFF_PORTFOLIO_ID" in .env.')
  }

  const api: any = tinkoffV2({ token, appName: 'meowto16/invest-helper' });

  const accounts = await api.Operations.GetPortfolio({
    account_id: portfolioId
  });

  console.log(accounts)
})();

//