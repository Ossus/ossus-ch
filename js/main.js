/**
 *  Main script file.
 */


/**
 *  Sets up our circus.
 */
function setupCircus() {
	
	// circus logo
	$('#circus-logo').attr('src', onRetinaScreen() ? 'images/Ossus-300@2x.png' : 'images/Ossus-300.png').hide();
	
	// circus
	var kids = $('#circus').find('.item');
	var step = 360 / kids.length;
	
	kids.each(function(i, item) {
		var view = $(item);
		var app = view.data('app');
		var d = app in _data ? _data[app] : {};
		var app_name = 'name' in d ? d['name'] : app;
		
		// icon & link
		var url = 'url' in d ? d['url'] : '';
		var link = $('<a/>').attr('href', url);
		var icon = $('<img/>').attr('src', 'images/' + app + (onRetinaScreen() ? '@2x' : '') + '.png').attr('alt', app);
		var span = $('<span/>').text(app_name);
		link.append(icon).append(span);
		view.append(link);
		link.click(function(e) {
			e.stopPropagation();
			return true;
		});
		
		// hover
		var desc = 'desc' in d ? d['desc'] : null;
		if (desc) {
			var hover = $('<div/>').html('<h2>' + app_name + '</h2>' + desc);
			hover.click(function(e) {
				e.stopPropagation();
				e.preventDefault();
			});
			view.append(hover);
		}
		
		// position
		view.show();
		circlePutItemToPositionAtAngle(view, 90);
	});
}


/**
 *  Toggles the circus state.
 */
var _circus_timeout = null;

// setup click function
function toggleCircus() {
	var circus = $('#circus');
	if (_circus_timeout) {
		window.clearTimeout(_circus_timeout);
	}
	
	var kids = circus.find('.item');
	var step = 360 / kids.length;
	
	// default vars when showing the circus
	var target_size = '';
	var percent_timeout = 1000;
	var first_angle = -110;
	var show_circus = true;
	
	// we are hiding the circus
	if (circus.hasClass('shown')) {
		step = 0;
		target_size = '40%';
		percent_timeout = 0;
		first_angle = 90;
		show_circus = false;
	}
	
	// rotate circus
	
	kids.each(function(i, item) {
		circleItemTo($(item), first_angle + i * step, circus);
	});
	circus.toggleClass('shown');
	
	// set background size - must be set in percent so the CSS animation kicks in
	var percent_300 = 300 / $(window).width() * 100;
	$('#full').css('background-size', percent_300 + '%');//.prop('onclick', null);
	_circus_timeout = window.setTimeout(function() {
		if (show_circus) {
			$('#full').css('background-size', target_size).css('background-image', 'none');
			$('#circus-logo').show();
		}
		else {
			$('#full').css('background-size', target_size).css('background-image', 'url(images/Ossus-1200.png)');
			$('#circus-logo').hide();
		}
	}, percent_timeout);
}


/**
 *  Returns true on a retina device.
 */
function onRetinaScreen() {
	return ('devicePixelRatio' in window) ? (window.devicePixelRatio > 1.5) : false;
}
