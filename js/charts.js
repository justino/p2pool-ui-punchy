var draw= function(hashrate, doarate) {
  char= new Highcharts.Chart({
    chart: { renderTo: 'chart' },
    credits: { enabled: false },
    exporting: { enabled: false },
    title: { text: 'Hashrate/DOA rate' },
    rangeSelector: {
      selected: 1,
      enabled: true,
    },
    xAxis: {
      type: 'datetime',
      maxZoom: 24 * 3600,
      title: {
        text: null
      }
    },
    yAxis: {
      title: {
        text: 'Hashrate'
      },
      min: 0,
    },
    tooltip: {
      shared: true
    },
    legend: {
      enabled: true,
      borderWidth: 0
    },
    plotOptions: {
      areaspline: {
        fillColor: '#ace',
        marker: { enabled: false },
        lineWidth: 1,
        shadow: false,
        states: {
          hover: { lineWidth: 1 }
        },
        threshold: null
      },
      spline: {
        marker: { enabled: false },
        lineWidth: 1,
        shadow: true,
        states: {
          hover: { lineWidth: 1 }
        },
        threshold: null
      },
    },
    series: [{
      type: 'areaspline',
      name: 'Hashrate',
      data: hashrate,
      lineWidth: 2,
      marker: {
        enabled: false
      },
    },{
      type: 'spline',
      name: 'Dead on arrival',
      data: doarate,
      lineWidth: 1,
      marker: {
        enabled: false
      },
      color: '#761800',
    }]
  });
};

