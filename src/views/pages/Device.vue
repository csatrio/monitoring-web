<template>
  <div class="animated fadeIn">
    <b-card title="Lokasi Alat">
      <div id="map"></div>
    </b-card>

    <b-card title="Data Alat">
      <b-form-group label="Nama Alat:"
                    label-for="deviceName">
        <b-form-input id="deviceName" v-model="deviceName" type="text" placeholder="Nama Alat Anda"></b-form-input>
      </b-form-group>
      
      <b-form-group label="Lokasi:"
                    label-for="deviceName">
        <b-form-input id="deviceName" v-model="location" type="text" placeholder="Lokasi Alat Anda"></b-form-input>
      </b-form-group>
      
      <b-form-group label="Nama Vendor:"
                    label-for="_vendor_list">
        <b-form-select id="_vendor_list" v-model="selected" :options="vendor_list" class="mb-3" size="sm"/>
      </b-form-group>
      
      <b-form-group label="Lattitude:"
                    label-for="_lat">
        <b-form-input id="_lat" v-model="lat" type="text"></b-form-input>
      </b-form-group>
      
      <b-form-group label="Longitude:"
                    label-for="_lng">
        <b-form-input id="_lng" v-model="lng" type="text"></b-form-input>
      </b-form-group>
      
      <b-button :disabled="disable_submit" variant="success" size="md" @click="submit_data">Submit</b-button>
    </b-card>
  </div>
</template>

<script>
const axios = require('axios')
export default {
  name: "AddDevice",
  props: {},
  data: () => {
    return {
      // Replace the value of the key parameter with your own API key.
      map_script_url: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDSdhIYJ2CC1G0A5xTKB0m2LuX_IzXIJJQ',
      marker: null,
      map: null,
      lat: 0,
      lng: 0,
      default_lat: -6.229728,
      default_lng: 106.86027980214453, 
      deviceName: '',
      location: '',
      vendor_list: [],
      selected: null,
      mapInitialized: false
    };
  },
  created() {
    var vm = this;
    if(typeof google === 'undefined') {
      var map_script = document.createElement("script")
      map_script.src = this.map_script_url;
      map_script.onload = function(e) {
        vm.Log("Gmap map_script loaded.");
        vm.initMap()
      };
      document.head.appendChild(map_script);
    }
  },
  computed: {
    disable_submit: function(){
      return !(this.deviceName!=='' && this.location!=='' && this.selected!==null && this.lat!==0 && this.lng!==0)
    }
  },
  watch: {
    deviceName: function(_new, _old) {
      this.modifyMarker(this.lat, this.lng, _new)
    },
    lat: function(_new, _old) {
      this.modifyMarker(_new, this.lng)
    },
    lng: function(_new, _old) {
      this.modifyMarker(this.lat, _new)
    }
  },
  methods: {
    createMarkerLabel(_text){
      return {
        text: _text,
        fontFamily: 'Arial',
        fontWeight: 'Bold',
        fontSize: '18px',
        color: 'black'
      }
    },
    modifyMarker(_lat, _lng, _name=null) {
      var vm = this
      if(vm.marker !== null){
        vm.marker.setMap(null)
        var __lat = Number(_lat)
        var __lng = Number(_lng)
        vm.marker = new google.maps.Marker({
          position: {lat: __lat !== 0 ? __lat : vm.default_lat, lng: __lng !==0 ? __lng : vm.default_lng},
          label: vm.createMarkerLabel(_name === null ? (vm.deviceName===''? ' ' : vm.deviceName) : _name),
          map: vm.map
        });
      }
    },
    addMarker(location, _label = null) {
      var vm = this
      if(vm.marker === null){
        vm.marker = new google.maps.Marker({
          position: location,
          label: vm.createMarkerLabel(_label === null ? vm.deviceName : _label),
          map: vm.map
        });
      }
      else {
        vm.modifyMarker(location.lat(), location.lng(), _label)
      }
    },
    initMap() {
      if(this.mapInitialized) return
      var vm = this;
      var map_center = { lat: vm.default_lat, lng: vm.default_lng };
      vm.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: map_center
      });

      // This event listener calls addMarker() when the map is clicked.
      google.maps.event.addListener(vm.map, "click", function(event) {
        vm.addMarker(event.latLng);
        vm.lat = event.latLng.lat();
        vm.lng = event.latLng.lng();
      });
      vm.addMarker({lat:-6.254312620713573, lng:106.86027980214453}, vm.deviceName === '' ? ' ' : vm.deviceName)
      vm.Log("Device map initialized!!");
      vm.mapInitialized = true
    },
    load_vendor () {
      var vm = this
      axios.get('api/vendor/')
      .then(response=>{
        vm.vendor_list = response.data.data
        vm.vendor_list.forEach(e=>{
          e.text = e.name
          e.value = e
        })
      })
      .catch(err=>{
        vm.LogErr(err)
      })
    },
    submit_data() {
      var vm = this
      var device = {name:vm.deviceName, location:vm.location, vendor: vm.selected.id, lat:vm.lat, long:vm.lng}
      axios.post('api/device/', device)
      .then(response=>{
      })
      .catch(err=>{
        vm.LogErr(err)
      })
      alert('Device : ' + vm.deviceName + ' telah berhasil disave')
    }
  },
  mounted() {
    var vm = this
    if(typeof google !== 'undefined') vm.initMap()
    vm.load_vendor()
    let id = vm.$route.params.id
    if(typeof id !== 'undefined'){
       axios.get('api/device/' + id + '/')
        .then(response=>{
          let res = response.data
          vm.deviceName = res.name
          vm.location = res.location
          vm.lat = res.lat
          vm.lng = res.long
          vm.vendor_list.forEach(e=>{
            if(e.id === res.vendor_id){
              vm.selected = e
            }
          })
        })
        .catch(err=>{
          vm.LogErr(err)
        })
    }
  }
};
</script>

<style scoped>
div#map {
  height: 400px;
}
</style>
