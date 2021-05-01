const AGENTS = {
  alfa: 'Alfa bus',
  atlas: 'Atlas',
};

const DIRECTIONS = {
  toNovogrudok: 'toNovogrudok',
  toMinsk: 'toMinsk',
};

const STATIONS = {
  NOVO: 'Новогрудок',
  MINSK: 'Минск',
};

const DAY_OF_WEEK_SHORT_TRANSLATIONS = {
  monday: 'Пн',
  tuesday: 'Вт',
  wednesday: 'Ср',
  thursday: 'Чт',
  friday: 'Пт',
  saturday: 'Сб',
  sunday: 'Вс'
};

const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;

const MAX_VISIBILITY_DAYS = 14;

module.exports = {
  AGENTS,
  DIRECTIONS,
  STATIONS,
  ONE_SECOND,
  ONE_MINUTE,
  MAX_VISIBILITY_DAYS,
  DAY_OF_WEEK_SHORT_TRANSLATIONS
};