export interface Timezone {
  timezoneName: string;
  timezoneCity: string;
  gmtDifferenceMinutes: number;
}

export interface UserTimezone extends Timezone {
  uid: string;
}
