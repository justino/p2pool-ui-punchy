// ======================================================================
// formats a given hashrate (H/s) to humand readable hashrate
// like xxx.yyy GH/s
// ======================================================================
const formatHashrate = function(rate) {
  rate = parseFloat(rate);
  let unit = 'H/s';
  if (rate >= 1000) { rate /= 1000; unit = 'KH/s'; }
  if (rate >= 1000) { rate /= 1000; unit = 'MH/s'; }
  if (rate >= 1000) { rate /= 1000; unit = 'GH/s'; }
  if (rate >= 1000) { rate /= 1000; unit = 'TH/s'; }
  if (rate >= 1000) { rate /= 1000; unit = 'PH/s'; }

  return (rate.toFixed(2) + ' ' + unit);
}

// ======================================================================
// formats a given int value to human readable si format
// ======================================================================
const formatInt = function(rate) {
  rate = parseFloat(rate);
  let unit = '';
  if (rate >= 1000) { rate /= 1000; unit = 'k'; }
  if (rate >= 1000) { rate /= 1000; unit = 'M'; }
  if (rate >= 1000) { rate /= 1000; unit = 'G'; }
  if (rate >= 1000) { rate /= 1000; unit = 'T'; }

  return ((unit == '' ? rate.toFixed(0) : rate.toFixed(2)) + unit);
}

// ======================================================================
// format seconds to an interval like '1d 7h 5s'
// ======================================================================
const formatSeconds = function(time) {
  const sec_num = parseInt(time, 10);
  const days = Math.floor(sec_num / 86400);
  const hours = Math.floor((sec_num - (days * 86400)) / 3600);
  const minutes = Math.floor((sec_num - (days * 86400 + hours * 3600)) / 60);
  const seconds = sec_num - (days * 86400) - (hours * 3600) - (minutes * 60);

  let formatted = '';
  if (days > 0) { formatted += days + 'd '; }
  formatted += hours + 'h ' + minutes + 'm ' + seconds + 's';

  return formatted;
}

// ======================================================================
// Sorts a dict by value
// ======================================================================
const sortByValue = function(toSort) {
  const keys = Object.keys(toSort);
  keys.sort(function (a, b) {
    return toSort[a] < toSort[b] ? -1 : (toSort[a] === toSort[b] ? 0 : 1);
  });

  return keys;
}
