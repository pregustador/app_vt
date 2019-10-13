// ------------- Service Registration--------------------------------------------
//
if('serviceWorker' in navigator) {
    try {
        navigator.serviceWorker
            .register('sw.js')
            .then(function() { console.log("Service Worker Registered"); });
    } catch {
        console.log("Service Worker Not Registered");
    }
}
// see: https://www.stefanjudis.com/blog/three-things-to-consider-before-your-progressive-web-app-goes-standalone/
// var baseRegex = new RegExp( `${ window.location.hostname}` );
// if ( window.matchMedia( '(display-mode: standalone)' ).matches ) {
//   window.addEventListener( 'click', function() {
//     if (
//       event.target.tagName === 'A' &&
//       ! baseRegex.test( event.target.href )
//     ){
//       document.getElementById( 'loading-indicator' ).classList.add( 'is-active' );
//     }
//   } );
// }


// ------------- GLOBAL VARIABLES --------------------------------------------

// ###  Global Variables: Urls, Atributtions  ################################

// Use OpenStreetMap url and variable osmAttrib as link atributtion
var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  // only  request tiles from the 'a' subdomain, as that is cached I can use osmUrlOffinstead osmUrl
  osmUrlOff = 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
	osmAttrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  // osm = L.tileLayer(osmUrl, {maxZoom: 16,minZoom: 10, attribution: osmAttrib}); // initial layer
  osm = L.tileLayer(osmUrlOff, {maxZoom: 16,minZoom: 1, attribution: osmAttrib}); // initial layer

// Use OpenTopoMap url and variable otpAttrib as link atributtion
var otpUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
	otpAttrib = '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a> contributors',
	otp = L.tileLayer(otpUrl, {maxZoom: 16,minZoom: 1, attribution: otpAttrib}); // initial layer


// ### Global Variables: Bounds and Map Variable   ###########################

// Bounds Layers: first southwest and after northeast.
var bounds = new L.LatLngBounds(new L.LatLng(-23.4482,-46.2100), new L.LatLng(-23.1663,-45.7500));

// Map Variable ...
// Obs.: measure control is for draw something and measuruments I think ...
var map = new L.Map('map', {
    measureControl: true,
  	center: bounds.getCenter(),
  	zoom: 10,
  	layers: [osm],
  	// maxBounds: bounds ... [osm]
});


// ###  Global Variables: Regular Layers in Control Map ######################

// Adding bounds
var latlngs = L.rectangle(bounds).getLatLngs();
var lim =  L.polyline(latlngs[0].concat(latlngs[0][0]));

var marker_list_dem = [L.marker([-23.305363,-45.975017]).bindPopup('This is Jacareí, SP.')];
var group_marker_list_dem = L.featureGroup(marker_list_dem)


// ###  Global Variables: Control Map, Base Map and Overlay ##################

var baseMaps = {
		"openTopoMap": otp,
    "openStreetMap": osm
};

var overlayMaps = {
    "bounds": lim,
		"marker_list": group_marker_list_dem.addTo(map)
};

var controlMap = L.control.layers(baseMaps,overlayMaps);


// ###  Global Variables: variables for location and plotting functions... ####

var targetPoint = turf.point([-45.93,-23.23]);
var myPoint = L.geoJSON(targetPoint)
var tempTin=false;
var tin=false;
var points=false;
var lim_pol=false;
var city_pol=false;
var url_city_pol = false;
var url_city_pt = false;
var city_name = false;
var nearest=false;
var nearest_turf=false;
var buffered=false;
var ptsWithin=false;
var geojsonMarkerOptions=false;
var ptsCollection = false;
var coords_x = []; //define an array to store the lng coordinate
var coords_y = []; //define an array to store the lat coordinate
var coords_z = []; //define an array to store elev coordinate
var distance = [];
var temp_distance = 0;
var total_distance = [];
var str_temp_distance = '';
var str_count_distance = '';
var pos;
var positions = {};
var positions_teste = {};
var coordinates = [];
var coordinates_z = [];
var coordinates_text = [];
var coordsCollection = [];
var nav_coordinates_line = false;
var nav_coordinates_point = false;
var tempLF;
var temp;
var key_navigation = false;
var key_control = false;
var count;


// ###  Global Variables: variables for DOM functions... ####

var close_menu = false;
var close_map = true;
var close_info = false;
var close_path = false;
var close_dem = false;


// ###  Global Variables: variables for leaflet custom buttons (first way to do it)... ####

