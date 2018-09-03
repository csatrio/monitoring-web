<template>
  <div class="animated fadeIn">
    <b-card>
      <b-row>
        <b-col sm="5">
          <h4 id="traffic" class="card-title mb-0">KS-Location</h4>
          <div class="small text-muted">{{new Date().toLocaleDateString()}}</div>
        </b-col>
        <b-col sm="7" class="d-none d-md-block">
          <b-button type="button" variant="primary" class="float-right"><i class="icon-cloud-download"></i></b-button>
          <b-button-toolbar class="float-right" aria-label="Toolbar with buttons group">
            <b-form-radio-group class="mr-3" id="radiosBtn" buttons button-variant="outline-secondary" v-model="selected" name="radiosBtn">
              <b-form-radio class="mx-0" value="Day">Day</b-form-radio>
              <b-form-radio class="mx-0" value="Month">Month</b-form-radio>
              <b-form-radio class="mx-0" value="Year">Year</b-form-radio>
            </b-form-radio-group>
          </b-button-toolbar>
        </b-col>
      </b-row>
      <Gmap ref="dashboard_map"></Gmap>
      <div slot="footer">
        <b-row class="text-center">
          <b-col class="mb-sm-2 mb-0">
            <div class="text-muted">Uptime</div>
            <strong>90%</strong>
            <b-progress height={} class="progress-xs mt-2" :precision="1" variant="success" :value="99"></b-progress>
          </b-col>
          <b-col class="mb-sm-2 mb-0">
            <div class="text-muted">Downtime</div>
            <strong>10%</strong>
            <b-progress height={} class="progress-xs mt-2" :precision="1" variant="danger" :value="10"></b-progress>
          </b-col>
          <b-col class="mb-sm-2 mb-0">
            <div class="text-muted">Average Downtime Hours</div>
            <strong>1/24 (4%)</strong>
            <b-progress height={} class="progress-xs mt-2" :precision="1" variant="warning" :value="4"></b-progress>
          </b-col>
        </b-row>
      </div>
    </b-card>
    
    <b-row>
      <b-col md="12">
        <b-card header="Info Per Titik">
          <b-row>
            <b-col sm="12" lg="8">
              <b-row>
                <b-col sm="6" lg="6">
                  <Callout variant="info">
                    <small class="text-muted">Uptime</small><br>
                    <strong class="h4">9,123</strong>
                    <div class="chart-wrapper" :style="{ top: '-10px'}">
                      <!--<callout-chart-example :data="[35, 23, 56, 22, 97, 23, 64]" variant="#20a8d8" width="80" height="30" />-->
                      <callout-chart-example chartId="callout-chart-01" :data="[35, 23, 56, 22, 97, 23, 64]" variant="info" width="80" height="30" />
                    </div>
                  </Callout>
                </b-col>
                <b-col sm="6" lg="6">
                  <Callout variant="danger">
                    <small class="text-muted">Downtime</small><br>
                    <strong class="h4">22,643</strong>
                    <div class="chart-wrapper" :style="{ top: '-10px'}">
                      <callout-chart-example chartId="callout-chart-02" :data="[65, 59, 84, 84, 51, 55, 40]" variant="danger" width="80" height="30" />
                    </div>
                  </Callout>
                </b-col>
              </b-row>
            </b-col>
          </b-row>

          <hr class="mt-0"><br/>

          <b-row>
            <b-col>
              <template v-for="device in device_list">
                <div class="progress-group mb-4">
                  <div class="progress-group-prepend">
                    <span class="progress-group-text">
                      {{device.name}}
                    </span>
                    <b-badge :variant="getBadge(device.status)">{{device.status === 'Active' ? 'Active' : 'Down'}}</b-badge>
                  </div>
                  <div class="progress-group-bars">
                    <b-progress class="progress-xs" variant="info" :value="90" height={} />
                    <b-progress class="progress-xs" variant="danger" :value="10" height={} />
                  </div>
                </div>
              </template>
            </b-col>
          </b-row>

          <br/>

          <b-row>
            <b-col>
              <div class="legend text-center">
                <small>
                  <sup><b-badge pill variant="info">&nbsp;</b-badge></sup>
                  Uptime
                  &nbsp;&nbsp;
                  <sup><b-badge pill variant="danger">&nbsp;</b-badge></sup>
                  Downtime
                </small>
              </div>
            </b-col>
          </b-row>

        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
const axios = require('axios')
const WebSocket = require('isomorphic-ws');

import CalloutChartExample from './dashboard/CalloutChartExample'
import { Callout } from '@coreui/vue'
import Gmap from './components/Gmap'

export default {
  name: 'dashboard',
  components: {
    Callout,
    CalloutChartExample,
    Gmap
  },
  data: function () {
    return {
      device_list: [], 
      selected: 'Month',
    }
  },
  methods: {
    getBadge (status) {
      return status === 'Active' ? 'success' : 'danger'
    },
    variant (value) {
      let $variant
      if (value <= 25) {
        $variant = 'info'
      } else if (value > 25 && value <= 50) {
        $variant = 'success'
      } else if (value > 50 && value <= 75) {
        $variant = 'warning'
      } else if (value > 75 && value <= 100) {
        $variant = 'danger'
      }
      return $variant
    },
    flag (value) {
      return 'flag-icon flag-icon-' + value
    },
    loadList(){
      var vm = this
      vm.device_list.length = 0
      axios.get('api/device/')
        .then(response=>{
          response.data.data.forEach(e=>{
            vm.device_list.push(e)
          })
        })
        .catch(err=>{
          vm.LogErr(err)
        })
    }
  },
  mounted () {
    var vm = this
    vm.loadList()
    const ws = new WebSocket('ws://localhost:7000')
    ws.onopen = function open() {
      console.log('connected');
    }
    ws.onclose = function close() {
      console.log('disconnected');
    }
    ws.onmessage = function incoming(msg) {
      let data = JSON.parse(msg.data)
      if(typeof data.deviceid !== 'undefined'){
        console.log(msg.data)
        let deviceid = Number(data.deviceid)
        let status = data.status

        // update device
        for(var i=0; i<vm.device_list.length; i++){
          let d = vm.device_list[i]
          if(deviceid === d.id){
            d.status = status
          }
        }
        
        // update map
        vm.$refs.dashboard_map.changeMarker(deviceid, status)
      }
    }
  },
}
</script>

<style>
  /* IE fix */
  #card-chart-01, #card-chart-02 {
    width: 100% !important;
  }
</style>
