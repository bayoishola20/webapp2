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

      // Bootstrap
      "bootstrap/Collapse",
      "bootstrap/Dropdown",

      // Calcite Maps
      "calcite-maps/calcitemaps-v0.4",
      
      "dojo/domReady!"
    ], function(WebMap, MapView, Basemaps, Search, Legend, LayerList, Print, BasemapToggle, ScaleBar) {

      /******************************************************************
       *
       * Create the map, view and widgets
       * 
       ******************************************************************/

      // Map
      var map = new WebMap({
        portalItem: {
          id: "9f91f911f58540ceaac0300c55e18fbb"
        }
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
        zoom: 8
      });

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