var my_location = $( "<div id='my_location'><strong>Localização</strong></div>" );
var nav_location = $("<div id='nav_location'><strong>Local a cada 30s</strong></div>");
var loader = $( "<div id='loader'><div>" );
var change_data = $( "<div id='change_data'><strong>Carregar dados</strong></div>" );

var change_data_select =
		$("<div id='city' class='div_content'>"+
			"<div id='city-top' class='div_content-top'>"+
				"<p class='paragraph_right'> Cidade &nbsp &nbsp</p></div>"+
				"<div id='city-content' class='div_content-content'>"+
					"<p>Escolha a cidade: </p>" +
					"<div id='change_data_select'>" +
					"<select>"+
						"<option name='cities' value='jac'>Jacareí</option>"+
						"<option name='cities' value='sjc_sjc'>São José dos Campos</option>"+
						"<option name='cities' value='sjc_em'>São José dos Campos E. Melo</option>"+
						"<option name='cities' value='stb'>Santa Branca</option>"+
						"<input type='submit' onclick='chooseData()' value='carregar' />"+
					"</select>"+
				"</div>"+
			"</div>"+
		 "</div>");

var div_load_top = $( "<div class='div_load_top'></div>" );
var div_load = $( "<div class='div_load'></div>" );
var div_out_top = $( "<div class='div_out_top'></div>" );
var div_out = $( "<div class='div_out'></div>" );
var div_overlay = $( "<div class='div_overlay'></div>" );
var loader_layer = $( "<div id='loader_layer'></div>" );

var changeData = L.Control.extend({
  options: {
    position: 'bottomright'
    //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
  },
  onAdd: function (map) {
		  // for var container...
		  // I can put div, see: http://www.coffeegnome.net/control-button-leaflet/
			// I can put input and buttom, see: https://stackoverflow.com/questions/31924890/leaflet-js-custom-control-button-add-text-hover
	    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
			// I can put color or image as background
			// container.style.backgroundColor = 'white';

	    container.style.background = 'url(../static/css/images/baseline_cached_black_36dp.png) no-repeat';
			container.style.width = '36px';
	    container.style.height = '36px';
			container.style.borderColor = "rgba(180, 180, 180, 0.9)";
			container.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
	    container.onclick = function(){
        if (containerLoc) {
          containerLoc.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
          containerLoc.style.borderColor = "rgba(180, 180, 180, 0.9)";
          removeAllLayers();
          refreshLocVariables();
        };
        if (containerNav) {
          containerNav.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
          containerNav.style.borderColor = "rgba(180, 180, 180, 0.9)";
          removeAllLayers();
          refreshNavVariables();
        };
				$( "body" ).append( change_data_select );
				$("#city, #city-top, .div_load_top, .div_load, .div_out, .div_out_top" ).fadeIn();
				$("#city").css({"background-color":"rgba(255, 255, 255, 0.9)","border":"1px solid rgba(65, 89, 66, 0.5)"});
				$("#city-top").css({"background-color":"rgb(65, 89, 66)"});
	    }
			container.onmouseover = function(){
			  container.style.backgroundColor = '#cfd2d6';
				container.style.cursor = 'pointer';
				$( "body" ).append( change_data );
			}
			container.onmouseout = function(){
			  container.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
				$(change_data).remove();
			}
	    return container;
	  }
});

var containerLoc = false;
var keyLocLocation = false;

var myLocation = L.Control.extend({
  options: {
    position: 'bottomright'
  },
  onAdd: function (map) {
	    containerLoc = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
	    containerLoc.style.background = 'url(../static/css/images/baseline_my_location_black_36dp.png) no-repeat';
			containerLoc.style.width = '36px';
	    containerLoc.style.height = '36px';
			containerLoc.style.borderColor = "rgba(180, 180, 180, 0.9)";
			containerLoc.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
	    containerLoc.onclick = function(){
				removeAllLayers();
				refreshNavVariables();
				if(keyLocLocation == false){
					refreshLocVariables();
					myLocFunc(keyLocLocation);
					// imageBackgroundNav = 'url(../static/css/images/baseline_replay_30_black_36dp.png) no-repeat';
					// containerNav.style.background = imageBackgroundNav;
					containerLoc.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
					containerLoc.style.borderColor = "red";
					containerNav.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
					containerNav.style.borderColor = "rgba(180, 180, 180, 0.9)";
					keyLocLocation = true;
				} else {
					refreshLocVariables();
					containerLoc.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
					containerLoc.style.borderColor = "rgba(180, 180, 180, 0.9)";
				}
	    }
			containerLoc.onmouseover = function(){
			  containerLoc.style.backgroundColor = '#cfd2d6';
				containerLoc.style.cursor = 'pointer';
				$( "body" ).append( my_location );
			}
			containerLoc.onmouseout = function(){
			  containerLoc.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
				$( my_location ).remove();
			}
	    return containerLoc;
	  }
});

