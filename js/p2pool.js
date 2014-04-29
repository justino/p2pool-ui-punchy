var currency, currency_info, rate, local_stats, global_stats, current_payouts, recent_blocks, payout_addr;
var local_hashrate= 0, local_doa_hashrate= 0;
var jsonp = "./jsonp.php?callback=?";
var api_url = "";
if (typeof config === 'undefined') {
    // Config couldn't be loaded, prefill with some basic defaults
    config = {
        myself: [],
        host: '',
        reload_interval: 30,
        reload_chart_interval: 600,
        header_content_url: ''
    };
}

// Check if we shall remotely connect to a p2pool running somewhere
if (config.host && config.host.length > 0) {
    api_url = jsonp + '&host=' + encodeURI(config.host) + '&report=';
    $('#node').removeClass('hidden').text(config.host);
    $('#_node').removeClass('hidden');
}

// ==================================================================
// event handlers

$(document).ready(function() {
    $(document).trigger('init');
    
    if (config.header_content_url && config.header_content_url.length > 0) {
        $("#header_content").load(config.header_content_url);
    }
});

// toggle hashrate chart
$('#hour.hashrate').click(function(e) {
    fetchGraph('hour');
});
$('#day.hashrate').click(function(e) {
    fetchGraph('day');
});
$('#week.hashrate').click(function(e) {
    fetchGraph('week');
});
$('#month.hashrate').click(function(e) {
    fetchGraph('month');
});
$('#year.hashrate').click(function(e) {
    fetchGraph('year');
});

$('#setminers.btn').click(function(e) {
    setMyMiners();
});

// ==================================================================
// custom event handlers

// init
$(document).on('init', function(e, eventInfo) {
    fetchBlocks();
    fetchdata();
    fetchGraph('day');
    
    fetchMyMiners();
    initThemes();
});

$(document).on('update', function(e, eventInfo) {
    fetchBlocks();
    fetchdata();
});

$(document).on('update_graph', function(e, eventInfo) {
    graphPeriod = chart.title.text.match(/\((.+)\)/)[1] || 'day';
    fetchGraph(graphPeriod);
});

