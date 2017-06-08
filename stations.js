<script type="text/javascript">
if(VRS && VRS.globalDispatch && VRS.serverConfig) {
    VRS.globalDispatch.hook(VRS.globalEvent.bootstrapCreated, function(bootStrap) {
        if(bootStrap.hookMapInitialised) {
            bootStrap.hookMapInitialised(function(pageSettings) {
                if(pageSettings.mapPlugin && pageSettings.mapPlugin.getNativeType() === 'GoogleMaps') {

                  var map = pageSettings.mapPlugin.getNative();
                  var markers = [];
                  var showStations = true;

                  function CzadsbControlRecivers(controlDiv, map) {

                    var receiversUIMenu = document.createElement('div');
                    receiversUIMenu.className = "vrsMenu";
                    receiversUIMenu.style.paddingRight = "10px";
                    controlDiv.appendChild(receiversUIMenu);


                    var receiversUI = document.createElement('div');
                    receiversUI.className = "mapButton";
                    receiversUIMenu.appendChild(receiversUI);

                    var receiverText = document.createElement('span');
                    receiverText.innerHTML = 'Stations';
                    receiversUI.appendChild(receiverText);

                    // Setup the click event listeners
                    receiversUIMenu.addEventListener('click', function() {
                      showStations = !showStations;
                      loadStations();
                    });

                  }

                  var loadStations = function() {
                    if (showStations) {
                      $.ajax({
                        type: "GET",
                        url: "stations.json",
                        data: '{}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {

                          for (var i = 0; i < markers.length; i++) {
                            markers[i].setMap(null);
                          }

                          markers = [];

                          response.data.forEach(function (entry) {

                            marker = new google.maps.Marker({
                              map: map,
                              position: entry.position,
                              icon: entry.icon,
                              title: entry.title
                            });

                            markers.push(marker);
                          })

                        },
                        failure: function (response) {
                          console.error(response);
                        },
                        error: function (response) {
                          console.error(response);
                        }
                      })
                    } else {
                      for (var i = 0; i < markers.length; i++) {
                        markers[i].setMap(null);
                      }

                      markers = [];
                    }
                  }

                  loadStations();

                  var receiversControlDiv = document.createElement('div');
                  var centerControl = new CzadsbControlRecivers(receiversControlDiv, map);

                  receiversControlDiv.index = 1;
                  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(receiversControlDiv);

                  window.setInterval(function () {
                    loadStations();
                  }, 60000 * 10);
                }
            });
        }
    });
}
</script>
