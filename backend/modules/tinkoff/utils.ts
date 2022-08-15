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