var imageBackgroundNav = 'url(../static/css/images/baseline_replay_30_black_36dp.png) no-repeat';
var keyNavLocation = false;
var nav_interval = false;
var containerNav = false;

var navigation = L.Control.extend({
  options: { position: 'bottomright'},
  onAdd: function (map) {
	    containerNav = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
	    containerNav.style.background = imageBackgroundNav;
			containerNav.style.width = '36px';
	    containerNav.style.height = '36px';
			containerNav.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
			containerNav.style.borderColor = "rgba(180, 180, 180, 0.9)";
			containerNav.onclick = function(){
	      console.log('buttonClicked');
				removeAllLayers();
	      refreshLocVariables();
				if (keyNavLocation == false) {
					refreshNavVariables();
					myNavFunc(keyNavLocation);
					// imageBackgroundNav = 'url(../static/css/images/baseline_replay_30_black_36dp.png) no-repeat';
					// containerNav.style.background = imageBackgroundNav;
					containerNav.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
					containerNav.style.borderColor = "red";
					containerLoc.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
					containerLoc.style.borderColor = "rgba(180, 180, 180, 0.9)";
					keyNavLocation = true;
				} else {
					refreshNavVariables();
					// imageBackgroundNav = 'url(../static/css/images/baseline_data_usage_black_36dp.png) no-repeat';
					// containerNav.style.background = imageBackgroundNav;
					containerNav.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
					containerNav.style.borderColor = "rgba(180, 180, 180, 0.9)";
				}
			}
			containerNav.onmouseover = function(){
			  containerNav.style.backgroundColor = '#cfd2d6';
				containerNav.style.cursor = 'pointer';
				$( "body" ).append( nav_location );
			}
			containerNav.onmouseout = function(){
			  containerNav.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
				$( nav_location ).remove();
			}
	    return containerNav;
	  }
});

navigation = new navigation();

// second way to make custom buttoms with L.easyButtom library
// see: https://github.com/cliffcloud/Leaflet.EasyButton
// see: http://danielmontague.com/projects/easyButton.js/v1/examples/
// see: http://cliffcloud.github.io/Leaflet.EasyButton/

var easy_button = L.easyButton('<img style="width: 16px; height: 16px;" src="../static/css/images/baseline_code_black_24dp.png">',
              function () {
								window.location='https://github.com/pregustador/app_vt';
							}, 'Code');


// -------------  ADD CONTROL MAP / ADD CUSTOM BUTTOMS TO MAP ------------------


controlMap.addTo(map);

// first way to make custom buttons for leaflet (see variables in global variables )
// see: http://www.coffeegnome.net/control-button-leaflet/
// the code for create these customs buttons is in variables

map.addControl(new changeData());
// I will add the other function with user interaction
// map.addControl( easy_button.addTo(map));

// function to add control with user interaction
function addControlFunc() {
	setTimeout(function() {
		// adding map controls
		map.addControl(new myLocation());
		map.addControl(navigation);
		easy_button.addTo(map);
		// change key_control to not add other times the same controls
		key_control = true;
	}, 500);
	removeLoader();
}


// -------------  DOM FUNCTIONS   ----------------------------------------


$( "body" ).append( div_overlay );
$( "body" ).append( div_out_top );
$( "body" ).append( div_out );
$( "body" ).append( div_load_top );
$( "body" ).append( div_load );

$(".div_overlay, .div_out_top, .div_out, .div_load_top, .div_load").hide();
$('.div_sidebar, .div_sidebar-top, .div_sidebar-group').hide();
$("#path-top, #dem-top, #info, #dem, #path").hide();

$(".div_base, #map").fadeIn();

$('.div_menu-button, .div_overlay').click (function() {
	$('.div_overlay').toggle();
	$('.div_sidebar, .div_sidebar-top, .div_sidebar-group').animate({width: 'toggle'});
	if (close_menu == false) {
		close_menu = true;
		$('.div_menu-button').css("background","url(../static/css/images/baseline_close_black_48dp.png) no-repeat");
	} else {
		close_menu = false;
		$('.div_menu-button').css("background","url(../static/css/images/baseline_menu_black_48dp.png) no-repeat");
	}
});

