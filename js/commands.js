//track command
const TRACK_KEY = 'track';

//direction command
const DIRECTION_KEY = 'direction';
const DIRECTION_REGEX = new RegExp('^direction_\W*', 'ig');

//date command
const DATE_KEY = 'date';
const DATE_REGEX = new RegExp('date_\d{2}.\d{2}.\d{4}', 'ig');

module.exports = {
  TRACK_KEY,
  DIRECTION_KEY,
  DIRECTION_REGEX,
  DATE_KEY,
  DATE_REGEX,
};