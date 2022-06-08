"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STOP = exports.DATE_REGEX = exports.DATE_KEY = exports.DIRECTION_REGEX = exports.DIRECTION_KEY = exports.TRACK_DIFF_KEY = exports.TRACK_KEY = void 0;
//track command
exports.TRACK_KEY = 'track';
exports.TRACK_DIFF_KEY = 'trackdiff';
//direction command
exports.DIRECTION_KEY = 'direction';
exports.DIRECTION_REGEX = new RegExp('^direction_\W*', 'ig');
//date command
exports.DATE_KEY = 'date';
exports.DATE_REGEX = new RegExp('date_\\d{2}.\\d{2}.\\d{4}.*', 'ig');
exports.STOP = 'stop';
