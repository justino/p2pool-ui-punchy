// ======================================================================
// formats a given hashrate (H/s) to humand readable hashrate
// like xxx.yyy GH/s
// ======================================================================

var formatHashrate= function(rate) {
  rate= parseFloat(rate); unit= 'H/s';
  if(rate >= 1000) { rate /= 1000; unit= 'KH/s'; }
  if(rate >= 1000) { rate /= 1000; unit= 'MH/s'; }
  if(rate >= 1000) { rate /= 1000; unit= 'GH/s'; }
  if(rate >= 1000) { rate /= 1000; unit= 'TH/s'; }
  if(rate >= 1000) { rate /= 1000; unit= 'PH/s'; }
  return (rate.toFixed(2) + ' ' + unit);
}

// ======================================================================
