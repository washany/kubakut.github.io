function getViewport() {
    map.setActiveArea(sidebar.isVisible() ? {
        position: "absolute",
        top: "0px",
        left: $(".leaflet-sidebar").css("width"),
        right: "0px",
        height: $("#map").css("height")
    } : {
        position: "absolute",
        top: "0px",
        left: "0px",
        right: "0px",
        height: $("#map").css("height")
    }), document.body.clientWidth <= 767 ? $(".leaflet-sidebar .close").css("top", "2px") : $(".leaflet-sidebar .close").css("top", "12px")
}

function sidebarClick(e) {
    document.body.clientWidth <= 767 && (sidebar.hide(), getViewport()), map.addLayer(theaterLayer).addLayer(museumLayer);
    var t = markerClusters.getLayer(e);
    markerClusters.zoomToShowLayer(t, function() {
        map.setView([t.getLatLng().lat, t.getLatLng().lng], 18), t.fire("click")
    })
}

function updateAttribution() {
    $.each(map._layers, function(e, t) {
        t.getAttribution && $("#attribution").html(t.getAttribution())
    })
}
var map, boroughSearch = [],
    theaterSearch = [],
    museumSearch = [];
$(document).ready(function() {
    getViewport()
});
var mapquestOAM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
    maxZoom: 19,
    subdomains: ["otile1", "otile2", "otile3", "otile4"],
    attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
}),
    mapquestOSM = L.tileLayer("http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}", {
        minZoom: 0,
        maxZoom: 19,
        center: [14.338222, 50.04878],
        attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }),
    mapquestHYB = L.tileLayer("http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/hybrid.day/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}", {
        attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
        subdomains: "1234",
        mapID: "newest",
        app_id: "qpmQayVMDvid7tmL0dlT",
        app_code: "tw8KKBj_vhTmr_YLSyw1Zw",
        base: "aerial",
        minZoom: 0,
        maxZoom: 20
    }),
    highlight = L.geoJson(null),
    boroughs = L.geoJson(null, {
        style: function() {
            return {
                color: "grey",
                fill: !1,
                opacity: 1,
                clickable: !1
            }
        },
        onEachFeature: function(e, t) {
            boroughSearch.push({
                name: t.feature.properties.BoroName,
                source: "Boroughs",
                id: L.stamp(t),
                bounds: t.getBounds()
            })
        }
    });
