<template>
<div id="map"></div>
</template>

<script>
export default {
  name: 'Gmap',
  props: {
  },
  data: () => {
    return {
      labels: 'KS-01'
    }
  },
  created() {
    // let map_script = document.createElement('script')
    // // Replace the value of the key parameter with your own API key.
    // map_script.setAttribute('src', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDgJDQH2ZZLe1QfRL3xbTM_pelGyENJHi8')
    // document.head.appendChild(map_script)
  },
  computed: {
  },
  methods: {
    addMarker(location, map, _label=null) {
      // Add the marker at the clicked location, and add the next-available label
      // from the array of alphabetical characters.
      var marker = new google.maps.Marker({
        position: location,
        label: _label == null ? prompt('Enter Location Name','KS-') : _label,
        map: map
      });
    }

  },
  mounted() {
    var vm = this;
    var map_center = { lat: -6.229728, lng: 106.6894306 };
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4.5,
      center: map_center
    });

    // This event listener calls addMarker() when the map is clicked.
    google.maps.event.addListener(map, 'click', function(event) {
      vm.addMarker(event.latLng, map);
      let lat = event.latLng.lat();
      let lng = event.latLng.lng();
    });

    // Add a marker at the center of the map.
    vm.addMarker(map_center, map, 'KS-01');
    console.log('gmap mounted!!')
  }
}
</script>

<style scoped>
div#map {
  height: 400px;
}
</style>