$( ".div_map" ).on( "click", function() {
		if (close_map == false) {
			close_map = true;
			$('.div_navbar').css({"border-bottom":"none"});
			$("#map").fadeIn();
		} else {
			close_map = false;
			$("#map").fadeOut();
			$('.div_navbar').css({"border-bottom":"2px solid black"});
		}
});

$( ".div_path" ).on( "click", function() {
	if (close_path == false) {
		close_path = true;
		close_dem = false;
		close_info = false;
		$("#dem-top, #dem, #info-top, #info, .div_out" ).fadeOut();
		$("#path-top, #path, .div_out").fadeIn();
		$("#path").css({"background-color":"rgba(255, 255, 255, 0.9)","border":"1px solid rgba(65, 89, 66, 0.5)"});
		$("#path-top").css({"background-color":"rgb(65, 89, 66)"});

		// plotly trick render
		$("#path-content").fadeIn(1500);
		setTimeout(function(){
			setTimeout(function(){
				$("#path-content").css({top: 119});
			},150);
			setTimeout(function(){
				$("#path-content").css({top: 120});
			},800);
		},1000);

		if (document.querySelector('[data-title="Reset axes"]') != null) {
				document.querySelector('[data-title="Reset axes"]').click();
		}

	} else {
		close_path = false;
		$("#path-content").fadeOut();
		$("#path, #path-top, .div_out").fadeOut();
	}
});

$( ".div_dem" ).on( "click", function() {
	if (close_dem == false) {
		close_dem = true;
		close_path = false;
		close_info = false;
		$("#path-top, #path, #info-top, #info, .div_out" ).fadeOut();
		$("#dem-top, #dem, .div_out").fadeIn();
		$("#dem").css({"background-color":"rgba(255, 255, 255, 0.9)","border":"1px solid rgba(65, 89, 66, 0.5)"});
		$("#dem-top").css({"background-color":"rgb(65, 89, 66)"});
	} else {
		close_dem = false;
		$("#dem, #dem-top, .div_out").fadeOut();
	}
});

$( ".div_info" ).on( "click", function() {
	if (close_info == false) {
		close_info = true;
		close_dem = false;
		close_path = false;
		$("#path-top, #path, #dem-top, #dem, .div_out" ).fadeOut();
		$("#info, #info-top, .div_out").fadeIn();
		$("#info").css({"background-color":"rgba(255, 255, 255, 0.9)","border":"1px solid rgba(65, 89, 66, 0.5)"});
		$("#info-top").css({"background-color":"rgb(65, 89, 66)"});
	} else {
		close_info = false;
		$("#info, #info-top, .div_out").fadeOut();
	}
});

$( ".div_out" ).on( "click", function() {
	close_info = false;
	close_dem = false;
	close_path = false;
	$(".div_out, .div_out_top, #path-top, #dem-top, #info-top, #info, #dem, #path").fadeOut();
	removeLoader();
});

$( ".div_out_top" ).on( "click", function() {
	$(".div_out, .div_out_top").fadeOut();
	removeLoader();
});

// -------------  LOAD DATA FUNCTIONS   ---------------------------------------

// check choose data city to load
function chooseData() {
	city = $('option[name=cities]:checked').val()
	$( change_data_select ).fadeOut(300, function() { $(this).remove(); });
	$('body').append( loader );
	$('#loader').fadeIn();
	grabDataCity(city);
}

// choose data city to load
function grabDataCity(city) {

	$( "body" ).append( loader_layer );

	if (city=='jac') {
		url_city_pol = "/jac_district_pol.json";
		url_city_pt = "/jac_district_pt.json";
		city_name = "Jacareí"
	}
	if (city=='sjc_sjc') {
		url_city_pol = "/sjc_sjc_district_pol.json";
		url_city_pt = "/sjc_sjc_district_pt.json";
		city_name = "São José dos Campos"
	}
  if (city=='sjc_em') {
		url_city_pol = "/sjc_em_district_pol.json";
		url_city_pt = "/sjc_em_district_pt.json";
		city_name = "São José dos Campos E. Melo"
	}
	if (city=='stb') {
		url_city_pol = "/stabranca_district_pol.json";
		url_city_pt = "/stabranca_district_pt.json";
		city_name = "Santa Branca"
	}

	$.get(url_city_pol, function(data, status) {
		lim_pol = JSON.parse(JSON.stringify(data)); // data
	}).then(function(result) {
		console.log('city polygon OK',city_name);
		removeSingleLayer(city_pol);
		city_pol = new L.GeoJSON(lim_pol);
		controlMap.addOverlay(city_pol,city_name);
	}).catch(function(xhr) { alert(xhr);});

	$.get(url_city_pt, function(data, status) {
		points = JSON.parse(JSON.stringify(data)); // data
	}).then(function(result) {
		console.log('city points OK',city_name);
		if (key_control == false) addControlFunc();
		else removeLoader();
	}).catch(function(xhr) {
		alert(xhr);
		removeLoader();
	});
	setTimeout(function() {
		removeLoader();
	}, 30000);

}

