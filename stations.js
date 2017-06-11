<script type="text/javascript">
if(VRS && VRS.globalDispatch && VRS.serverConfig) {
    VRS.globalDispatch.hook(VRS.globalEvent.bootstrapCreated, function(bootStrap) {
        if(bootStrap.hookMapInitialised) {
            bootStrap.hookMapInitialised(function(pageSettings) {
                if(pageSettings.mapPlugin && pageSettings.mapPlugin.getNativeType() === 'GoogleMaps') {

                  var map = pageSettings.mapPlugin.getNative();
                  var markers = [];
                  var hospitals = [];
                  var hems = [];
                  var showStations = true;
                  var showMeteo = false;
                  var showHospitals = false;
                  var showHems = false;
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



                  function CzadsbControl(controlDiv, map) {

                    var recDiv = document.createElement('div');
                    recDiv.style.background = "white";
                    recDiv.style.margin = "10px";
                    controlDiv.appendChild(recDiv);

                    var receiversUIMenu = document.createElement('ul');
                    receiversUIMenu.className = "dl-menu dl-menuopen";
                    receiversUIMenu.style.borderColor = "white";
                    recDiv.appendChild(receiversUIMenu);

                    // layers
                    // meteo

                    // var meteoDiv = document.createElement('div');
                    // meteoDiv.style.margin = "8px";
                    // receiversUIMenu.appendChild(meteoDiv);
                    //
                    // var meteoLi = document.createElement('p');
                    // meteoDiv.appendChild(meteoLi);
                    //
                    // var meteoRadio = document.createElement('input');
                    // meteoRadio.type = "radio";
                    // meteoRadio.name = "layer";
                    // meteoRadio.value = "meteo";
                    // meteoRadio.id = "meteo";
                    // meteoLi.appendChild(meteoRadio);
                    //
                    // var meteoLabel = document.createElement('label')
                    // meteoLabel.htmlFor = "meteo";
                    // meteoLabel.appendChild(document.createTextNode('Meteo'));
                    // meteoLi.appendChild(meteoLabel);
                    //
                    //
                    // // Setup the click event listeners
                    // meteoRadio.addEventListener('click', function(e) {
                    //   showMeteo = !showMeteo;
                    //   meteoLayer();
                    // });

                    // markers
                    // receivers
                    var receiversUI = document.createElement('div');
                    receiversUI.style.margin = "8px";
                    receiversUIMenu.appendChild(receiversUI);

                    var receiverLi = document.createElement('p');
                    receiversUI.appendChild(receiverLi);

                    var receiverCheckbox = document.createElement('input');
                    receiverCheckbox.type = "checkbox";
                    receiverCheckbox.name = "name";
                    receiverCheckbox.value = "value";
                    receiverCheckbox.id = "receiverId";
                    receiverCheckbox.checked = showStations;
                    receiverLi.appendChild(receiverCheckbox);

                    var checkboxLabel = document.createElement('label')
                    checkboxLabel.htmlFor = "receiverId";
                    checkboxLabel.appendChild(document.createTextNode('Stations'));
                    receiverLi.appendChild(checkboxLabel);

                    // Setup the click event listeners
                    receiverCheckbox.addEventListener('click', function(e) {
                      showStations = e.target.checked;
                      loadStations();
                    });

                    // hospitals
                    var hospitalsUI = document.createElement('div');
                    hospitalsUI.style.margin = "8px";
                    receiversUIMenu.appendChild(hospitalsUI);

                    var hospitalsLi = document.createElement('p');
                    hospitalsUI.appendChild(hospitalsLi);

                    var hospitalsCheckbox = document.createElement('input');
                    hospitalsCheckbox.type = "checkbox";
                    hospitalsCheckbox.name = "hospitals";
                    hospitalsCheckbox.value = "value";
                    hospitalsCheckbox.id = "hospitalsId";
                    hospitalsCheckbox.checked = showHospitals;
                    hospitalsLi.appendChild(hospitalsCheckbox);

                    var hospitalsLabel = document.createElement('label')
                    hospitalsLabel.htmlFor = "hospitalsId";
                    hospitalsLabel.appendChild(document.createTextNode('Hospitals'));
                    hospitalsLi.appendChild(hospitalsLabel);

                    // Setup the click event listeners
                    hospitalsCheckbox.addEventListener('click', function(e) {
                      showHospitals = e.target.checked;
                      loadHospitals();
                    });

                    // hems
                    var hemsUI = document.createElement('div');
                    hemsUI.style.margin = "8px";
                    receiversUIMenu.appendChild(hemsUI);

                    var hemsLi = document.createElement('p');
                    hemsUI.appendChild(hemsLi);

                    var hemsCheckbox = document.createElement('input');
                    hemsCheckbox.type = "checkbox";
                    hemsCheckbox.name = "hems";
                    hemsCheckbox.value = "value";
                    hemsCheckbox.id = "hemsId";
                    hemsCheckbox.checked = showHems;
                    hemsLi.appendChild(hemsCheckbox);

                    var hemsLabel = document.createElement('label')
                    hemsLabel.htmlFor = "hemsId";
                    hemsLabel.appendChild(document.createTextNode('Hems'));
                    hemsLi.appendChild(hemsLabel);

                    // Setup the click event listeners
                    hemsCheckbox.addEventListener('click', function(e) {
                      showHems = e.target.checked;
                      loadHems();
                    });
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


                  var loadHospitals = function() {
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


                  var loadHems = function() {
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

                  loadStations();
                  meteoLayer();

                  var receiversControlDiv = document.createElement('div');
                  var centerControl = new CzadsbControl(receiversControlDiv, map);

                  receiversControlDiv.index = 1;
                  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(receiversControlDiv);


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
