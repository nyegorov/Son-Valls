var map;

function initMap() {
	var uluru = {lat: 48.845, lng: 13.343};	//48.8450723,13.342773,7.42z
	var styles = [
		{ "elementType": "geometry",			"stylers": [{"color": "#f5f5f5" }]},
		{ "elementType": "labels.icon",			"stylers": [{"visibility": "off" }]},
		{ "elementType": "labels.text.fill",	"stylers": [{"color": "#616161"}]},
		{ "elementType": "labels.text.stroke",	"stylers": [{"color": "#f5f5f5"}]},
		{ "featureType": "administrative.country", 		"elementType": "geometry.stroke",	"stylers": [{"color": "#000000"}, {"lightness": 25}]},
		{ "featureType": "administrative.country", 		"elementType": "labels.text.fill",	"stylers": [{"color": "#000000"}]},
		{ "featureType": "administrative.land_parcel",  "elementType": "labels.text.fill",	"stylers": [{"color": "#bdbdbd"}]},
		{ "featureType": "administrative.locality",		"elementType": "labels.text",	    "stylers": [{"color": "#000000"}, {"visibility": "simplified"}]},
		{ "featureType": "administrative.province",		"elementType": "labels.text",	    "stylers": [{"color": "#000000"}, {"visibility": "simplified"}]},
		{ "featureType": "poi",							"elementType": "geometry", 			"stylers": [{"color": "#eeeeee"}]},
		{ "featureType": "poi", 						"elementType": "labels.text.fill",	"stylers": [{"color": "#757575"}]},
		{ "featureType": "poi.park",					"elementType": "geometry",			"stylers": [{"color": "#e5e5e5"}]},
		{ "featureType": "poi.park",					"elementType": "labels.text.fill",	"stylers": [{"color": "#9e9e9e"}]},
		{ "featureType": "road",						"elementType": "geometry",			"stylers": [{"color": "#ffffff"}]},
		{ "featureType": "road.arterial",				"elementType": "labels.text.fill",	"stylers": [{"color": "#757575"}]},
		{ "featureType": "road.highway",				"elementType": "geometry",			"stylers": [{"color": "#dadada"}]},
		{ "featureType": "road.highway",				"elementType": "labels.text.fill",	"stylers": [{"color": "#616161"}]},
		{ "featureType": "road.local",					"elementType": "labels.text.fill",	"stylers": [{"color": "#9e9e9e"}]},
		{ "featureType": "transit.line",				"elementType": "geometry",			"stylers": [{"color": "#e5e5e5"}]},
		{ "featureType": "transit.station",				"elementType": "geometry",			"stylers": [{"color": "#eeeeee"}]},
		{ "featureType": "water",						"elementType": "geometry",			"stylers": [{"color": "#c9c9c9"}]},
		{ "featureType": "water",						"elementType": "labels.text.fill",	"stylers": [{"color": "#9e9e9e"}]}
	];
	jQuery('#quellen').hide();
	var zoom = Math.round(window.innerWidth * 7 / 1200);
	map = new google.maps.Map(document.getElementById('map'), {	
		center: uluru, 
		styles: styles, 
		fullscreenControl: false, 
		mapTypeControl: false,
		zoomControl: false,
		streetViewControl: false
	});

	var bounds = new google.maps.LatLngBounds();
	bounds.extend(new google.maps.LatLng(47.345, 10.343));
	bounds.extend(new google.maps.LatLng(50.345, 14.343));
	map.fitBounds(bounds);
}

function add_marker(infowindow, geocoder, supplier) {
	geocoder.geocode( { 'address': supplier.address }, function(results, status) {
		if(status == google.maps.GeocoderStatus.OK)	{
		var marker = new google.maps.Marker({ map: map, position: results[0].geometry.location, icon: 'images/google_maps_location.svg' });			
			google.maps.event.addListener(marker, 'click', function() { infowindow.setContent(supplier.name); infowindow.open(map, this); });
		}	
	});
}

jQuery.ajax({ url: 'suppliers.json', type: 'GET', success: function(data) {
	initMap();
	if(data === null || data.suppliers.length == 0)	return;

	var html = '<thead><th></th><th></th><th style="width:30px"></th></thead>';
	var geocoder	= new google.maps.Geocoder();
	var infowindow	= new google.maps.InfoWindow();

	for (var i = 0; i < data.suppliers.length; i++) {
		var s = data.suppliers[i];
		html += '<tr>';
		html += '<td>' + s.name + '</td>';
		html += '<td>' + s.address + '</td>';
		html += '<td><a href="' + s.url + '"><img src="images/arrow.svg"></img></a></td>';
		html += '</tr>';

		add_marker(infowindow, geocoder, s);
	}

	jQuery('#suppliers_less').hide();
	if(data.suppliers.length <= 8) {
		jQuery('#suppliers_more').hide();
		jQuery('#suppliers_fader').hide();
		jQuery('#suppliers_cont').css('max-height', 'none');
	}

	suppliers.innerHTML = html;
	jQuery('#quellen').show();
}});

function showmenu(show)	{
	var body    = jQuery('body');
	var menubar	= jQuery('.rollup');
	var menu    = jQuery('.rolldown');
	var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	if(show)	{
		body.addClass('noscroll');
		menubar.hide();
		menu.animate({height: h}, 400, 'swing');
	}	else	{
		body.removeClass('noscroll');
		menu.animate({height: 40}, 400, 'swing', function() { 
			menubar.show();
			menu.css('height', '0');
		});
	}
}

function show_all_suppliers(show) {
	if(show) {
		jQuery('#suppliers_cont').css('max-height', 'none');
		jQuery('#suppliers_more').hide();
		jQuery('#suppliers_less').show();
		jQuery('#suppliers_fader').hide();
	}	else {
		var h = jQuery("#suppliers tbody > tr").height();
		jQuery('#suppliers_cont').css('max-height', (h * 6 + 20) + 'px');
		jQuery('#suppliers_more').show();
		jQuery('#suppliers_less').hide();
		jQuery('#suppliers_fader').show();
	}
}
