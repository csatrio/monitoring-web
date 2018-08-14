<template>
  <b-row>
    <b-col cols="12" lg="6">
      <b-card no-header>
        <template slot="header">
          Device id:  {{ $route.params.id }}
        </template>
        <b-table striped small fixed responsive="sm" :items="items($route.params.id)" :fields="fields">
          <template slot="value" slot-scope="data">
            <strong>{{data.item.value}}</strong>
          </template>
        </b-table>
        <template slot="footer">
          <b-button @click="goBack">Back</b-button>
        </template>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import deviceData from './DevicesData'
export default {
  name: 'Device',
  props: {
    caption: {
      type: String,
      default: 'Device id'
    },
  },
  data: () => {
    return {
      items: (id) => {
        const device = deviceData.find( device => device.id.toString() === id)
        const deviceDetails = device ? Object.entries(device) : [['id', 'Not found']]
        return deviceDetails.map(([key, value]) => {return {key: key, value: value}})
      },
      fields: [
        {key: 'key'},
        {key: 'value'},
      ],
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
      // this.$router.replace({path: '/devices'})
    }
  }
}
</script>
