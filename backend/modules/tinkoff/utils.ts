// @ts-ignore
export const groupBy = <T = unknown, K extends keyof T = any>(arr: T[], key: K): Record<T[K], T[]> => {
  return arr.reduce((acc, current) => {
    acc[current[key]] = [...(acc[current[key]] || []), current]

    return acc
    // @ts-ignore
  }, {} as Record<T[K], T[]>);
}