function removeSingleLayer(layer){
	if (layer) controlMap.removeLayer(layer);
	if (map.hasLayer(layer)) map.removeLayer(layer);
}

function removeLoader() {
	$( loader_layer ).remove();
	$( change_data_select ).fadeOut(300, function() { $(this).remove(); });
	$( loader ).fadeOut(700, function() { $(this).remove(); });
	$( div_out_top ).fadeOut(500);
	$( div_out ).fadeOut(500);
	$( div_load_top ).fadeOut(500);
	$( div_load ).fadeOut(500);
}

// -------------  LOCATION FUNCTIONS   ----------------------------------------

// xMin,yMin -46.175, -23.4411 :xMax, yMax -45.7756, -23.1389

// refresh location  variables
function refreshLocVariables(){
	targetPoint = false;
	tempTin=false;
	tin=false;
	nearest=false;
	nearest_turf=false;
	buffered=false;
	ptsWithin=false;
	myPoint=false;
	coords_x = []; //define an array to store the lng coordinate
	coords_y = []; //define an array to store the lat coordinate
	coords_z = []; //define an array to store elev coordinate
	keyLocLocation = false;
}

// refresh naviagation variables
function refreshNavVariables(){
	if (nav_interval) clearInterval(nav_interval);
	nav_interval = false;
	nav_coordinates_line = false;
	nav_coordinates_point = false;
	distance = [];
	coordinates = [];
	coordinates_z = [];
	coordinates_text = [];
	coordsCollection = [];
	count = 0;
	temp_distance = 0;
	total_distance = [];
	keyNavLocation = false;
}

// calling getlocation for location one time
function myLocFunc(keyLocLocation) {
	key_navigation = false;
  if (keyLocLocation == false) setTimeout(function() { getLocation(); }, 1500);
}

// calling getlocation for navigation
function myNavFunc(keyNavLocation) {
	key_navigation = true;
	if (keyNavLocation == false) {
		nav_interval = setInterval(function() { getLocation(); },15000);
	}
}

