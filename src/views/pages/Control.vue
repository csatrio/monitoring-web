<template>
  <b-row>
    <b-col cols="12" xl="6">
      <transition name="slide">
      <b-card :header="caption">
        <b-table :hover="hover" :striped="striped" :bordered="bordered" :small="small" :fixed="fixed" responsive="sm" 
          :items="itemProvider" :fields="fields" :current-page="currentPage" :per-page="perPage" @row-clicked="rowClicked">
          <template slot="id" slot-scope="data">
            <strong>{{data.item.id}}</strong>
          </template>
          <template slot="name" slot-scope="data">
            <strong>{{data.item.name}}</strong>
          </template>
          <template slot="status" slot-scope="data">
            <b-badge :variant="getBadge(data.item.status)">{{data.item.status === 'Active' ? 'Active' : 'Down'}}</b-badge>
          </template>
          <template slot="toggle-power" slot-scope="data">
            <b-button :variant="powerButtonVariant(data.item.status)" size="sm" @click="setPower(data.item)">{{powerButtonText(data.item.status)}}</b-button>
          </template>
        </b-table>
        <nav>
          <b-pagination size="sm" :total-rows="getRowCount(items)" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
        </nav>
      </b-card>
      </transition>
    </b-col>
  </b-row>
</template>

<script>
const axios = require('axios')
export default {
  name: 'Control',
  props: {
    caption: {
      type: String,
      default: 'Control'
    },
    hover: {
      type: Boolean,
      default: true
    },
    striped: {
      type: Boolean,
      default: true
    },
    bordered: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      items: [],
      fields: [
        {key: 'id'},
        {key: 'name', sortable:true},
        {key: 'location'},
        {key: 'vendor'},
        {key: 'status'},
        {key: 'toggle-power', label: 'Toggle Power'}
      ],
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      preventRowClick: false,
      filter: '',
    }
  },
  computed: {
  },
  methods: {
    powerButtonText (status) {
      return status === 'Active' ? 'Deactivate' : '-Activate-'
    },
    powerButtonVariant (status) {
      return status === 'Active' ? 'danger' : 'success'
    },
    getBadge (status) {
      return status === 'Active' ? 'success' : 'danger'
    },
    getRowCount (items) {
      return items.length
    },
    deviceLink (id) {
      return `device/${id.toString()}`
    },
    rowClicked (item) {
      if(this.preventRowClick){
        this.preventRowClick = false
        return
      }
      const deviceLink = this.deviceLink(item.id)
      this.$router.push({path: deviceLink})
    },
    setPower(item){
      this.preventRowClick = true
      let prefix = item.status === 'Active' ? 'Deactivating' : 'Activating'
      alert(prefix + ' power for : ' + item.name)
    },
    itemProvider(ctx){
      let _url = '/api/device/?page=' + ctx.currentPage + '&per_page=' + ctx.perPage
      if(ctx.sortBy !== null){
        let desc = ctx.sortDesc ? '-' : ''
         _url += '&ordering=' + desc + ctx.sortBy
      }
      let promise = axios.get(_url)
      this.Log(_url)
      // Must return a promise that resolves to an array of items
      return promise.then((response) => {
        // Pluck the array of items off our axios response
        let items = response.data.data
        // Must return an array of items or an empty array if an error occurred
        return(items || [])
      })
    }
  },
  mounted () {
    var vm = this
    axios.get('api/device/')
      .then(response=>{
        response.data.data.forEach(e=>{
          vm.items.push(e)
        })
      })
      .catch(err=>{
        vm.LogErr(err)
      })
  }
}
</script>

<style scoped>
.card-body >>> table > tbody > tr > td {
  cursor: pointer;
}
</style>
