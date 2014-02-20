<<<<<<< HEAD
<<<<<<< HEAD
var draw= function(hashrate, doarate, renderTo) {
  char= new Highcharts.Chart({
    chart: {
      renderTo: renderTo,
      animation: true,
      borderWidth: 0,
    },
    credits: { enabled: false },
    exporting: { enabled: false },
    title: { text: 'Node Hash/DOA-Rate' },
=======
var draw= function(hashrate, doarate) {
=======
var draw= function(hashrate, doarate, renderTo) {
>>>>>>> 55d13d9... Merged from devel tree
  char= new Highcharts.Chart({
    chart: {
      renderTo: renderTo,
      animation: true,
      borderWidth: 0,
    },
    credits: { enabled: false },
    exporting: { enabled: false },
<<<<<<< HEAD
    title: { text: 'Hashrate/DOA rate' },
    rangeSelector: {
      selected: 1,
      enabled: true,
    },
>>>>>>> e7bc537... First shot. Only partly done yet.  Still under high development.  Consider as alpha
=======
    title: { text: 'Node Hash/DOA-Rate' },
>>>>>>> 55d13d9... Merged from devel tree
    xAxis: {
      type: 'datetime',
      maxZoom: 24 * 3600,
      title: {
        text: null
      }
    },
    yAxis: {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 55d13d9... Merged from devel tree
      labels: {
        formatter: function() {
          if(this.value > Math.pow(1000, 4))
            { return (this.value / Math.pow(1000, 4)) + ' TH/s'; }
          if(this.value > Math.pow(1000, 3))
            { return (this.value / Math.pow(1000, 3)) + ' GH/s'; }
          if(this.value > Math.pow(1000, 2))
            { return (this.value / Math.pow(1000, 2)) + ' MH/s'; }
          if(this.value > Math.pow(1000, 1))
            { return (this.value / Math.pow(1000, 1)) + ' KH/s'; }
          return this.value + ' H/s';
        },
      },
<<<<<<< HEAD
=======
>>>>>>> e7bc537... First shot. Only partly done yet.  Still under high development.  Consider as alpha
=======
>>>>>>> 55d13d9... Merged from devel tree
      title: {
        text: 'Hashrate'
      },
      min: 0,
    },
    tooltip: {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 55d13d9... Merged from devel tree
      formatter: function() {
        var s= '<b>' + new Date(this.x) + '</b>';

        var hashrate= 0, doarate= 0;
        $.each(this.points, function(i, point) {
          if(point.series.name==='Dead on arrival') { doarate= point.y; }
          if(point.series.name==='Hashrate') { hashrate= point.y; }

          if(point.y > Math.pow(1000, 4))
            { val= (point.y / Math.pow(1000, 4)).toFixed(2) + ' TH/s'; }
          else if(point.y > Math.pow(1000, 3))
            { val= (point.y / Math.pow(1000, 3)).toFixed(2) + ' GH/s'; }
          else if(point.y > Math.pow(1000, 2))
            { val= (point.y / Math.pow(1000, 2)).toFixed(2) + ' MH/s'; }
          else if(point.y > Math.pow(1000, 1))
            { val= (point.y / Math.pow(1000, 1)).toFixed(2) + ' KH/s'; }
          else { val= point.y + ' H/s'; }
          s+= '<br/>' + point.series.name + ': ' + val;
        });

        // if we display hash and doa, attach percentage to the doa rate
        if(hashrate > 0 && doarate > 0) {
          prop= ((doarate / hashrate) * 100).toFixed(2);
          s+= ' (' + prop + '%)';
        }
        return s;
      },
      shared: true,
      valueSuffix: ' H/s',
<<<<<<< HEAD
=======
      shared: true
>>>>>>> e7bc537... First shot. Only partly done yet.  Still under high development.  Consider as alpha
=======
>>>>>>> 55d13d9... Merged from devel tree
    },
    legend: {
      enabled: true,
      borderWidth: 0
    },
    plotOptions: {
      areaspline: {
        fillColor: '#ace',
        marker: { enabled: false },
<<<<<<< HEAD
<<<<<<< HEAD
        lineWidth: 2,
        shadow: false,
        states: {
          hover: { lineWidth: 2 }
        },
        threshold: null,
        animation: false
      },
      spline: {
        marker: { enabled: false },
        lineWidth: 2,
        shadow: false,
        states: {
          hover: { lineWidth: 2 }
        },
        threshold: null,
        animation: false,
=======
        lineWidth: 1,
=======
        lineWidth: 2,
>>>>>>> 55d13d9... Merged from devel tree
        shadow: false,
        states: {
          hover: { lineWidth: 2 }
        },
        threshold: null,
        animation: false
      },
      spline: {
        marker: { enabled: false },
        lineWidth: 2,
        shadow: false,
        states: {
          hover: { lineWidth: 2 }
        },
<<<<<<< HEAD
        threshold: null
>>>>>>> e7bc537... First shot. Only partly done yet.  Still under high development.  Consider as alpha
=======
        threshold: null,
        animation: false,
>>>>>>> 55d13d9... Merged from devel tree
      },
    },
    series: [{
      type: 'areaspline',
      name: 'Hashrate',
      data: hashrate,
<<<<<<< HEAD
<<<<<<< HEAD
      lineWidth: 1,
=======
      lineWidth: 2,
>>>>>>> e7bc537... First shot. Only partly done yet.  Still under high development.  Consider as alpha
=======
      lineWidth: 1,
>>>>>>> 55d13d9... Merged from devel tree
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