//getlocation
function getLocation() {
	// alert("oi")
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

//showposition
function showPosition(position) {
	try {
		positions = {	lat: position.coords.latitude, lng: position.coords.longitude };
		if (typeof(positions['lng']) !== "undefined" && typeof(positions['lat']) !== "undefined") {
			targetPoint = turf.point([positions['lng'],positions['lat']]);
			if (turf.booleanPointInPolygon(targetPoint,turf.polygon(lim_pol["features"][0]["geometry"]["coordinates"])) == false) {
					positions = {	lat: -23.2952438, lng: -45.9667739 };
			}
			// coordinates.push([positions['lng'],positions['lat']]);
		}

	} catch (e) {
		alert(e);
		// alert("oi");

	} finally {
		// positions = {	lat: -23.2952438, lng: -45.9667739 };
		// if (key_navigation == true) setTimeout(function() { test_data(positions); }, 500);
		if (key_navigation == true) navFunc(positions);
		else setTimeout(function() { locFunc(positions); }, 500);
	}
}

// -------------  LAYERS INTERATE FUNCTIONS   ---------------------------------

// remove all layer function
function removeAllLayers() {
	if (tin) controlMap.removeLayer(tin);
	if (map.hasLayer(tin)) map.removeLayer(tin);
	if (nearest) controlMap.removeLayer(nearest);
	if (map.hasLayer(nearest)) map.removeLayer(nearest);
	if (ptsWithin) controlMap.removeLayer(ptsWithin);
	if (map.hasLayer(ptsWithin)) map.removeLayer(ptsWithin);
	if (myPoint) controlMap.removeLayer(myPoint);
	if (map.hasLayer(myPoint)) map.removeLayer(myPoint);
	if (nav_coordinates_line) controlMap.removeLayer(nav_coordinates_line);
	if (map.hasLayer(nav_coordinates_line)) map.removeLayer(nav_coordinates_line);
	if (nav_coordinates_point) controlMap.removeLayer(nav_coordinates_point);
	if (map.hasLayer(nav_coordinates_point)) map.removeLayer(nav_coordinates_point);
}

// locFunc function used to read json, put information, retrieve information
function locFunc(positions){
	targetPoint = turf.point([positions['lng'],positions['lat']]);
	// if (navigator.online){
  //   //manipulate the DOM
	// 	map.setView([positions['lat'],positions['lng']], 14);
  // }
	map.setView([positions['lat'],positions['lng']], 14);

	nearest_turf = turf.nearestPoint(targetPoint, points);
	var from = targetPoint;
	var to = nearest_turf;
	tempLF = turf.distance(from, to);

	// I'm using 'new L.GeoJSON' because 'points' comes from an external geojson
	// see: https://gis.stackexchange.com/questions/68489/loading-external-geojson-file-into-leaflet-map
	// But exist one exemple here: "https://leafletjs.com/examples/geojson/ "using just L.geoJSON
	nearest = new L.GeoJSON(nearest_turf,{
		onEachFeature: onEachFeatureNearest
	});

	targetPoint.properties = {["mos_stbran"]:nearest_turf.properties["mos_stbran"]};

	myPoint = new L.geoJSON(targetPoint,{
		onEachFeature: onEachFeatureMP
	});

	buffered = turf.buffer(targetPoint, 0.3, {units: 'kilometers'});
	ptsWithin = turf.pointsWithinPolygon(points, buffered);
	ptsWithin.features = ptsWithin.features.concat(targetPoint);
	// ptsWithin = turf.pointsWithinPolygon(points, buffered);
	tempTin = turf.tin(ptsWithin, 'z');
	tin = new L.GeoJSON(tempTin);
	geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
	};
	ptsWithin = new L.GeoJSON(ptsWithin, {
  	onEachFeature: onEachFeaturePW,
		pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, geojsonMarkerOptions);
		}
	});
	pos = {
		"lng": coords_x,
		"lat": coords_y,
		"elev": coords_z
	}

	// Adding Overlay in control map
	setTimeout(function() {
		// if (navigator.online){
		// 	map.setView([positions['lat'],positions['lng']], 16);
		// }
		map.setView([positions['lat'],positions['lng']], 16);
		controlMap.addOverlay(ptsWithin.addTo(map),"pontos de altitude");
	},1500);
	setTimeout(function() {
			controlMap.addOverlay(tin.addTo(map),"rede triangular irregular(TIN)");
			tin.bindPopup("<html> Rede Triangular Irregular (TIN) " +
			"<br> criada a partir dos pontos de " +
			"<br> altitude mostrados aqui </html>").openPopup();
	},4000);
	setTimeout(function() {
			controlMap.addOverlay(nearest.addTo(map),"ponto de altitude próximo");
			last_feature(nearest).openPopup();
      dem(pos);
	},9000);


	setTimeout(function() {
			controlMap.addOverlay(myPoint.addTo(map),"minha localização");
			last_feature(myPoint).openPopup();
	},15000);

}

// onEachFeatureMP used by locFunc function
function onEachFeatureMP(feature, layer) {
	var alt;
	if (feature.properties["mos_stbran"] < 1000) alt = feature.properties["mos_stbran"].toPrecision(4);
	else alt = feature.properties["mos_stbran"].toPrecision(5);

	layer.bindPopup('<html>' + 'Minha localização (lat, lng): ' +
		positions['lat'].toPrecision(6) + "," + positions['lng'].toPrecision(6) +
		'<br> Ponto de altitude mais próximo está a ' +
		(tempLF*1000).toPrecision(3) + 'm' +
		'<br> Altitude coletada é de ' + alt + ' metros </html>');
}

// onEachFeatureNearest used by locFunc function
function onEachFeatureNearest(feature, layer) {
	if (feature.properties["mos_stbran"] < 1000) {
		layer.bindPopup('<html> Este é o ponto de altitude <br> mais próximo com ' +
		(feature.properties["mos_stbran"]).toPrecision(4) + ' m </html>')
	}	else {
		layer.bindPopup('<html> Este é o ponto de altitude <br> mais próximo com' +
		(feature.properties["mos_stbran"]).toPrecision(5) + ' m </html>')
	}
}

