var bytes = require('bytes');

exports.dateFormat = dateFormat = function (date, fstr, utc) {
	/*
	 * Usage: var dateNow = this.dateFormat (new Date (),
	 * 							"%Y-%m-%d %H:%M:%S", false);
	 */
	utc = utc ? 'getUTC' : 'get';
	return fstr.replace (/%[YmdHMS]/g, function (m) {
		switch (m) {
			case '%Y': return date[utc + 'FullYear'] (); // no leading zeros required
			case '%m': m = 1 + date[utc + 'Month'] (); break;
			case '%d': m = date[utc + 'Date'] (); break;
			case '%H': m = date[utc + 'Hours'] (); break;
			case '%M': m = date[utc + 'Minutes'] (); break;
			case '%S': m = date[utc + 'Seconds'] (); break;
			default: return m.slice (1); // unknown code, remove %
		}
		// add leading zero if required
		return ('0' + m).slice (-2);
	});
};

exports.formatLogMsg = formatLogMsg = function (requestBody) {
	var dateNow = '[' + (new Date()).toLocaleString().slice(0,24) + '] ';
	requestBody.logMsg = dateNow + ' ' + requestBody.logMsg;
	return requestBody;
};

exports.customLog = customLog = function(tokens, req, res){
  var status = res.statusCode
  , len = parseInt(res.getHeader('Content-Length'), 10)
  , color = 32;

  if (status >= 500) color = 31
    else if (status >= 400) color = 33
      else if (status >= 300) color = 36;

    len = isNaN(len)
    ? ''
    : len = ' - ' + bytes(len);
	
	req.method = req.method === ('GET' || 'PUT')
	? req.method + ' :'
	: req.method + ':';
	
	logDate = '[' + (new Date()).toLocaleString().slice(0,24) + '] ';

    return logDate + '\033[90m' + req.method
    + ' ' + '\033[' + color + 'm' + res.statusCode
    + ' \033[90m'
    + (new Date - req._startTime)
    + 'ms' + ' ' + req.originalUrl
    + len
    + '\033[0m';
  };