// Fills the list of active miners on this node.  I know, there are
// zillions of people out there on p2pool.  But I'm typically only
// interested to see, who is mining on my node.
$(document).on('update_miners', function(e, eventInfo) {
    local_hashrate = 0; 
    local_doa_hashrate = 0;
    
    // Sort by hashrate, highest first
    miners = sortByValue(local_stats.miner_hash_rates).reverse();
    clientMiners = (localStorage.miners && localStorage.miners.length > 0) ? localStorage.miners.split("\n") : [];
    
    $('#active_miners').find("tr:gt(0)").remove();
    $.each(miners, function(_, address) {
        // Only display client miners if configured
        if (localStorage.onlyclientminers === 'true' && $.inArray(address, clientMiners) == -1) {
            return true;
        }
        
        hashrate = local_stats.miner_hash_rates[address];
        tr = $('<tr/>').attr('id', address);

        // Highlight client miner if configured
        if (localStorage.miners && localStorage.miners.length > 0 && $.inArray(address, clientMiners) >= 0) {
            tr.addClass('success');
        }
        // Highlight server miner if configured
        if (config.myself && config.myself.length > 0 && $.inArray(address, config.myself) >= 0) {
            tr.addClass('warning');
        }

        address_span = $('<span/>').addClass('coin_address').text(address);
        link_icon = $('<i/>').addClass('fa fa-external-link fa-fw');
        blockinfo = $('<a/>')
            .attr('href', currency_info.address_explorer_url_prefix + address)
            .attr('target', '_blank').append(link_icon);

        doa = local_stats.miner_dead_hash_rates[address] || 0;
        doa_prop = (parseFloat(doa) / parseFloat(hashrate)) * 100;

        local_hashrate += hashrate || 0;
        local_doa_hashrate += doa  || 0;
        
        tr.append($('<td/>')
            .addClass('text-left')
            .append(address_span)
            .append('&nbsp;')
            .append(blockinfo)
        );
        tr.append($('<td/>')
            .addClass('text-right')
            .append(formatHashrate(hashrate))
        );
        tr.append($('<td/>')
            .addClass('text-right')
            .append(formatHashrate(doa) + ' (' + doa_prop.toFixed(2) + '%)')
        );
        
        // Miner Last Difficulties is non-standard p2pool data
        // Handle with care
        if (local_stats.miner_last_difficulties) {
            diff = local_stats.miner_last_difficulties ? (parseFloat(local_stats.miner_last_difficulties[address]) || 0) : 0;
            time_to_share = (parseInt(local_stats.attempts_to_share) / parseInt(hashrate) * (diff / parseFloat(global_stats.min_difficulty))) || 0;
            
            if ($("#active_miners th:contains('Share Difficulty')").length == 0) {
                var share_diff_col = $('<th/>')
                    .addClass('text-right')
                    .text('Share Difficulty');
                var time_to_share_col = $('<th/>')
                    .addClass('text-right')
                    .text('Time to Share');
                    
                $('#active_miners thead tr')
                    .children(":eq(2)")
                    .after(time_to_share_col)
                    .after(share_diff_col);
            }
            
            tr.append($('<td/>')
                .addClass('text-right')
                .append(diff.toFixed(3) + ' (' + formatInt(diff * 65536) + ')')
            );
            tr.append($('<td/>')
                .addClass('text-right')
                .append(('' + time_to_share).formatSeconds())
            );
        }

        payout = current_payouts[address] || 0;

        if (payout) {
            td = $('<td/>').attr('class', 'text-right')
                .text(parseFloat(payout).toFixed(8))
                .append(' ').append(currency.clone());
            tr.append(td);
        }
        else {
            tr.append($('<td/>').attr('class', 'text-right')
                .append($('<i/>').append('no shares yet')));
        }

        $('#active_miners').append(tr);
    });

    if (local_doa_hashrate !== 0 && local_hashrate !== 0) {
        doa_rate = (local_doa_hashrate / local_hashrate) * 100;
    }
    else { 
        doa_rate= 0;
    }

    rate = formatHashrate(local_hashrate)
        + ' (Rejected '
        + formatHashrate(local_doa_hashrate)
        + ' / ' + doa_rate.toFixed(2)
        + '%)';
    $('#local_rate').text(rate);

    pool_hash_rate = parseInt(global_stats.pool_hash_rate || 0);
    pool_nonstale_hash_rate = parseInt(global_stats.pool_nonstale_hash_rate || 0);
    global_doa_rate = pool_hash_rate - pool_nonstale_hash_rate;

    global_rate = formatHashrate(pool_hash_rate)
        + ' (Rejected '
        + formatHashrate(global_doa_rate)
        + ' / ' + ((global_doa_rate / pool_hash_rate) * 100).toFixed(2)
        + '%)';
    $('#global_rate').text(global_rate);

    // Network Hash Rate information is non-standard p2pool data
    // Handle with care
    if (global_stats.network_hashrate) {
        //<li class="list-group-item">Network Hashrate: <span class="network_rate"></span></li>
        if ($(".status li:contains('Network Hashrate')").length == 0) {
            // Add network hashrate bar to status area if it doesn't already exist
            var nethash_row = $('<li/>')
                .addClass('list-group-item')
                .text('Network Hashrate: ')
                .append( $('<span/>').addClass('network_rate') );
            $('.status.rate_info').prepend(nethash_row);
        }
        
        network_rate = formatHashrate(global_stats.network_hashrate);
        $('.network_rate').text(network_rate);
    }

    // Network Block Diff information is non-standard p2pool data
    // Handle with care
    if (global_stats.network_block_difficulty) {
        // Add diff button to the navbar if it doesn't already exist
        if ($('button .diff').length == 0) {
            var diff_button = $('<button/>')
                .attr('type', 'button')
                .addClass('btn navbar-btn btn-default btn-sm')
                .text('Diff: ')
                .append( $('<span/>').addClass('diff') );
            $('.navbar-right').children(":eq(1)").after(diff_button);
        }
        // Add diff bar to status area if it doesn't already exist
        if ($(".status li:contains('Network Block Difficulty')").length == 0) {
            var diff_row = $('<li/>')
                .addClass('list-group-item')
                .text('Network Block Difficulty: ')
                .append( $('<span/>').addClass('diff') );
            $('.status.share_info').children(':eq(1)').after(diff_row);
        }
        
        $('.diff').text(parseFloat(global_stats.network_block_difficulty).toFixed(2));
    }

    $('#share_difficulty').text(parseFloat(global_stats.min_difficulty).toFixed(2));

    $('#block_value')
        .text(parseFloat(local_stats.block_value).toFixed(8))
        .append(' ').append(currency.clone());

    $('#node_donation').text((local_stats.donation_proportion * 100) + '%');
    $('#node_fee').text(local_stats.fee + '%');
    $('#p2pool_version').text(local_stats.version);
    $('#protocol_version').text(local_stats.protocol_version);
    $('#peers_in').text(local_stats.peers.incoming);
    $('#peers_out').text(local_stats.peers.outgoing);
    $('#node_uptime').text(('' + local_stats.uptime).formatSeconds());

    if (local_stats.warnings.length > 0) {
        $('#node_alerts').empty();

        $.each(local_stats.warnings, function(key, warning) {
            $('#node_alerts').append($('<p/>').append(warning));
        }); 

        $('#node_alerts').fadeIn(1000, function() {
            $(this).removeClass('hidden');
        });
    }
    else {
        if (! $('#node_alerts').hasClass('hidden')) {
            $('#node_alerts').fadeOut(1000, function() {
                $(this).addClass('hidden');
            });
        }
    }

    $('#shares')
        .text('Total: ' + local_stats.shares.total
            + ' (Orphan: ' + local_stats.shares.orphan
            + ', Dead: ' + local_stats.shares.dead + ')');

    if (local_hashrate !== 0) {
        time_to_share = (parseInt(local_stats.attempts_to_share) / parseInt(local_hashrate));
        $('#expected_time_to_share').text((''+time_to_share).formatSeconds());
    }
    else {
        $('#expected_time_to_share').html('&dash;');
    }

    attempts_to_block = parseInt(local_stats.attempts_to_block || 0);
    time_to_block = attempts_to_block / pool_hash_rate;
    $('#expected_time_to_block').text(('' + time_to_block).formatSeconds());
});

