/*
 ********************************************
 * Convert US to metric and vice versa      *
 *                                          *
 * Created by Pascal Pfiffner, Aug 20, 2011 *
 ********************************************
 */

// add jQuery to the site
var script = document.createElement('script');
script.className = 'conv_item';
script.type = 'text/javascript';
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js';
script.onload = conv_ready;
document.body.appendChild(script);

// the main function
function conv_ready() {
	var progress = $('<div id="conv_progress" class="conv_item" style="position:fixed;top:0;left:0;width:120px;height:30px;line-height:30px;text-align:center;background-color:rgba(0,0,0,0.8);color:white;font-size:12px;text-shadow:0 0 4px rgb(32,73,160);">Converting...</div>');
	$('body').append(progress);
	
	// create regex objects
	// 'm' = regex-match, 'to' = to-unit label, 'f' = factor, 'n' = round to this many decimal places
	// 1st catched parentheses should match the whole thing
	// 2nd catched parentheses should be the numerical-only matches
	var regexes = {
		'inch': {'m': /((?:^|(?:[^"][\s-\+\*x\/\:]))(([\d]+\.)?[\d]+)\s*("|in(?:ch(?:es)?)?))/gm, 'to': 'cm', 'f': 2.54, 'n': 1},
		'foot': {'m': /((?:^|(?:[^'][\s-\+\*x\/\:]))(([\d]+\.)?[\d]+)\s*('|ft|foot))/gm, 'to': 'm', 'f': 0.3048, 'n': 2}
	};
	
	// find numeric matches
	$('body *').contents().filter(function() {
		try {
			return (3 == this.nodeType) && this.textContent && (this.textContent.replace(/\s/g, '').length > 1);
		}
		catch(exc) {}
		return false;
	}).each(function(i, node) {
		if (node.parentNode && 'script' != node.parentNode.nodeName.toLowerCase()) {
			var txt = node.textContent;
			if (txt && txt.length > 0) {
				for (r in regexes) {
					var hash = regexes[r];
					var regex = hash['m'];
					if (regex.test(txt)) {
						node.parentNode.replaceChild($('<span class="conv_wrap">' + txt.replace(regex, '<span class="conv_' + r + '" data-n="$2">$1</span>') + '</span>').get(0), node);
					}
				}
			}
		}
	});
	
	// convert all matches
	for (r in regexes) {
		var rg = regexes[r];
		var hash = regexes[r];
		var rg = hash['m'];
		$('.conv_' + r).each(function(i, node) {
			var n = $(node);
			var converted = n.data('n') * hash['f'];
			n.after('<span class="conv_item" style="color:rgb(32,73,160);"> (' + converted.toFixed(hash['n'] || 1) + hash['to'] + ')</span>');
			n.replaceWith(n.text());
		});
	}
	
	// done
	progress.html('<a style="color:white;" href="javascript:void(0);" onclick="conv_removeAll()">Remove again</a>');
}

function conv_removeAll() {
	$('.conv_wrap').children().unwrap();
	$('.conv_item').fadeOut('fast', function() { $(this).remove(); });
}
