var draw = function(hashrate, doarate, blocks, renderTo, interval) {
    chart = new Highcharts.Chart({
        chart: {
            renderTo: renderTo,
            animation: true,
            borderWidth: 0,
        },
        credits: { enabled: false },
        exporting: { enabled: false },
        title: { text: 'Hashrate/Reject Rate (' + interval + ')' },
        xAxis: {
            type: 'datetime',
            maxZoom: 24 * 3600,
            title: {
                text: null
            }
        },
        yAxis: {
            labels: {
                formatter: function() {
                    if (this.value > Math.pow(1000, 4))
                        { return (this.value / Math.pow(1000, 4)) + ' TH/s'; }
                    if (this.value > Math.pow(1000, 3))
                        { return (this.value / Math.pow(1000, 3)) + ' GH/s'; }
                    if (this.value > Math.pow(1000, 2))
                        { return (this.value / Math.pow(1000, 2)) + ' MH/s'; }
                    if (this.value > Math.pow(1000, 1))
                        { return (this.value / Math.pow(1000, 1)) + ' KH/s'; }
                    
                    return this.value + ' H/s';
                },
            },
            title: {
                text: 'Hashrate'
            },
            min: 0,
        },
        tooltip: {
            formatter: function() {
                var s = '<b>' + new Date(this.x) + '</b>';
    
                var hashrate = 0, doarate = 0;
                $.each(this.points, function(i, point) {
                    if (point.series.name === 'Dead on arrival') { doarate = point.y; }
                    if (point.series.name === 'Hashrate') { hashrate = point.y; }
        
                    if (point.y > Math.pow(1000, 4))
                        { val = (point.y / Math.pow(1000, 4)).toFixed(2) + ' TH/s'; }
                    else if (point.y > Math.pow(1000, 3))
                        { val = (point.y / Math.pow(1000, 3)).toFixed(2) + ' GH/s'; }
                    else if (point.y > Math.pow(1000, 2))
                        { val = (point.y / Math.pow(1000, 2)).toFixed(2) + ' MH/s'; }
                    else if (point.y > Math.pow(1000, 1))
                        { val = (point.y / Math.pow(1000, 1)).toFixed(2) + ' KH/s'; }
                    else { val = point.y + ' H/s'; }
                    
                    s += '<br/>' + point.series.name + ': ' + val;
                });
    
                // if we display hash and doa, attach percentage to the doa rate
                if (hashrate > 0 && doarate > 0) {
                    prop = ((doarate / hashrate) * 100).toFixed(2);
                    s += ' (' + prop + '%)';
                }
                
                return s;
            },
            shared: true,
            valueSuffix: ' H/s',
        },
        legend: {
            enabled: true,
            borderWidth: 0
        },
        plotOptions: {
            areaspline: {
                fillColor: '#ace',
                marker: { enabled: false },
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
            },
        },
        series: [
            {
                type: 'areaspline',
                name: 'Hashrate',
                data: hashrate,
                lineWidth: 1,
                marker: {
                    enabled: false
                },
            },
            {
                type: 'spline',
                name: 'Rejected',
                data: doarate,
                lineWidth: 1,
                marker: {
                    enabled: false
                },
                color: '#761800',
            }
        ]
    });
    
    for (var i in blocks) {
        chart.xAxis[0].addPlotLine({
            color: 'rgba(0, 0, 0, 0.2)',
            width: 1,
            value: blocks[i]
        });
    }
};

