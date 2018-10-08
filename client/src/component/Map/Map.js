import React, { Component } from "react";
import { Map, View, Feature } from "ol";
import TileLayer from "ol/layer/Tile";
import BingMaps from "ol/source/BingMaps";
import { fromLonLat } from "ol/proj.js";
import { easeIn, easeOut } from "ol/easing.js";
import OSM from "ol/source/OSM";
import { defaults as defaultControls, OverviewMap } from "ol/control.js";
import { defaults as defaultInteractions, DragRotateAndZoom } from "ol/interaction.js";
import VectorLayer from "ol/layer/Vector";
import LineString from "ol/geom/LineString.js";
import Point from "ol/geom/Point";
import {  Style, Fill, Text } from "ol/style.js";
import VectorSource from "ol/source/Vector.js";
import Icon from "ol/style/Icon";
import FullScreen from "ol/control/FullScreen";
import Attribution from "ol/control/Attribution";
import ScaleLine from "ol/control/ScaleLine";
import { Button, Dropdown } from "semantic-ui-react";
// import * as turf from "turf";

import editStyle from "./Style";
import attribution from "./Attribution";
import CityJson from "../../utils/City";

//Calculate great circles routes as lines in GeoJSON or WKT format.
var arc = require("arc");

// const styles = ["Road", "RoadOnDemand", "Aerial", "AerialWithLabels"];

const options = [
  {
    text: "Road (static)",
    value: "Road"
  },

  {
    text: "Road (dynamic)",
    value: "RoadOnDemand"
  },

  {
    text: "Aerial",
    value: "Aerial"
  },

  {
    text: "Aerial with labels",
    value: "AerialWithLabels"
  }
];

//location
const london = fromLonLat([-0.12755, 51.507222]);
const rome = fromLonLat([12.5, 41.9]);
const sydeney = fromLonLat([151.207859, -33.861568]);

const view = new View({
  center: fromLonLat([134.027715, -26.029331]),
  zoom: 4.5
});

var layers = [];

var col;

class AppMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectStyle: "AerialWithLabels",
      airlines: [],
      options: options
    };
  }

  componentDidMount() {
    // get map airlines
    fetch("/api/datas")
      .then(res => res.json())
      .then(json => {
        this.setState({
          airlines: json
        });
        localStorage.setItem("the_main_map", JSON.stringify(json));
      });

    //select map of bind
    for (var i = 0; i < options.length; i++) {
      layers.push(
        new TileLayer({
          visible: options[i].value === this.state.selectStyle,
          preload: Infinity,
          source: new BingMaps({
            key:
              "AuD9mcqmkdR1Q2FiUoIuBhTZa2JFG_qJThOkX7fB_BZ0CaOcB7Afq_Wt7oVs4TvE",
            imagerySet: options[i].value
            // use maxZoom 19 to see stretched tiles instead of the BingMaps
            // "no photos at this zoom level" tiles
            // maxZoom: 19
          })
        })
      );
    }

    //customer small overview map
    var overviewMapControl = new OverviewMap({
      // see in overviewmap-custom.html to see the custom CSS used
      className: "ol-overviewmap ol-custom-overviewmap",
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      collapseLabel: "\u00BB",
      label: "\u00AB",
      collapsed: false
    });

    var att = new Attribution({
      className: "ol-attribution ol-custom-attribution",
      label: "S",
      collapsed: false,
      tipLabel: "Style indicate"
    });

    //map layer
    var map = new Map({
      controls: defaultControls().extend([
        new FullScreen(),
        overviewMapControl,
        att,
        new OverviewMap(),
        new ScaleLine({
          units: "metric"
        })
      ]),

      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
      layers: layers,
      // Improve user experience by loading tiles while dragging/zooming. Will make
      // zooming choppy on mobile or slow devices.
      loadTilesWhileInteracting: true,
      target: "map",
      view: view
    });

    var flightsSource = new VectorSource({
      wrapX: false,
      attributions: attribution.makeTable(),
      loader: function() {
        // var flightsData = flightJson.flights;
        var flightsData = {};
        if (localStorage.getItem("the_main_map")) {
          flightsData = JSON.parse(localStorage.getItem("the_main_map"));
        }
        var CityData = CityJson;
        for (var i = 0; i < flightsData.length; i++) {

          //customerize
          //get Class name
          var AirSpaceClass = flightsData[i].AirSpaceClass;

          //get Price
          var Price = flightsData[i].Price;

          //get AircraftModel
          var AircraftModel = flightsData[i].AircraftModel;

          //get EngineModel
          var EngineModel = flightsData[i].EngineModel;

          // console.log(AirSpaceClass);
          for (var j = 0; j < CityData.length; j++) {
            if (CityData[j].CityName === flightsData[i].From_City) {
              var from = CityData[j].CityPoint;
            }
            if (CityData[j].CityName === flightsData[i].To_City) {
              var to = CityData[j].CityPoint;
            }
          }

          // // create bezir curve
          // var linestring = turf.lineString([
          //   [from[1], from[0]],
          //   [from[1] + 0.5, to[0] - 0.3],
          //   [to[1], to[0]]
          // ]);
          //
          // var bezier = turf.bezier(linestring);

          // create an arc circle between the two locations
          var arcGenerator = new arc.GreatCircle(
            { x: from[1], y: from[0] },
            { x: to[1], y: to[0] },
            { name: "Seattle to DC" }
          );

          var arcLine = arcGenerator.Arc(500, { offset: 10 });
          if (arcLine.geometries.length === 1) {
            var line = new LineString(arcLine.geometries[0].coords);
            // var line = new LineString(bezier.geometry.coordinates);
            // var point =  new Point(arcLine.geometries[0].coords[0]);
            line.transform("EPSG:4326", "EPSG:3857");
            // point.transform('EPSG:4326', 'EPSG:3857');

            var feature = new Feature({
              type: LineString,
              geometry: line,
              finished: false,
              AirSpaceClass: AirSpaceClass,
              Price: Price,
              AircraftModel: AircraftModel,
              EngineModel: EngineModel,
              population: 4000,
              rainfall: 500
            });

            // add the feature with a delay so that the animation
            // for all features does not start at the same time
            addLater(feature, i * 500);
            // addLater(pointFeature,i * 500)
            // addLater(featurePoint,i * 500);
          }
        }
        map.on("postcompose", animateFlights);
      }
    });

    // add delay
    function addLater(feature, timeout) {
      window.setTimeout(function() {
        feature.set("start", new Date().getTime());
        flightsSource.addFeature(feature);
      }, timeout);
    }

    const pointsPerMs = 0.1;
    //第二次生成出来接event的function
    // const animateFlights = (styles) => (event) => {
    function animateFlights(event) {
      var vectorContext = event.vectorContext;
      var frameState = event.frameState;
      var features = flightsSource.getFeatures();

      for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        var coords = feature.getGeometry().getCoordinates();
        // if(feature.get('type') === LineString){
        if (!feature.get("finished")) {
          // only draw the lines for which the animation has not finished yet
          var elapsedTime = frameState.time - feature.get("start");
          var elapsedPoints = elapsedTime * pointsPerMs;
          // console.log(elapsedPoints);

          var index = Math.round((10 * elapsedTime) / 1000);
          if (index >= coords.length - 2) {
            feature.set("finished", true);
          }
          var maxIndex = Math.min(elapsedPoints, coords.length);
          var currentLine = new LineString(coords.slice(0, maxIndex));
          // directly draw the line with the vector context
          var airClass = feature.get("AirSpaceClass");
          var style = editStyle.findStyle(airClass);
          vectorContext.setStyle(style);
          vectorContext.drawGeometry(currentLine);

          //movepoint
          // var index = Math.round(maxIndex); // point moving with line
          if (index < 500) {
            var currentPoint = new Point(coords[index]);
            var airEngine = feature.get("EngineModel");
            var airPlane = feature.get("AircraftModel");

            var plane = editStyle.findPlane(airPlane);

            col = editStyle.findEngine(airEngine);
            var svg =
              '<svg fill="' +
              col +
              '" width="200" height="200" version="1.1" xmlns="http://www.w3.org/2000/svg"><' +
              'path d="' +
              plane +
              '"/></svg>';

            var mysvg = new Image();
            mysvg.src = "data:image/svg+xml," + escape(svg);

            //and then declare your style with img and imgSize
            var planeStyle = new Style({
              image: new Icon({
                opacity: 1,
                // anchor:[0.5,0.5],
                img: mysvg,
                imgSize: [170, 170],
                scale: 0.2,
                rotation: planeRoation(coords[i + 1], coords[i])
              })
            });

            // draw the movepoint with the vector context
            vectorContext.setStyle(planeStyle);
            vectorContext.drawGeometry(currentPoint);
          }
        }
      }
      // tell OpenLayers to continue the animation
      map.render();
    }

    //change plane direction
    function planeRoation(new_p, old_p) {
      //90 pi
      var pi_90 = Math.atan2(1, 0);
      // current pi
      var pi_ac = Math.atan2(new_p[1] - old_p[1], new_p[0] - old_p[0]);
      return pi_90 - pi_ac;
    }

    //change price color based on map types
    const findcolor = (e) => {
      switch (e) {
        default:
        case "Road":
          return "black";
        case "RoadOnDemand":
          return "black";
        case "AerialWithLabels":
          return "white";
        case "Aerial":
          return "white";
      }
    };

    var animating = true;
    var self = this;
    var flightsLayer = new VectorLayer({
      source: flightsSource,
      style: function(feature) {
        var labelStyle = new Style({
          text: new Text({
            font: 'bold 11px "Open Sans", "Arial Unicode MS", "sans-serif"',
            placement: "line",
            textBaseline: "bottom",
            fill: new Fill({
              color: findcolor(self.state.selectStyle)
            })
          })
        });
        // if the animation is still active for a feature, do not
        // render the feature with the layer style
        if (animating) {
          labelStyle.getText().setText("$" + feature.get("Price"));
          if (feature.get("finished")) {
            // console.log(feature.get("AirSpaceClass"));
            return editStyle.findStyle(feature.get("AirSpaceClass"));
          } else {
            return labelStyle;
          }
        } else {
          return null;
        }
      }
    });

    map.addLayer(flightsLayer);

    var container = document.getElementById("map");

    var radius = 75;
    document.addEventListener("keydown", function(evt) {
      if (evt.which === 38) {
        radius = Math.min(radius + 5, 150);
        map.render();
        evt.preventDefault();
      } else if (evt.which === 40) {
        radius = Math.max(radius - 5, 25);
        map.render();
        evt.preventDefault();
      }
    });

    // get the pixel position with every move
    var mousePosition = null;

    container.addEventListener("mousemove", function(event) {
      mousePosition = map.getEventPixel(event);
      map.render();
    });

    container.addEventListener("mouseout", function() {
      mousePosition = null;
      map.render();
    });

    function modifyFunction(event) {
      if (mousePosition) {
        var context = event.context;
        var pixelRatio = event.frameState.pixelRatio;
        var half = radius * pixelRatio;
        var centerX = mousePosition[0] * pixelRatio;
        var centerY = mousePosition[1] * pixelRatio;
        var originX = centerX - half;
        var originY = centerY - half;
        var size = 2 * half + 1;
        var sourceData = context.getImageData(originX, originY, size, size)
          .data;
        var dest = context.createImageData(size, size);
        var destData = dest.data;
        for (var j = 0; j < size; ++j) {
          for (var i = 0; i < size; ++i) {
            var dI = i - half;
            var dJ = j - half;
            var dist = Math.sqrt(dI * dI + dJ * dJ);
            var sourceI = i;
            var sourceJ = j;
            if (dist < half) {
              sourceI = Math.round(half + dI / 2);
              sourceJ = Math.round(half + dJ / 2);
            }
            var destOffset = (j * size + i) * 4;
            var sourceOffset = (sourceJ * size + sourceI) * 4;
            destData[destOffset] = sourceData[sourceOffset];
            destData[destOffset + 1] = sourceData[sourceOffset + 1];
            destData[destOffset + 2] = sourceData[sourceOffset + 2];
            destData[destOffset + 3] = sourceData[sourceOffset + 3];
          }
        }
        context.beginPath();
        context.arc(centerX, centerY, half, 0, 2 * Math.PI);
        context.lineWidth = 3 * pixelRatio;
        context.strokeStyle = "rgba(255,255,255,0.5)";
        context.putImageData(dest, originX, originY);
        context.stroke();
        context.restore();
      }
    }

    //modify and unmodify button
    var modify = false;
    var modifyButton = document.getElementById("modify");

    function stopModify() {
      modify = false;
      modifyButton.textContent = "Modify On";
      flightsLayer.un("postcompose", modifyFunction);
    }

    modifyButton.addEventListener("click",
      function() {
        if (modify) {
          stopModify();
        } else {
          modify = true;
          modifyButton.textContent = "Modify Off";

          // after rendering the layer, show an oversampled version around the pointer
          flightsLayer.on("postcompose", modifyFunction);
          map.render();
        }
      },
      true
    );
  }

  handleChange = (e, { value }) => {
    this.setState({ selectStyle: value });
    for (var i = 0; i < layers.length; i++) {
      layers[i].setVisible(options[i].value === value);
    }
  };

  //rotateleft
  onRotateleft = () => {
    view.animate({
      rotation: view.getRotation() + Math.PI / 2
    });
  };

  //rotateright
  onRotateright = () => {
    view.animate({
      rotation: view.getRotation() - Math.PI / 2
    });
  };

  //rotate around
  onRotateraround = () => {
    var rotation = view.getRotation();
    view.animate(
      {
        rotation: rotation + Math.PI,
        center: rome,
        easing: easeIn
      },
      {
        rotation: rotation + 2 * Math.PI,
        center: rome,
        easing: easeOut
      }
    );
  };
  //pan
  onPanto = () => {
    view.animate({
      center: london,
      duration: 2000
    });
  };
  //fly
  flyTo = (location, done) => {
    var duration = 2000;
    // var zoom = view.getZoom();
    var parts = 2;
    var called = false;
    function callback(complete) {
      --parts;
      if (called) {
        return;
      }
      if (parts === 0 || !complete) {
        called = true;
        done(complete);
      }
    }
    view.animate(
      {
        center: location,
        duration: duration
      },
      callback
    );
    view.animate(
      {
        zoom: 3,
        duration: duration / 2
      },
      {
        zoom: 8,
        duration: duration / 2
      },
      callback
    );
  };

  onFlyto = () => {
    this.flyTo(sydeney, function() {});
  };

  render() {
    const { selectStyle } = this.state;
    return (
      <div className="app">
        <div id="map" />
        <Button.Group color="teal" id="tool">
          <Button id="modify">Modify On</Button>
          {/*<Button id="start">Hide</Button>*/}
          <Dropdown
            placeholder="Select Map"
            value={selectStyle}
            floating
            search
            button
            options={this.state.options}
            onChange={this.handleChange}
          />
          <Button
            animated="vertical"
            id="rotate-left"
            title="Rotate clockwise"
            onClick={this.onRotateleft}
          >
            <Button.Content visible>↻</Button.Content>
            <Button.Content hidden>
              <i className="left arrow icon" />
            </Button.Content>
          </Button>
          <Button
            animated="vertical"
            id="rotate-right"
            title="Rotate counterclockwise"
            onClick={this.onRotateright}
          >
            <Button.Content visible>↺</Button.Content>
            <Button.Content hidden>
              <i className="right arrow icon" />
            </Button.Content>
          </Button>
          <Button animated="vertical" id="pan-to-london" onClick={this.onPanto}>
            <Button.Content visible>Pan to </Button.Content>
            <Button.Content hidden>London</Button.Content>
          </Button>
          <Button animated="vertical" id="fly-to-Sydney" onClick={this.onFlyto}>
            <Button.Content visible>Fly to</Button.Content>
            <Button.Content hidden>Sydney</Button.Content>
          </Button>
          <Button
            animated="vertical"
            id="rotate-around-rome"
            onClick={this.onRotateraround}
          >
            <Button.Content visible>Rotate around</Button.Content>
            <Button.Content hidden>Rome</Button.Content>
          </Button>
        </Button.Group>
      </div>
    );
  }
}

export default AppMap;
