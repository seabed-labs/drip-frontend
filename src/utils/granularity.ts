// todo: this should probablly live in the SDK
export function explainGranularity(granularity: number, titleCase = true): string {
  if (granularity >= 86400) {
    return `${granularity / 86400} ${getDateDesc('day', titleCase, granularity > 86400)}`;
  } else if (granularity >= 3600) {
    return `${granularity / 3600} ${getDateDesc('hour', titleCase, granularity > 3600)}`;
  } else if (granularity >= 60) {
    return `${granularity / 60} ${getDateDesc('minute', titleCase, granularity > 60)}`;
  }
  return `${granularity} ${getDateDesc('second', titleCase, granularity > 1)}`;
}

function getDateDesc(base: string, titleCase: boolean, plural: boolean): string {
  base = base.toLocaleLowerCase();
  const dateDesc = titleCase ? base[0].toUpperCase() + base.slice(1) : base;
  return plural ? dateDesc + 's' : dateDesc;
}
