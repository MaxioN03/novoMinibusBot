"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_VISIBILITY_DAYS = exports.ONE_MINUTE = exports.ONE_SECOND = exports.DAY_OF_WEEK_SHORT_TRANSLATIONS = exports.STATIONS = exports.DIRECTIONS = exports.AGENTS = void 0;
exports.AGENTS = {
    alfa: 'Alfa bus',
    atlas: 'Atlas',
};
var DIRECTIONS;
(function (DIRECTIONS) {
    DIRECTIONS["toNovogrudok"] = "toNovogrudok";
    DIRECTIONS["toMinsk"] = "toMinsk";
})(DIRECTIONS = exports.DIRECTIONS || (exports.DIRECTIONS = {}));
;
exports.STATIONS = {
    NOVO: 'Новогрудок',
    MINSK: 'Минск',
};
exports.DAY_OF_WEEK_SHORT_TRANSLATIONS = {
    monday: 'Пн',
    tuesday: 'Вт',
    wednesday: 'Ср',
    thursday: 'Чт',
    friday: 'Пт',
    saturday: 'Сб',
    sunday: 'Вс'
};
exports.ONE_SECOND = 1000;
exports.ONE_MINUTE = 60 * exports.ONE_SECOND;
exports.MAX_VISIBILITY_DAYS = 14;