// onEachFeaturePW used by locFunc function
function onEachFeaturePW(feature, layer) {
  coords_x.push(parseFloat(feature.geometry.coordinates[0].toPrecision(6)));
  coords_y.push(parseFloat(feature.geometry.coordinates[1].toPrecision(6)));
	coords_z.push(feature.properties["mos_stbran"]);
	if (feature.properties["mos_stbran"] < 1000) {
		layer.bindPopup('Ponto de altitude: ' + (feature.properties["mos_stbran"]).toPrecision(4) + ' m')
	}	else {
		layer.bindPopup('Ponto de altitude: ' + (feature.properties["mos_stbran"]).toPrecision(5) + ' m')
	}
}

function test_data(positions){
	positions_teste = {	lat: -23.285783, lng: -45.983291 };
	coordinates.push([positions_teste['lng'],positions_teste['lat']]);
	targetPoint = turf.point([positions_teste['lng'],positions_teste['lat']]);
	nearest_turf = turf.nearestPoint(targetPoint, points);
	coordinates_z.push(nearest_turf.properties["mos_stbran"]);
	distance.push(0);
	coordinates_text.push("lng: " + String(positions_teste['lng'].toPrecision(6)) + "; lat: " + String(positions_teste['lat'].toPrecision(6)) + "; elev: " + String(parseFloat(nearest_turf.properties["mos_stbran"]).toPrecision(4)));

	positions_teste = {	lat: -23.297545, lng: -45.969343 };
	coordinates.push([positions_teste['lng'],positions_teste['lat']]);
	targetPoint = turf.point([positions_teste['lng'],positions_teste['lat']]);
	nearest_turf = turf.nearestPoint(targetPoint, points);
	coordinates_z.push(nearest_turf.properties["mos_stbran"]);
	coordinates_text.push("lng: " + String(positions_teste['lng'].toPrecision(6)) + "; lat: " + String(positions_teste['lat'].toPrecision(6)) + "; elev: " + String(parseFloat(nearest_turf.properties["mos_stbran"]).toPrecision(4)));
	navFunc(positions);
}

// navFunc function
function navFunc(positions){
	// alert(positions,coordinates);

	removeAllLayers();
	nav_coordinates_line = false;
	nav_coordinates_point = false;
	distance = [];
	total_distance = [];
	coordsCollection = [];
	count = 0;
	temp_distance = 0;
	total_distance = [];
	distance.push(0);

	if (coordinates.length >= 1) {
		removeAllLayers();
		targetPoint = turf.point([positions['lng'],positions['lat']]);
		// map.setView([positions['lat'],positions['lng']], 13);
		nearest_turf = turf.nearestPoint(targetPoint, points);
		targetPoint.properties = {["mos_stbran"]:nearest_turf.properties["mos_stbran"]};
		coordinates.push([positions['lng'],positions['lat']]);
		coordinates_z.push(nearest_turf.properties["mos_stbran"]);
		coordinates_text.push("lng: " + String(positions['lng'].toPrecision(6)) + "; lat: " + String(positions['lat'].toPrecision(6)) + "; elev: " + String(parseFloat(nearest_turf.properties["mos_stbran"]).toPrecision(4)));

		for (var i = 0; i < coordinates.length-1; i++) {
			var from = turf.point(coordinates[i]);
			var to = turf.point(coordinates[i+1]);
			temp = turf.distance(from, to);
			distance.push(parseFloat(temp));
		}

		for (var i = 0; i < coordinates.length; i++) {
			coordsCollection.push(turf.point(coordinates[i]))
		}

		nav_coordinates_line = turf.multiLineString([coordinates]);
		nav_coordinates_line = new L.GeoJSON(nav_coordinates_line);
		// I think I have to change to fetaure collection to put diferent binds...because multpoint is one feture only
		// nav_coordinates_point = turf.multiPoint(coordinates);
		nav_coordinates_point = turf.featureCollection(coordsCollection);
		// nav_coordinates_point = new L.GeoJSON(nav_coordinates_point);

		nav_coordinates_point = new L.GeoJSON(nav_coordinates_point, {
			onEachFeature: onEachFeatureBindMarker
		});

		// Adding Overlay in control map
		controlMap.addOverlay(nav_coordinates_line.addTo(map),"linhas entre coordenadas");
		controlMap.addOverlay(nav_coordinates_point.addTo(map),"pontos de localização");

		last_feature(nav_coordinates_point).openPopup();

		path();
		console.log(total_distance);

 } else {
		targetPoint = turf.point([positions['lng'],positions['lat']]);
		nearest_turf = turf.nearestPoint(targetPoint, points);
		targetPoint.properties = {["mos_stbran"]:nearest_turf.properties["mos_stbran"]};
		myPoint = L.geoJSON(targetPoint);
		coordinates.push([positions['lng'],positions['lat']]);
		coordinates_z.push(nearest_turf.properties["mos_stbran"]);
		coordinates_text.push("lng: " + String(positions['lng'].toPrecision(6)) + "; lat: " + String(positions['lat'].toPrecision(6)) + "; elev: " + String(parseFloat(nearest_turf.properties["mos_stbran"]).toPrecision(4)));
		controlMap.addOverlay(myPoint,"minha localização");
	}
}

