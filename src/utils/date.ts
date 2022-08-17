import moment from 'moment';

export function formatDate(date: Date): string {
  const momentDate = moment(date);

  return momentDate.format("H:mm M/D 'YY");
}
