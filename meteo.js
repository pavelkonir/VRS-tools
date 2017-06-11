<script type="text/javascript">
if(VRS && VRS.globalDispatch && VRS.serverConfig) {
    VRS.globalDispatch.hook(VRS.globalEvent.bootstrapCreated, function(bootStrap) {
        if(bootStrap.hookMapInitialised) {
            bootStrap.hookMapInitialised(function(pageSettings) {
                if(pageSettings.mapPlugin && pageSettings.mapPlugin.getNativeType() === 'GoogleMaps') {

                  var map = pageSettings.mapPlugin.getNative();
                  var showMeteo = false;
                  var lastDatePart = "";
                  var meteoLayerTemp = null;

                  Date.prototype.utcSpecial = function() {
                    var mm = this.getUTCMonth() + 1;
                    var dd = this.getUTCDate();
                    var hh = this.getUTCHours();
                    var min = Math.floor(this.getUTCMinutes()/10)*10;

                    return [this.getFullYear(),
                      (mm>9 ? '' : '0') + mm,
                      (dd>9 ? '' : '0') + dd,
                      '.',
                      (hh>9 ? '' : '0') + hh,
                      (min>9 ? '' : '0') + min
                    ].join('');
                  };


                  var imageBounds = new google.maps.LatLngBounds(
                      new google.maps.LatLng(47.09,10.06),
                      new google.maps.LatLng(51.889,20.223));

                  var overlayOpts = {
                    opacity:0.6
                  }


                  var meteoLayer = function() {
                    if (showMeteo) {
                      fileNameDatePart = new Date().utcSpecial();

                      if (lastDatePart != fileNameDatePart) {
                        if (meteoLayerTemp != null) {
                          meteoLayerTemp.setMap(null);
                        }

                        meteoLayerOverlay = new google.maps.GroundOverlay(
                            'http://radar.bourky.cz/data/pacz2gmaps.z_max3d.'
                            + fileNameDatePart + '.0.png',
                            imageBounds, overlayOpts);
                        meteoLayerOverlay.setMap(map);

                        meteoLayerTemp = meteoLayerOverlay;
                      }
                    } else {
                      if (meteoLayerTemp != null) {
                        meteoLayerTemp.setMap(null);
                        meteoLayerTemp = null;
                      }
                    }
                  }

                  function MeteoControlRecivers(controlDiv, map) {

                    var meteoUIMenu = document.createElement('div');
                    meteoUIMenu.className = "vrsMenu";
                    meteoUIMenu.style.paddingRight = "10px";
                    controlDiv.appendChild(meteoUIMenu);


                    var meteoUI = document.createElement('div');
                    meteoUI.className = "mapButton";
                    meteoUIMenu.appendChild(meteoUI);

                    var meteoText = document.createElement('span');
                    meteoText.innerHTML = 'Meteo';
                    meteoUI.appendChild(meteoText);

                    // Setup the click event listeners
                    meteoUIMenu.addEventListener('click', function() {
                      showMeteo = !showMeteo;
                      meteoLayer();
                    });

                  }

                  // loadStations();
                  meteoLayer();


                  var meteoControlDiv = document.createElement('div');
                  var meteoControl = new MeteoControlRecivers(meteoControlDiv, map);

                  meteoControlDiv.index = 2;
                  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(meteoControlDiv);

                  window.setInterval(function () {
                    loadStations();
                  }, 60000 * 10);

                  window.setInterval(function () {
                    meteoLayer();
                  }, 60000 * 2);
                }
            });
        }
    });
}
</script>