// Fills the recent block table
$(document).on('update_blocks', function(e, eventInfo) {
    $('#recent_blocks').find('tbody tr').remove();
    
    $.each(recent_blocks, function(key, block) {
        ts = block.ts; 
        num = block.number; 
        hash = block.hash;

        // link to blockchain.info for the given hash
        blockinfo = $('<a/>')
            .attr('href', currency_info.block_explorer_url_prefix + hash)
            .attr('target', '_blank').text(num);

        tr = $('<tr/>').attr('id', num);
        tr.append($('<td/>').append($.format.prettyDate(new Date(ts * 1000))));
        tr.append($('<td/>').append($.format.date(new Date(ts * 1000))));
        tr.append($('<td/>').append(blockinfo));
        $('#' + num).remove(); 
        $('#recent_blocks').append(tr);
    });
    
    if (recent_blocks[0] != null & recent_blocks[0].ts != null) {
        $('#last_block').text( $.format.prettyDate(new Date(recent_blocks[0].ts * 1000)) );
    }
    else {
        $('#last_block').text('none yet')
    }
});

$(document).on('update_shares', function(e, eventInfo) {
    $.each(recent_blocks, function(key, block) {
        ts = block.ts; 
        num = block.number;
        hash = block.hash;

        // link to blockchain.info for the given hash
        blockinfo = $('<a/>')
            .attr('href', currency_info.block_explorer_url_prefix + hash)
            .attr('target', '_blank').text(hash);

        tr = $('<tr/>').attr('id', num);
        tr.append($('<td/>').append($.format.prettyDate(new Date(ts * 1000))));
        tr.append($('<td/>').append(num));
        tr.append($('<td/>').append(blockinfo));
        tr.append($('<td/>').html('&dash;'));
        $('#recent_blocks').append(tr);
    });
});

// Place the currency symbol for the currency the node is mining.  If
// it's Bitcoin, use the fontawesome BTC icon
var set_currency_symbol = true;
$(document).on('update_currency', function(e, eventInfo) {
    if (currency_info.symbol === 'BTC') {
        // use fontawesome BTC symbol
        currency = $('<i/>').attr('class', 'fa fa-btc fa-fw');
    }
    else {
        currency = $('<span/>').append(currency_info.symbol);
    }

    if (set_currency_symbol) {
        $('#currency').append('(').append(currency).append(')');
        set_currency_symbol = false;
    }
});

