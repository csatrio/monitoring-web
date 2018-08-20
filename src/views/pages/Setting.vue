<template>
  <b-row>
    <b-col cols="12" xl="6">
      <transition name="slide">
      <b-card :header="caption">
        <b-table :hover="hover" :striped="striped" :bordered="bordered" :small="small" :fixed="fixed" responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" @row-clicked="rowClicked">
          <template slot="id" slot-scope="data">
            <strong>{{data.item.id}}</strong>
          </template>
          <template slot="name" slot-scope="data">
            <strong>{{data.item.name}}</strong>
          </template>
          <template slot="status" slot-scope="data">
            <b-badge :variant="getBadge(data.item.status)">{{data.item.status === 'Active' ? 'Active' : 'Down'}}</b-badge>
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
  name: 'Setting',
  props: {
    caption: {
      type: String,
      default: 'Setting'
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
        {key: 'name', sortable: true},
        {key: 'location'},
        {key: 'vendor'},
        {key: 'status'},
      ],
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
    }
  },
  computed: {
  },
  methods: {
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
      const deviceLink = this.deviceLink(item.id)
      this.$router.push({path: deviceLink})
    },
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
