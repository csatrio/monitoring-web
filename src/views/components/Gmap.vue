<template>
<div>
  <div id="map"></div>
  <b-modal v-model="modal" :title="modal_title" @ok="modal=false">
    <p>Name: {{model !== null ? model.name : ''}}</p>
    <p>Vendor: {{model !== null ? model.vendor : ''}}</p>
    <p>Status: {{model !== null ? model.status : ''}}</p>
    <p>Location: {{model !== null ? model.location : ''}}</p>
    <p>Lat: {{model !== null ? model.lat : ''}}</p>
    <p>Long: {{model !== null ? model.long : ''}}</p>
  </b-modal>
</div>

</template>

<script>
const axios = require('axios')
export default {
  name: 'Gmap',
  props: {
  },
  data: () => {
    return {
      // Replace the value of the key parameter with your own API key.
      map_cluster_url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js',
      map_script_url: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDSdhIYJ2CC1G0A5xTKB0m2LuX_IzXIJJQ',
      map: null,
      markers: [],
      modal: false,
      model: null,
      modal_title: 'Device',
      mapInitialized: false
    }
  },
  created() {
    var vm = this
    if(typeof google === 'undefined'){
      var map_script = document.createElement('script')
      map_script.src = this.map_script_url
      map_script.onload = function(e){
        vm.Log('Gmap map_script loaded.')
        vm.initMap()
      }
      document.head.appendChild(map_script)
    }
  },
  computed: {
  },
  watch:{
  },
  methods: {
    addMarker(_device) {
      // Add the marker at the clicked location
      var vm = this
      var marker = new google.maps.Marker({
        position: {lat: Number(_device.lat), lng: Number(_device.long)},
        label: {
          text: _device.name,
          fontFamily: 'Arial',
          fontWeight: 'Bold',
          fontSize: '18px',
          color: 'black'
        },
        map: vm.map,
        icon: vm.customIcon({fillColor: vm.markerColor(_device)})
      })
      var infowindow = new google.maps.InfoWindow({
        content: '<p>Device: ' + _device.name + '</p>' 
        + '<p>Vendor: ' + _device.vendor + '</p>'
        + '<p>Status: ' + _device.status + '</p>'
      })
      marker.addListener('click', function(){
        vm.modal=true
        vm.model=_device
        vm.modal_title=_device.name
      })
      marker.addListener('mouseover', function(){
        infowindow.open(vm.map, marker)
      })
      marker.addListener('mouseout', function(){
        infowindow.close()
      })
      vm.markers.push(marker)
    },
    initMap() {
      if(this.mapInitialized) return
      var vm = this;
      var map_center = { lat: -6.229728, lng: 106.6894306 };
      vm.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: map_center
      });
      
      axios.get('api/device/')
      .then(response=>{
        response.data.data.forEach(e=>{
          vm.addMarker(e)
        })
        // manage marker cluster
        if(typeof MarkerClusterer === 'undefined'){
          var map_cluster_script = document.createElement('script')
          map_cluster_script.src = this.map_cluster_url
          map_cluster_script.onload = function(e){
            var markerCluster = new MarkerClusterer(vm.map, vm.markers,
              {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
          }
          document.head.appendChild(map_cluster_script)
        } else {
          var markerCluster = new MarkerClusterer(vm.map, vm.markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
        }
        
      })
      .catch(err=>{
        vm.LogErr(err)
      })
      vm.Log('Gmap Initialized!!')
      this.mapInitialized = true
    },
    customIcon (opts) {
      return Object.assign({
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
        fillColor: '#34495e',
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 2,
        scale: 1,
      }, opts);
    },
    markerColor (_device) {
      return _device.status === 'Active' ? '#2ecc71' : '#FF0000' 
    }
  },
  mounted() {
    if(typeof google !== 'undefined') this.initMap()
  }
}
</script>

<style scoped>
div#map {
  height: 400px;
}
</style>
