var gmap;
var geocoder = new google.maps.Geocoder();
if (google) {
  google.load('visualization', '1.0', {'packages':['corechart']});
  
  google.maps.visualRefresh = true;
  google.maps.event.addDomListener(window, 'load', function(){
    var mapOptions = {
      center: new google.maps.LatLng(40.40, -3.68),
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP,

      panControl: false,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      overviewMapControl: false,

      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL
      }
    };

    gmap = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  });
}