<script type="text/javascript">
if(VRS && VRS.globalDispatch && VRS.serverConfig) {
    VRS.globalDispatch.hook(VRS.globalEvent.bootstrapCreated, function(bootStrap) {
        if(bootStrap.hookMapInitialised) {
            bootStrap.hookMapInitialised(function(pageSettings) {
                if(pageSettings.mapPlugin && pageSettings.mapPlugin.getNativeType() === 'GoogleMaps') {
                  var map = pageSettings.mapPlugin.getNative();
                  var markers = [];

                  var loadStations = function() {
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

                        response.data.forEach(function(entry) {

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
                  }

                  loadStations();

                  window.setInterval(function () {
                    loadStations();
                  }, 5000);
                }
            });
        }
    });
}
</script>
