import Vue from 'vue'
import Router from 'vue-router'

// Containers
const DefaultContainer = () => import('@/containers/DefaultContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')

// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')
const Register = () => import('@/views/pages/Register')

// Devices
const Devices = () => import('@/views/devices/Devices')

// Add Devices
const Device = () => import('@/views/pages/Device')

// Control
const Control = () => import('@/views/pages/Control')

// Setting
const Setting = () => import('@/views/pages/Setting')

Vue.use(Router)

export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: DefaultContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'devices',
          meta: { label: 'Devices'},
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '',
              component: Devices,
            },
            {
              path: ':id',
              meta: { label: 'Device Details'},
              name: 'Device',
              component: Device,
              props: true
            },
          ]
        },
        {
          path: 'device',
          meta: { label: 'Device'},
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '',
              meta: { label: 'Add Device'},
              name: 'Add Device',
              component: Device,
            },
            {
              path: ':id',
              meta: { label: 'Update Device'},
              name: 'Update Device',
              component: Device,
            },
          ]
        },
        {
          path: 'control',
          meta: { label: 'Control'},
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '',
              component: Control,
            }
          ]
        },
        {
          path: 'setting',
          meta: { label: 'Setting'},
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '',
              component: Setting,
            }
          ]
        },
      ]
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500
        },
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'register',
          name: 'Register',
          component: Register
        }
      ]
    }
  ]
})