$.getJSON("data/boroughs.geojson", function(e) {
    boroughs.addData(e)
});
var subwayLines = L.geoJson(null, {
    style: function(e) {
        return "1" === e.properties.route_id || "2" === e.properties.route_id || "3" === e.properties.route_id ? {
            color: "#ff3135",
            weight: 3,
            opacity: 1
        } : "4" === e.properties.route_id || "5" === e.properties.route_id || "6" === e.properties.route_id ? {
            color: "#009b2e",
            weight: 3,
            opacity: 1
        } : "7" === e.properties.route_id ? {
            color: "#ce06cb",
            weight: 3,
            opacity: 1
        } : "A" === e.properties.route_id || "C" === e.properties.route_id || "E" === e.properties.route_id || "SI" === e.properties.route_id || "H" === e.properties.route_id ? {
            color: "#fd9a00",
            weight: 3,
            opacity: 1
        } : "Air" === e.properties.route_id ? {
            color: "#ffff00",
            weight: 3,
            opacity: 1
        } : "B" === e.properties.route_id || "D" === e.properties.route_id || "F" === e.properties.route_id || "M" === e.properties.route_id ? {
            color: "#ffff00",
            weight: 3,
            opacity: 1
        } : "G" === e.properties.route_id ? {
            color: "#9ace00",
            weight: 3,
            opacity: 1
        } : "FS" === e.properties.route_id || "GS" === e.properties.route_id ? {
            color: "#6e6e6e",
            weight: 3,
            opacity: 1
        } : "J" === e.properties.route_id || "Z" === e.properties.route_id ? {
            color: "#976900",
            weight: 3,
            opacity: 1
        } : "L" === e.properties.route_id ? {
            color: "#969696",
            weight: 3,
            opacity: 1
        } : "N" === e.properties.route_id || "Q" === e.properties.route_id || "R" === e.properties.route_id ? {
            color: "#ffff00",
            weight: 3,
            opacity: 1
        } : void 0
    },
    onEachFeature: function(e, t) {
        if (e.properties) {
            var a = "<table class='table table-striped table-bordered table-condensed'><tr><th>Division</th><td>" + e.properties.Division + "</td></tr><tr><th>Line</th><td>" + e.properties.Line + "</td></tr><table>";
            t.on({
                click: function(t) {
                    $("#feature-title").html(e.properties.Line), $("#feature-info").html(a), $("#featureModal").modal("show"), highlight.clearLayers().addLayer(L.circleMarker([t.latlng.lat, t.latlng.lng], {
                        stroke: !1,
                        fillColor: "#00FFFF",
                        fillOpacity: .7,
                        radius: 10
                    }))
                }
            })
        }
        t.on({
            mouseover: function(e) {
                var t = e.target;
                t.setStyle({
                    weight: 3,
                    color: "#00FFFF",
                    opacity: 1
                }), L.Browser.ie || L.Browser.opera || t.bringToFront()
            },
            mouseout: function(e) {
                subwayLines.resetStyle(e.target)
            }
        })
    }
});
$.getJSON("data/subways.geojson", function(e) {
    subwayLines.addData(e)
});
var markerClusters = new L.MarkerClusterGroup({
    spiderfyOnMaxZoom: !0,
    showCoverageOnHover: !1,
    zoomToBoundsOnClick: !0,
    maxClusterRadius: 40,
    disableClusteringAtZoom: 15
}),
    theaterLayer = L.geoJson(null),
    theaters = L.geoJson(null, {
        pointToLayer: function(e, t) {
            return L.marker(t, {
                icon: L.divIcon({
                    html: "<table><tr><th style='font-size:13px;' class='label label-danger'>" + e.id + "</th></tr><tr><td><img width='26' height='30' src='assets/img/hriste.png'></td></tr></table>",
                    iconSize: [24, 27],
                    iconAnchor: [12, 28],
                    className: "text-center"
                }),
                title: e.properties.NAME,
                riseOnHover: !0
            })
        },
        onEachFeature: function(e, t) {
            if (e.properties) {
                var a = "<div class='panel panel-info'><div class='panel-heading'><h3 class='panel-title'>Aktivity</h3></div><div class='panel-body'>" + e.properties.AKTIVITY + "</div></div><div class='panel panel-info'><div class='panel-heading'><h3 class='panel-title'>Kontakty</h3></div><div class='panel-body'>" + e.properties.KONTAKTY + "</div></div><div class='panel panel-info'><div class='panel-heading'><h3 class='panel-title'>Otevírací doba</h3></div><div class='panel-body'>" + e.properties.ODOBA + "</div></div>",
                    r = e.id + ". " + e.properties.NAME;
                t.on({
                    click: function() {
                        var o = "";
                        $("#feature-title").html(r), $("#feature-info").html(a);
                        for (var i = 0; i < e.properties.GALERIE; i++) o += "<obr>";
                        $("#feature-gal").html(o), $(document).ready(function() {
                            $("obr").each(function(t) {
                                $(this).prepend("<center><a href='img/" + e.id + "/" + ++t + ".JPG' target='_blank'><img style='margin: 10px 0px' src='img/" + e.id + "/" + t + ".JPG'  height='auto' max-width: 100%; class='img-responsive img-thumbnail' /></a></center>")
                            })
                        }), $("#featureModal").modal("show"), highlight.clearLayers().addLayer(L.circleMarker([e.geometry.coordinates[1], e.geometry.coordinates[0]], {
                            stroke: !1,
                            fillColor: "#00FFFF",
                            fillOpacity: .7,
                            radius: 10
                        }))
                    }
                }), $("#theater-table > tbody").append('<tr class="tbl-item" style="cursor: pointer;" onclick="sidebarClick(' + L.stamp(t) + '); return false;"><td class="theater-name "><b><p class="title">' + e.id + "</b>.</p> " + t.feature.properties.NAME + '<p class="' + e.mesto + '"><p class="' + e.kategorie + '"></p></td><td style="vertical-align: middle;"><i style="vertical-align: middle;" class="fa fa-chevron-right pull-right"></td></tr>'), theaterSearch.push({
                    name: t.feature.properties.NAME,
                    address: t.feature.mesto,
                    source: "Hřiště",
                    id: L.stamp(t),
                    lat: t.feature.geometry.coordinates[1],
                    lng: t.feature.geometry.coordinates[0]
                }), $("#demo").jplist({
                    itemsBox: ".demo-tbl",
                    itemPath: ".tbl-item",
                    panelPath: ".jplist-panel",
                    debug: true,
                    redrawCallback: function() {
                        new List("theaters", {
                            valueNames: ["theater-name"]
                        }).sort("theater-name", {
                            order: "asc"
                        })
                    }
                })
            }
        }
    });