// Updates the 'Updated:' field in page header
$(document).on('update_time', function(e, eventInfo) {
    dts = $.format.date(new Date(), 'yyyy-MM-dd hh:mm:ss p');
    $('#updated').text(dts);
});

// ==================================================================

var fetchdata = function() {
    $.getJSON(api_url + '/rate', function(data) {
        if (data) { rate = data; }
    });
    
    $.getJSON(api_url + '/web/currency_info', function(data) {
        if (data) { currency_info = data; }
        $(document).trigger('update_currency');
    
        $.getJSON(api_url + '/local_stats', function(data) {
            if (data) { local_stats = data; }
    
            $.getJSON(api_url + '/current_payouts', function(data) {
                if (data) { current_payouts = data; }
    
                $.getJSON(api_url + '/payout_addr', function(data) {
                    if (data) { payout_addr = data; }
    
                    $.getJSON(api_url + '/global_stats', function(data) {
                            if (data) { global_stats= data; }
                            
                            $(document).trigger('update_miners');
                            $(document).trigger('update_time');
                    });
                });
            });
        });
    });
};

var fetchBlocks = function() {
    $.getJSON(api_url + '/web/currency_info', function(data) {
        if (data) { currency_info = data; }
        
        $.getJSON(api_url + '/recent_blocks', function(data) {
            if (data) { recent_blocks = data; }
            $(document).trigger('update_blocks');
        });
    });
};

var fetchGraph = function(interval) {
    var graph_hashrate = [], graph_doa_hashrate = [], graph_blocks = [];

    // Fetch Local Hashrates
    $.getJSON(api_url + '/web/graph_data/local_hash_rate/last_' + interval, function(data) {
        $.each(data, function(key, value) {
            el = [];
            el.push(parseInt(value[0]) * 1000, parseFloat(value[1]));
            graph_hashrate.push(el);
        });
        
        graph_hashrate.sort();
        
        // Fetch Local DOA Hashrates
        $.getJSON(api_url + '/web/graph_data/local_dead_hash_rate/last_' + interval, function(data) {
            $.each(data, function(key, value) {
                el = [];
                el.push(parseInt(value[0]) * 1000, parseFloat(value[1]));
                graph_doa_hashrate.push(el);
            });
            
            graph_doa_hashrate.sort();
            
            // Fetch Recently Found Blocks
            $.getJSON(api_url + '/recent_blocks', function(data) {
                $.each(data, function(key, block) {
                    el = [];
                    el.push(parseInt(block["ts"]) * 1000);
                    graph_blocks.push(el);
                });
                
                draw(graph_hashrate, graph_doa_hashrate, graph_blocks, 'chart', interval);
            });
        });
    });
};

var setMyMiners = function() {
    localStorage.miners = $('#myminers').val();
    localStorage.onlyclientminers = $('#onlymyminers').prop('checked');
    $(document).trigger('update_miners');
};
var fetchMyMiners = function() {
    $('#myminers').val(localStorage.miners);
    $('#onlymyminers').prop('checked', localStorage.onlyclientminers == 'true' ? true : false);
};

var initThemes = function() {
    $('#settheme li').click(function() {
        $(this).addClass('active').siblings().removeClass('active');
        localStorage.theme = $(this).text();
        changeTheme(localStorage.theme);
    });
    
    $('#settheme li').each(function() {
        if (localStorage.theme) {
            if ($(this).text() === localStorage.theme) {
                $(this).addClass('active').siblings().removeClass('active');
                changeTheme(localStorage.theme);
            }
        }
        else {
            changeTheme('default');
        }
    });
};
var changeTheme = function(theme) {
    $('#theme').attr('href', 'css/bootstrap-' + theme.toLowerCase() + '.min.css');
};

// update tables and miner data
setInterval(function() {
    $(document).trigger('update');
}, config.reload_interval * 1000);

// update blocks and graph
setInterval(function() {
    $(document).trigger('update_graph');
}, config.reload_chart_interval * 1000);
