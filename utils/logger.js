/* Generic logging module.
 *
 * Log Levels:
 * - 3 (Debug)
 * - 2 (Info)
 * - 1 (Warn)
 * - 0 (Error)
 */
var colors = require('colors/safe');

var Logger = function (log_level) {
    this._log_level = log_level ? log_level : 2;
};

Logger.prototype = {
    _timestamp: function (msg) {
        return (new Date()).toLocaleString().slice(0, 24);
    },

    debug: function (msg) {
        if (this._log_level < 3) {
            return;
        }
        console.info(colors.green("[" + this._timestamp() + "]"), colors.blue(" DEBG: " + msg));
    },

    info: function (msg) {
        if (this._log_level < 2) {
            return;
        }
        console.info(colors.green("[" + this._timestamp() + "]"), colors.green(" INFO: " + msg));
    },

    warn: function (msg) {
        if (this._log_level < 1) {
            return;
        }
        console.warn(colors.green("[" + this._timestamp() + "]"), colors.yellow(" WARN: " + msg));
    },

    error: function (msg) {
        if (this._log_level < 0) {
            return;
        }
        console.error(colors.green("[" + this._timestamp() + "]"), colors.red(" ERRR: " + msg));
    }
};

exports.Logger = Logger;