$.getJSON("data/hriste.geojson", function(e) {
    theaters.addData(e), map.addLayer(theaterLayer)
});
var museumLayer = L.geoJson(null),
    museums = L.geoJson(null, {
        pointToLayer: function(e, t) {
            return L.marker(t, {
                icon: L.icon({
                    iconUrl: "assets/img/museum.png",
                    iconSize: [32, 37],
                    iconAnchor: [12, 28],
                    popupAnchor: [0, -25]
                }),
                title: e.properties.NAME,
                riseOnHover: !0
            })
        },
        onEachFeature: function(e, t) {
            if (e.properties) {
                var a = "<table class='table table-striped table-bordered table-condensed'><tr><th>Název</th><td>" + e.properties.NAME + "</td></tr><tr><th>Popis</th><td>" + e.properties.POPIS + "</td></tr><table>";
                t.on({
                    click: function() {
                        $("#feature-title").html(e.properties.NAME), $("#feature-info").html(a), $("#feature-gal").html(""), $("#featureModal").modal("show"), highlight.clearLayers().addLayer(L.circleMarker([e.geometry.coordinates[1], e.geometry.coordinates[0]], {
                            stroke: !1,
                            fillColor: "#00FFFF",
                            fillOpacity: .7,
                            radius: 10
                        }))
                    }
                }), $("#museum-table tbody").append('<tr style="cursor: pointer;" onclick="sidebarClick(' + L.stamp(t) + '); return false;"><td class="museum-name"><b>' + e.id + "</b>. " + t.feature.properties.NAME + '<i class="fa fa-chevron-right pull-right"></td></tr>'), museumSearch.push({
                    name: t.feature.properties.NAME,
                    address: t.feature.properties.ADRESS1,
                    source: "Občerstvení",
                    id: L.stamp(t),
                    lat: t.feature.geometry.coordinates[1],
                    lng: t.feature.geometry.coordinates[0]
                })
            }
        }
    });
$.getJSON("data/obcerstveni.geojson", function(e) {
    museums.addData(e)
}), map = L.map("map", {
    zoom: 5,
    center: [14.338, 50.048],
    layers: [mapquestOSM, boroughs, markerClusters, highlight],
    zoomControl: !1,
    attributionControl: !1
}), map.on("overlayadd", function(e) {
    e.layer === theaterLayer && markerClusters.addLayer(theaters), e.layer === museumLayer && markerClusters.addLayer(museums)
}), map.on("overlayremove", function(e) {
    e.layer === theaterLayer && markerClusters.removeLayer(theaters), e.layer === museumLayer && markerClusters.removeLayer(museums)
}), $("#featureModal").on("hide.bs.modal", function() {
    highlight.clearLayers()
}), map.on("layeradd", updateAttribution), map.on("layerremove", updateAttribution);
var attributionControl = L.control({
    position: "bottomright"
});
attributionControl.onAdd = function() {
    var t = L.DomUtil.create("div", "leaflet-control-attribution");
    return t.innerHTML = "Mapa od <a href='http://www.openstreetmap.org/'>OpenStreetMap.org</a> | <a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Zdroje</a>", t
}, map.addControl(attributionControl);
var zoomControl = L.control.zoom({
    position: "bottomright"
}).addTo(map),
    locateControl = L.control.locate({
        position: "bottomright",
        drawCircle: !0,
        follow: !0,
        setView: !0,
        keepCurrentZoomLevel: !0,
        markerStyle: {
            weight: 1,
            opacity: .8,
            fillOpacity: .8
        },
        circleStyle: {
            weight: 1,
            clickable: !1
        },
        icon: "icon-direction",
        metric: !1,
        strings: {
            title: "Moje lokace",
            popup: "Nacházíte se {distance} {unit} od tohoto bodu.",
            outsideMapBoundsMsg: "Nacházíte se mimo hranice mapové zóny"
        },
        locateOptions: {
            maxZoom: 18,
            watch: !0,
            enableHighAccuracy: !0,
            maximumAge: 1e4,
            timeout: 1e4
        }
    }).addTo(map),
    sidebar = L.control.sidebar("sidebar", {
        closeButton: !0,
        position: "left"
    }).on("shown", function() {
        getViewport()
    }).on("hidden", function() {
        getViewport()
    }).addTo(map);
