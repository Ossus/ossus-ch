/**
 *  Functions for our carousel layout.
 */
 
 var _circleState = {
 	'items': [],
 	'interval': null,
 	'duration': 1000
 };
 
 
 /**
  *  Circles an given item to the given angle, clockwise.
  *
  *  @param view The view to circle; must already be in target div, absolutely positioned
  */
 function circleItemTo(view, deg, div, delay, duration) {
 	
 	// make sure we have an id
 	var id = view.attr('id');
 	if (!id) {
 		id = 'circle' + (new Date()).getTime() + Math.round(Math.random() * 100000);
 		view.attr('id', id);
 	}
 	
	// calculate current angle
	var x = parseInt(view.css('left')) + view.outerWidth() / 2;
	var y = parseInt(view.css('top')) + view.outerHeight() / 2;
	var a = x - div.innerWidth() / 2;
	var b = y - div.innerHeight() / 2;
	var alpha = Math.atan2(b, a);
	var radius = Math.ceil(Math.sqrt(a*a + b*b));
	
 	deg = deg % 360;
 	if (deg > 180) {
 		deg -= 360;
 	}
 	else if (deg < -180) {
 		deg += 360;
 	}
	var target = deg2rad(deg);
	while (target < alpha) {
		target += 2 * Math.PI;
	}
	// console.log('current:', Math.round(alpha / 0.017453), 'target:', Math.round(target / 0.017453));
	if (Math.round(alpha / 0.017453) == deg) {
		return false;
	}
	
	// init
	view.css('position', 'absolute');			// Fix for Safari 5.1
  	delay = delay ? delay : 0;
	var now = (new Date()).getTime();
 	var dur = duration ? duration : _circleState.duration;
	var state = {
		'view': view,
		'width': view.width(),
		'height': view.height(),
		'box': {
			'width': div.innerWidth(),
			'height': div.innerHeight()
		},
		'radius': radius,
		'start': {
			'rad': alpha,
			'time': now + delay
		},
		'end': {
			'rad': target,
			'time': now + delay + dur
		},
		'duration': dur,
		'interval': null
	};
	
	_circleState.items[id] = state;
	
	// set interval
	if (!_circleState.interval) {
		_circleState.interval = window.setInterval(_circleView, 20);
	}
	return true;
}


/**
 *  Iterates through all _circleState.items views and places each item at their momentaneous spot, as defined by their status dict.
 */
function _circleView() {
	var dict = _circleState;
	if (!dict) {
		return;
	}
	
	var now = (new Date()).getTime();
	var latest = 0;
	for (var id in _circleState.items) {
		var s = _circleState.items[id];
		if (s.start.time > now) {
			continue;
		}
		var thisRad = 0;
		latest = Math.max(s.end.time, latest);
		
		// animating
		if (now < s.end.time) {
			var delta = (now - s.start.time) / s.duration;
			var factor = delta;
			if (!s.linear) {
				factor = ((delta * delta) * 3.0) - ((delta * delta * delta) * 2.0);		// ease in-out
			}
			thisRad = s.start.rad + (factor * (s.end.rad - s.start.rad));
		}
		else {
			thisRad = s.end.rad;
			delete _circleState.items[id];
		}
		
		// calculate position from angle
		_circlePutItem(s.view, thisRad, s.width, s.height, s.box);
	}
	
	// all done
	if (latest < now) {
		window.clearInterval(_circleState.interval);
		_circleState.interval = null;
		_circleState.items = {};
	}
}


/**
 *  Moves a jQuery object to the position representing the given angle.
 *  Uses its offsetParent element to determine the position.
 *  @param item A jQuery item
 *  @param angle The angle in degrees
 */
function circlePutItemToPositionAtAngle(item, angle) {
	var div = item.offsetParent();
	var box = {
		'width': div.innerWidth(),
		'height': div.innerHeight()
	}
	
	_circlePutItem(item, deg2rad(angle), item.width(), item.height(), box);
}

/**
 *  Moves a jQuery object to the given position at the given angle.
 *  @param item A jQuery item
 *  @param radians The angle in radians
 *  @param width The width of the item
 *  @param height The height of the item
 *  @param box A dictionary with width and height values describing the containing box
 */
function _circlePutItem(item, radians, width, height, box) {
	var center = {
		x: box.width / 2,
		y: box.height / 2
	};
	
	var a = Math.sin(radians) * center.x;
	var b = Math.cos(radians) * center.x;		// yes, twice X to simulate a perfect circle
	var left = center.x + b - width / 2;
	var top = center.y + a - height / 2;
	
	// non-square
	if (box.width != box.height) {
		// top = Math.round(top * box.height / box.width);
		// top -= Math.round((box.height - box.width) / 2);
	}
	
	item.css('top', top).css('left', left);
}


/**
 *  Convert degrees to radians.
 */
function deg2rad(deg) {
	return deg * 0.017453;
}