// use for test_data
function onEachFeatureBindMarker(feature, layer) {
	console.log("oi : " + count)
	str_temp_distance = '';
	str_count_distance = '';

	temp_distance = temp_distance + distance[count];
	total_distance.push(temp_distance);

	// to.Precision already transform value to string
	if (temp_distance < 1) str_temp_distance = (temp_distance*1000).toPrecision(3) + " m";
	else if (temp_distance < 10) str_temp_distance = temp_distance.toPrecision(2) + " km";
	else if (temp_distance < 100) str_temp_distance = temp_distance.toPrecision(3) + " km";
	else if (temp_distance < 1000) str_temp_distance = temp_distance.toPrecision(4) + " km";
	else str_temp_distance = temp_distance.toPrecision(5);

	if (distance[count] < 1) str_count_distance = (distance[count]*1000).toPrecision(3) + " m";
	else if (distance[count] < 10) str_count_distance = distance[count].toPrecision(2) + " km";
	else if (distance[count] < 100) str_count_distance = distance[count].toPrecision(3) + " km";
	else if (distance[count] < 1000) str_count_distance = distance[count].toPrecision(4) + " km";
	else str_count_distance = distance[count].toPrecision(5);

	layer.bindPopup("<html>" + "Distância entre pontos: " + str_count_distance +
		"<br> Distância total: " + str_temp_distance + "<br> Coords(lat,lng) : " +
		coordinates[count][1].toPrecision(6) + "," + coordinates[count][0].toPrecision(6) + "</html>");
	count = count + 1;
}


function last_feature(layer){
	var feat;
	layer.eachLayer(function(feature){
		feat = feature; //open popup for matching ID
	});
	return feat;
}


// -------------- PLOTTING MATH FUNCTIONS ------------------------------------------


function path() {
	// close_path = true;
	setTimeout(function() { path_react(); }, 721);
}

// see: https://codepen.io/rsreusser/pen/qPgwwJ/
const Plot = createPlotlyComponent(Plotly);
function path_react() {
	ReactDOM.render(
	  React.createElement(Plot, {
	    data: [
	      {
					type: 'scatter',
					mode: 'markers+lines',
					x: total_distance,
					y: coordinates_z,
					text: coordinates_text,
					hoverinfo: 'text',
					opacity: 1,
					color: 'blue',
					line: { width: 1.5 }
	      }
	    ],
	    layout: {
				title:"Altitude(m) X Distância(km)",
				font: {size: 11},
				hovermode:'closest',
				xaxis: {
					title: ' Distância em km '
				},
	    },
	    useResizeHandler: true,
	    style: {width: "100%", height: "100%"}
	  }),
	  document.getElementById('path-content')
	);
	if (document.querySelector('[data-title="Reset axes"]') != null) {
			document.querySelector('[data-title="Reset axes"]').click();
	}
	// plotly trick render - ".svg-container" is plotly class ...
	// $(".js-plotly-plot").css({width: '99%'});
	// $(".js-plotly-plot").css({height: '99%'});
	if (close_path==false) $('#path-content').fadeOut();
}


// Plotting Path 3d - Send to server and get back image through AJAX
function dem(pos){
	$.ajax({
		url: "/output_dem",
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(pos),
		success: function(data){
			// alert(JSON.stringify(data['html']));
			// alert(data);
			if (data != 'Not work') {
				$('#dem-content').empty();
				$('#dem-content').append('<center><img class="img_dem" alt="100" src="data:image/gif;base64,' + data['html'] + '" /></center>');
				alert('Sucesso, vizualize a imagem na aba TIN 3D!');
			} else {
				alert("Erro, possíveis problemas com a conexão ou servidor: " + String(data));
				removeAllLayers();
			}
		},
		error: function(xhr) {
			alert('error');
		}
	});
}
// canbe 'click' and others
// map.on('mousemove', function(e) {
//     console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
// });
