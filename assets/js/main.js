require([
      // ArcGIS
      "esri/WebMap",
      "esri/views/MapView",

      // Widgets
      "esri/widgets/BasemapGallery",
      "esri/widgets/Search",
      "esri/widgets/Legend",
      "esri/widgets/LayerList",
      "esri/widgets/Print",
      "esri/widgets/BasemapToggle",
      "esri/widgets/ScaleBar",

      //Routes
      "esri/Graphic",
      "esri/layers/GraphicsLayer",
      "esri/tasks/RouteTask",
      "esri/tasks/support/RouteParameters",
      "esri/tasks/support/FeatureSet",
      "esri/symbols/SimpleMarkerSymbol",
      "esri/symbols/SimpleLineSymbol",
      "esri/Color",
      "esri/core/urlUtils",
      "dojo/on",

      // Bootstrap
      "bootstrap/Collapse",
      "bootstrap/Dropdown",

      // Calcite Maps
      "calcite-maps/calcitemaps-v0.4",
      
      "dojo/domReady!"
    ], function(WebMap, MapView, Basemaps, Search, Legend, LayerList, Print, BasemapToggle, ScaleBar, Graphic, GraphicsLayer, RouteTask, RouteParameters,
      FeatureSet, SimpleMarkerSymbol, SimpleLineSymbol, Color, urlUtils, on) {

      /******************************************************************
       *
       * Create the map, view and widgets
       * 
       ******************************************************************/
      
      // Proxy the route requests to avoid prompt for log in
      urlUtils.addProxyRule({
        urlPrefix: "route.arcgis.com",
        proxyUrl: "/sproxy/"
      });

      // Point the URL to a valid route service
      var routeTask = new RouteTask({
        url: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World"
      });

      // The stops and route result will be stored in this layer
      var routeLyr = new GraphicsLayer();

      // Setup the route parameters
      var routeParams = new RouteParameters({
        stops: new FeatureSet(),
        outSpatialReference: { // autocasts as new SpatialReference()
          wkid: 3857
        }
      });

      // Define the symbology used to display the stops
      var stopSymbol = new SimpleMarkerSymbol({
        style: "cross",
        size: 15,
        outline: { // autocasts as new SimpleLineSymbol()
          width: 4
        }
      });

      // Define the symbology used to display the route
      var routeSymbol = new SimpleLineSymbol({
        color: [0, 0, 255, 0.5],
        width: 5
      });

      // Map
      var map = new WebMap({
        portalItem: {
          // id: "9f91f911f58540ceaac0300c55e18fbb"
          // id: "84d09c8b6551486ea4ecec6c2979ca0e" //hosted, will require login
          id: "2167063b86bc4288a39e5c4c844a67b2" //map layer item
          // id: "00c54fece73a47e8a3d6b535d21997c8" // raw shapefile but requires login
        },
      });
      
      // View
      var mapView = new MapView({
        container: "mapViewDiv",
        map: map,
        padding: {
          top: 50,
          bottom: 0
        },
        center: [7.5030633, 9.0402785],
        zoom: 8,
      });

      // Adds a graphic when the user clicks the map. If 2 or more points exist, route is solved.
      on(mapView, "click", addStop);

      function addStop(event) {
        // Add a point at the location of the map click
        var stop = new Graphic({
          geometry: event.mapPoint,
          symbol: stopSymbol
        });
        routeLyr.add(stop);

        // Execute the route task if 2 or more stops are input
        routeParams.stops.features.push(stop);
        if (routeParams.stops.features.length >= 2) {
          routeTask.solve(routeParams).then(showRoute);
        }
      }
      // Adds the solved route to the map as a graphic
      function showRoute(data) {
        var routeResult = data.routeResults[0].route;
        routeResult.symbol = routeSymbol;
        routeLyr.add(routeResult);
      }

      // Popup
      mapView.then(function(){
        mapView.popup.dockEnabled = false;
        mapView.popup.dockOptions = {
          buttonEnabled: false
        }
      });

      // Basemaps
      var basemaps = new Basemaps({
        container: "basemapGalleryDiv",
        view: mapView
      })

      // Search - add to navbar
      var searchWidget = new Search({
        container: "searchWidgetDiv",
        view: mapView
      });
      
      // Legend
      var legendWidget = new Legend({
        container: "legendDiv",
        view: mapView
      });

      // LayerList
      var layerWidget = new LayerList({
        container: "layersDiv",
        view: mapView
      });

      // Print
      var printWidget = new Print({
        container: "printDiv",
        view: mapView,
        printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
      });

      // BasemapToggle
      var basemapToggle = new BasemapToggle({
        view: mapView,
        secondBasemap: "satellite"
      });
      mapView.ui.add(basemapToggle, "bottom-right");          
      
      // Scalebar
      var scaleBar = new ScaleBar({
        view: mapView
      });
      mapView.ui.add(scaleBar, "bottom-left");

    });