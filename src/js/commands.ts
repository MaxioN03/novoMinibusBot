//track command
export const TRACK_KEY = 'track';
export const TRACK_DIFF_KEY = 'trackdiff';

//direction command
export const DIRECTION_KEY = 'direction';
export const DIRECTION_REGEX = new RegExp('^direction_\W*', 'ig');

//date command
export const DATE_KEY = 'date';
export const DATE_REGEX = new RegExp('date_\\d{2}.\\d{2}.\\d{4}.*', 'ig');

export const STOP = 'stop';