if (document.body.clientWidth <= 767) var isCollapsed = !0;
else {
    var isCollapsed = !1;
    sidebar.show()
}
var baseLayers = {
    "Mapa A": mapquestOSM,
    "Mapa B": mapquestOAM,
    "Satelitní": mapquestHYB
}, groupedOverlays = {
        "Seznam míst": {
            "<img src='assets/img/hriste.png' width='24' height='28'>&nbsp;Aktivity pro děti": theaterLayer
        }
    }, layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
        collapsed: isCollapsed
    }).addTo(map);
$("#searchbox").click(function() {
    $(this).select()
}), $(document).one("ajaxStop", function() {
    map.fitBounds(boroughs.getBounds()), $("#loading").hide();
    var e = new Bloodhound({
        name: "Boroughs",
        datumTokenizer: function(e) {
            return Bloodhound.tokenizers.whitespace(e.name)
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: boroughSearch,
        limit: 10
    }),
        t = new Bloodhound({
            name: "Hřiště",
            datumTokenizer: function(e) {
                return Bloodhound.tokenizers.whitespace(e.name)
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: theaterSearch,
            limit: 10
        }),
        r = (new List("theaters", {
            valueNames: ["theater-name"]
        }).sort("theater-name", {
            order: "asc"
        }), new Bloodhound({
            name: "Občerstvení",
            datumTokenizer: function(e) {
                return Bloodhound.tokenizers.whitespace(e.name)
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: museumSearch,
            limit: 10
        })),
        i = (new List("museums", {
            valueNames: ["museum-name", "museum-address"]
        }).sort("museum-name", {
            order: "asc"
        }), new Bloodhound({
            name: "GeoNames",
            datumTokenizer: function(e) {
                return Bloodhound.tokenizers.whitespace(e.name)
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
                filter: function(e) {
                    return $.map(e.geonames, function(e) {
                        return {
                            name: e.name + ", " + e.adminCode1,
                            lat: e.lat,
                            lng: e.lng,
                            source: "GeoNames"
                        }
                    })
                },
                ajax: {
                    beforeSend: function(e, t) {
                        t.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth(), $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin")
                    },
                    complete: function() {
                        $("#searchicon").removeClass("fa-refresh fa-spin").addClass("fa-search")
                    }
                }
            },
            limit: 10
        }));
    e.initialize(), t.initialize(), r.initialize(), i.initialize(), $("#searchbox").typeahead({
        minLength: 3,
        highlight: !0,
        hint: !1
    }, {
        name: "Boroughs",
        displayKey: "name",
        source: e.ttAdapter(),
        templates: {
            header: "<h4 class='typeahead-header'>Boroughs</h4>"
        }
    }, {
        name: "Hřiště",
        displayKey: "name",
        source: t.ttAdapter(),
        templates: {
            header: "<h4 class='typeahead-header'><img src='assets/img/hriste.png' width='24' height='28'>&nbsp;Hřiště</h4>",
            suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{mesto}}</small>"].join(""))
        }
    }, {
        name: "Občerstvení",
        displayKey: "name",
        source: r.ttAdapter(),
        templates: {
            header: "<h4 class='typeahead-header'><img src='assets/img/museum.png' width='24' height='28'>&nbsp;Občerstvení</h4>",
            suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
        }
    }, {
        name: "GeoNames",
        displayKey: "name",
        source: i.ttAdapter(),
        templates: {
            header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
        }
    }).on("typeahead:selected", function(e, t) {
        "Boroughs" === t.source && map.fitBounds(t.bounds), "Hřiště" === t.source && (map.hasLayer(theaterLayer) || map.addLayer(theaterLayer), map.setView([t.lat, t.lng], 17), map._layers[t.id] && map._layers[t.id].fire("click")), "Občerstvení" === t.source && (map.hasLayer(museumLayer) || map.addLayer(museumLayer), map.setView([t.lat, t.lng], 17), map._layers[t.id] && map._layers[t.id].fire("click")), "GeoNames" === t.source && map.setView([t.lat, t.lng], 14), $(".navbar-collapse").height() > 50 && $(".navbar-collapse").collapse("hide")
    }).on("typeahead:opened", function() {
        $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height()), $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height())
    }).on("typeahead:closed", function() {
        $(".navbar-collapse.in").css("max-height", ""), $(".navbar-collapse.in").css("height", "")
    }), $(".twitter-typeahead").css("position", "static"), $(".twitter-typeahead").css("display", "block")
});
