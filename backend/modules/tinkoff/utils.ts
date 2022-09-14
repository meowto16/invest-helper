// @ts-ignore
import chalk from 'chalk'

// @ts-ignore
export const groupBy = <T = unknown, K extends keyof T = any>(arr: T[], key: K): Record<T[K], T[]> => {
  return arr.reduce((acc, current) => {
    acc[current[key]] = [...(acc[current[key]] || []), current]

    return acc
    // @ts-ignore
  }, {} as Record<T[K], T[]>);
}

export const currency = {
  rub: (currency: number) => new Intl.NumberFormat(
    'ru',
    {
      currency: 'RUB',
      currencyDisplay: 'symbol',
      style: 'currency',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })
    .format(currency)
}

export const getSmartlabLink = (ticker: string, type: 'bonds' | 'shares') => {
  switch (type) {
    case 'bonds':
      return `https://smart-lab.ru/q/bonds/${ticker}/f/y/`
    case 'shares':
    default:
      return `https://smart-lab.ru/q/${ticker}/f/y/`
  }
}

export const getMOEXLink = (ticker: string) => `https://www.moex.com/ru/issue.aspx?code=${ticker}`

export const chalkIncome = (income: number, str: string) => {
  if (income === 0) return chalk.grey(str)
  if (income > 0) return chalk.green(str)
  if (income < 0) return chalk.red(str)
}
