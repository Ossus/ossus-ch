/**
 *  Main script file.
 */

var _w_tablet = 460;
var _w_desktop = 980;

/**
 *  Sets up our circus.
 */
function setupCircus() {
	var parent = $('#circus');
	
	for (p in _data) {
		var app = _data[p];
		var app_name = 'name' in app ? app['name'] : p;
		var li = $('<li/>');
		
		// icon & link
		var url = 'url' in app ? app['url'] : '';
		var link = $('<a/>').attr('href', url);
		var icon = $('<img/>').attr('src', 'images/' + p + (onRetinaScreen() ? '@2x' : '') + '.png').attr('alt', p);
		var span = $('<span/>').text(app_name);
		link.append(icon).append(span);
		li.append(link);
		link.click(function(e) {
			e.stopPropagation();
			return true;
		});
		
		// hover
		var desc = 'desc' in app ? app['desc'] : null;
		if (desc) {
			var hover = $('<div/>').html('<h2>' + app_name + '</h2>' + desc);
			hover.click(function(e) {
				e.stopPropagation();
				e.preventDefault();
			});
			li.append(hover);
		}
		
		// position
		parent.append(li);
		
		if ($(window).width() >= _w_desktop) {
			circlePutItemToPositionAtAngle(li, 90);
		}
	}
}


/**
 *  Toggles the circus state.
 */
function toggleCircus() {
	var winwidth = $(window).width();
	
	var main = $('#full');
	var circus = $('#circus');
	circus.parent().show();
	
	// phones & tablets
	if (winwidth < _w_desktop) {
		if (main.hasClass('shown')) {
			hideCircusOnPhones();
		}
		else {
			showCircusOnPhones();
		}
		return;
	}
	
	// desktop
	var kids = circus.find('li');
	var step = 360 / kids.length;
	
	var first_angle = -110;
	var show_circus = !main.hasClass('shown');
	
	// we are hiding the circus
	if (!show_circus) {
		step = 0;
		first_angle = 90;
	}
	
	// rotate circus
	kids.each(function(i, item) {
		circleItemTo($(item), first_angle + i * step, circus);
	});
	main.toggleClass('shown');
	
	// set background size - must be set in percent so the CSS animation kicks in
	if (show_circus) {
		var percent_300 = 300 / $(window).width() * 100;
		$('#full').css('background-size', percent_300 + '%');
	}
	else {
		$('#full').css('background-size', '40%');
	}
}

function showCircusOnPhones() {
	$('#circus-wrap').show();
	
	window.setTimeout(function() {
		$('#full').addClass('shown');
	}, 10);
}

function hideCircusOnPhones() {
	$('#full').removeClass('shown');
	
	window.setTimeout(function() {
		$('#circus-wrap').hide();
	}, 1000);
}


/**
 *  Returns true on a retina device.
 */
function onRetinaScreen() {
	return ('devicePixelRatio' in window) ? (window.devicePixelRatio > 1.5) : false;
}
