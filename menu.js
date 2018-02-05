<script type="text/javascript">
if (VRS && VRS.globalDispatch && VRS.serverConfig) {
  VRS.globalDispatch.hook(VRS.globalEvent.bootstrapCreated,
      function (bootStrap) {
        var map = null;
        var markers = [];
        var hospitals = [];
        var hems = [];
        var showStations = true;
        var showHospitals = false;
        var showHems = false;
        var showAirports = false;

        var loadStations = function () {
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

                  if (entry.customHtml != null) {
                    var content = entry.customHtml;

                    var infowindow = new google.maps.InfoWindow()

                    google.maps.event.addListener(marker, 'click',
                        (function (marker, content, infowindow) {
                          return function () {
                            infowindow.setContent(content);
                            infowindow.open(map, marker);
                          };
                        })(marker, content, infowindow));
                  }

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

        var loadHospitals = function () {
          if (showHospitals) {
            $.ajax({
              type: "GET",
              url: "hospitals.json",
              data: '{}',
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              success: function (response) {

                for (var i = 0; i < hospitals.length; i++) {
                  hospitals[i].setMap(null);
                }

                hospitals = [];

                response.data.forEach(function (entry) {

                  marker = new google.maps.Marker({
                    map: map,
                    position: entry.position,
                    icon: entry.icon,
                    title: entry.title
                  });

                  hospitals.push(marker);
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
            for (var i = 0; i < hospitals.length; i++) {
              hospitals[i].setMap(null);
            }

            hospitals = [];
          }
        }

        var loadHems = function () {
          if (showHems) {
            $.ajax({
              type: "GET",
              url: "hems.json",
              data: '{}',
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              success: function (response) {

                for (var i = 0; i < hems.length; i++) {
                  hems[i].setMap(null);
                }

                hems = [];

                response.data.forEach(function (entry) {

                  marker = new google.maps.Marker({
                    map: map,
                    position: entry.position,
                    icon: entry.icon,
                    title: entry.title
                  });

                  hems.push(marker);
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
            for (var i = 0; i < hems.length; i++) {
              hems[i].setMap(null);
            }

            hems = [];
          }
        }

        if (bootStrap.hookMapInitialised) {
          bootStrap.hookMapInitialised(function (pageSettings) {
            if (pageSettings.mapPlugin
                && pageSettings.mapPlugin.getNativeType() === 'GoogleMaps') {
              map = pageSettings.mapPlugin.getNative();

              loadStations();

              window.setInterval(function () {
                loadStations();
              }, 60000 * 10);
            }
          })
        }

        if (bootStrap.hookCreatedSettingsMenu) {
          // Hook the event that is raised once the settings menu has been created
          bootStrap.hookCreatedSettingsMenu(function (pageSettings) {

            // Hook the event that the settings menu raises once all of the VRS menu items are in place
            pageSettings.settingsMenu.hookAfterAddingFixedMenuItems(
                function (menu, menuItems) {

                  var stationsItem = new VRS.MenuItem({
                    name: 'customMenuItem-01',          // This has to be unique
                    labelKey: function () {
                      return 'Stations';
                    },
                    checked: showStations,
                    clickCallback: function (e) {
                      showStations = !showStations;
                      loadStations();
                    }
                  });

                  var hemsItem = new VRS.MenuItem({
                    name: 'customMenuItem-02',          // This has to be unique
                    labelKey: function () {
                      return 'Hems';
                    },
                    checked: showHems,
                    clickCallback: function (e) {
                      showHems = !showHems;
                      loadHems();
                    }
                  });

                  var hospitalsItem = new VRS.MenuItem({
                    name: 'customMenuItem-03',          // This has to be unique
                    labelKey: function () {
                      return 'Hospitals';
                    },
                    checked: showHospitals,
                    clickCallback: function (e) {
                      showHospitals = !showHospitals;
                      loadHospitals();
                    }
                  });

                  var airportsItem = new VRS.MenuItem({
                    name: 'customMenuItem-04',          // This has to be unique
                    labelKey: function () {
                      return 'Aiports';
                    },
                    checked: showAirports,
                    clickCallback: function (e) {
                      showAirports = !showAirports;
                      if (showAirports) {
                        var myMapType = new google.maps.ImageMapType({
                          getTileUrl: function (coord, zoom) {
                            return "http://1.tile.maps.openaip.net/geowebcache/service/tms/1.0.0/openaip_basemap@EPSG%3A900913@png/"
                                + zoom + "/" + coord.x + "/" + (Math.pow(2,
                                    zoom) - coord.y - 1) + ".png";
                          },
                          tileSize: new google.maps.Size(256, 256),
                          maxZoom: 9,
                          minZoom: 0,
                          opacity: 0.3,
                          name: 'mymaptype'
                        });

                        map.overlayMapTypes.insertAt(0, myMapType);
                      } else {
                        map.overlayMapTypes.removeAt(0);
                      }
                    }
                  });

                  menuItems.push(null);           // Adds a separator to the menu
                  menuItems.push(stationsItem);
                  menuItems.push(hemsItem);
                  menuItems.push(hospitalsItem);
                  menuItems.push(airportsItem);
                });
          });
        }
      });
}
</script>
