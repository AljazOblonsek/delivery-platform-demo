export function enumToPgEnum<T extends object>(myEnum: T): [string, ...string[]] {
  return Object.values(myEnum).map((value) => `${value}`) as [string, ...string[]];
}
