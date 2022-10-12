<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated class="bg-white q-py-sm">
      <div class="row justify-between text-grey-8 no-wrap">
        <div class="col-6 row items-center no-wrap">
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" color="grey-8" />
          <img src="logo.png" style="width:140px" />
        </div>
        <div class="col-6 q-px-sm justify-end row items-center no-wrap">
          <!-- <img src="avatar gris 1.png" style="width:50px" /> -->
          <div class="q-pl-sm q-pr-md col-xs-6 col-sm-auto">
            <div class="text-bold ellipsis">{{user.full_name}}</div>
            <div class="text-caption ellipsis">{{user.email}}</div>
          </div>
          <q-btn class="q-px-sm" label="Cerrar Sesión" no-caps outline color="primary" @click="cerrarSesion()"/>
        </div>
      </div>
    </q-header>
      <!-- :header-class="item.active ? 'bg-grey-9' : ''" -->
      <q-drawer
        v-model="drawer"
        show-if-above
        :width="210"
        :breakpoint="500"
        elevated
        class="text-white"
      >
        <q-scroll-area class="fit bg-primary">
          <q-list class="q-pt-md">
            <q-expansion-item
              v-for="(item, index) in menu"
              :key="index"
              dark
              clickable
              group="somegroup"
              expand-separator
              :icon="item.icon"
              :label="item.label"
              @click="item.items ? '' : ruta(item)"
            >
              <div v-for="(item2, index) in item.items" :key="index">
                <q-item clickable v-ripple @click="ruta(item2)"
                >
                  <q-item-section avatar>
                    <q-icon :name="item2.icon" />
                  </q-item-section>
                  <q-item-section>
                    {{ item2.label }}
                  </q-item-section>
                </q-item>
              </div>
            </q-expansion-item>
          </q-list>
        </q-scroll-area>
      <div class="text-white text-center absolute-bottom q-mb-sm">EICHE App v1.0</div>
      </q-drawer>

    <q-page-container>
      <div class="row justify-center q-mt-lg">
        <q-card class="bg-primary q-pa-lg row justify-between items-center" style="width: 97%">
          <div class="text-h5 text-white">{{selectedModule}}</div>
          <q-icon color="white" :name="icon" size="lg"/>
        </q-card>
      </div>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'MainLayout',
  data () {
    return {
      drawer: true,
      link: '',
      user: {},
      menu: [],
      selectedModule: '',
      icon: '',
      admin: [
        {
          icon: 'person_search',
          label: 'Módulo Cliente',
          items: [
            {
              icon: 'people',
              label: 'Nuevo cliente',
              ruta: '/registro/cliente'
            },
            {
              icon: 'supervisor_account',
              label: 'Listado de Clientes',
              ruta: '/clientes'
            }
            // {
            //   icon: 'business',
            //   label: 'Inmuebles',
            //   ruta: '/inmuebles'
            // }
          ]
        },
        {
          icon: 'payments',
          label: 'Administracion',
          items: [
            {
              icon: 'request_quote',
              label: 'Crear Presupuesto',
              ruta: '/crear/presupuestos'
            },
            {
              icon: 'receipt',
              label: 'lista de Presupuestos',
              ruta: '/presupuestos'
            },
            {
              icon: 'receipt',
              label: 'Lista de contratos',
              ruta: '/contratos_aprobados'
            },
            {
              icon: 'payments',
              label: 'Cobros',
              ruta: '/cobros'
            },
            {
              icon: 'money_off',
              label: 'Gastos',
              ruta: '/gastos'
            },
            {
              icon: 'format_list_bulleted',
              label: 'Historial',
              ruta: '/contabilidad'
            }
          ]
        },
        // {
        //   icon: 'format_align_left',
        //   label: 'Módulo Contratos',
        //   items: [
        //     {
        //       icon: 'format_list_bulleted',
        //       label: 'Todos los contratos',
        //       ruta: '/contratos_aprobados'
        //     }
        //   ]
        // },
        {
          icon: 'pending',
          label: 'Módulo Operativos',
          items: [
            {
              icon: 'format_list_bulleted',
              label: 'Todos los contratos',
              ruta: '/operativos'
            }
          ]
        },
        // {
        //   icon: 'request_quote',
        //   label: 'Módulo Contabilidad',
        //   items: [
        //     {
        //       icon: 'payments',
        //       label: 'Cobros',
        //       ruta: '/cobros'
        //     },
        //     {
        //       icon: 'money_off',
        //       label: 'Gastos',
        //       ruta: '/gastos'
        //     },
        //     {
        //       icon: 'format_list_bulleted',
        //       label: 'Historial',
        //       ruta: '/contabilidad'
        //     }
        //   ]
        // },
        // {
        //   icon: 'gavel',
        //   label: 'Módulo Juridico',
        //   items: [
        //     {
        //       icon: 'format_list_bulleted',
        //       label: 'Todos los contratos',
        //       ruta: '/juridicos'
        //     }
        //   ]
        // },
        // {
        //   icon: 'analytics',
        //   label: 'Módulo Analitica',
        //   items: [
        //     {
        //       icon: 'trending_up',
        //       label: 'Ventas',
        //       ruta: '/analiticas/ventas'
        //     },
        //     {
        //       icon: 'trending_down',
        //       label: 'Gastos',
        //       ruta: '/analiticas/gastos'
        //     }
        //   ]
        // },
        {
          icon: 'settings',
          label: 'Módulo Configuraciones',
          items: [
            {
              icon: 'people',
              label: 'Nuevo usuario',
              ruta: '/registro/usuario'
            },
            {
              icon: 'supervisor_account',
              label: 'Listado de usuarios',
              ruta: '/usuarios'
            },
            {
              icon: 'payment',
              label: 'Formas de pago',
              ruta: '/formas_de_pago'
            },
            {
              icon: 'add_shopping_cart',
              label: 'Nuevo Servicio',
              ruta: '/nuevo_servicio'
            },
            {
              icon: 'shopping_cart',
              label: 'Listado de servicios',
              ruta: '/lista_servicios'
            }
          ]
        }
      ],
      inmobiliaria: [
        {
          icon: 'dashboard',
          label: 'Inicio',
          ruta: '/inicio/inmobiliaria'
        },
        {
          icon: 'people',
          label: 'Módulo Comerciales',
          ruta: '/comerciales'
        }
      ],
      comercio: [
        {
          icon: 'request_quote',
          label: 'Presupuesto',
          items: [
            {
              icon: 'format_list_bulleted',
              label: 'Todos los presupuestos',
              ruta: '/presupuestos'
            },
            {
              icon: '',
              label: 'Desokupa',
              ruta: '/presupuestos/desokupa'
            },
            {
              icon: '',
              label: '365',
              ruta: '/presupuestos/365'
            }
          ]
        },
        {
          icon: 'settings',
          label: 'Módulo Configuración',
          items: [
            {
              icon: 'people',
              label: 'Clientes',
              ruta: '/clientes'
            },
            {
              icon: 'business',
              label: 'Inmuebles',
              ruta: '/inmuebles'
            }
          ]
        }
      ],
      liderOp: [
        {
          icon: 'people',
          label: 'Módulo Operarios',
          ruta: '/operarios'
        },
        {
          icon: 'format_list_bulleted',
          label: 'Módulo Contratos',
          items: [
            {
              icon: 'format_list_bulleted',
              label: 'Contratos Disponibles',
              ruta: '/contratos_disponibles'
            },
            {
              icon: 'format_list_bulleted',
              label: 'Contratos Asignados',
              ruta: '/lider_contratos_asignados'
            }
          ]
        }
      ],
      operario: [
        {
          icon: 'format_list_bulleted',
          label: 'Módulo Contratos',
          items: [
            {
              icon: 'format_list_bulleted',
              label: 'Contratos Asignados',
              ruta: '/contratos_asignados'
            },
            {
              icon: 'format_list_bulleted',
              label: 'Todos mis contratos',
              ruta: '/operario_mis_contratos'
            }
          ]
        }
      ],
      legal: [
        {
          icon: 'format_list_bulleted',
          label: 'Módulo Contratos',
          items: [
            {
              icon: 'format_list_bulleted',
              label: 'Contratos Disponibles',
              ruta: '/legal/contratos_disponibles'
            },
            {
              icon: 'playlist_add',
              label: 'Contratos Tomados',
              ruta: '/contratos_tomados'
            },
            {
              icon: 'format_list_bulleted',
              label: 'Todos Mis Contratos',
              ruta: '/legal_mis_contratos'
            }
          ]
        }
      ]
    }
  },
  mounted () {
    const value = localStorage.getItem('TRI_SESSION_INFO')
    if (value) {
      this.getUser()
    }
  },
  updated () {
    this.init()
  },
  watch: {
    window: function (val) {
      console.log('window >> ', window)
      if (val.onbeforeunload) {
        console.log('hola retro')
      }
    }
  },
  methods: {
    ...mapMutations('generals', ['logout']),
    cerrarSesion () {
      this.logout()
      this.$router.push('/login')
    },
    async getUser () {
      if (localStorage.TRI_SESSION_INFO) {
        await this.$api.get('user_logueado').then(v => {
          if (v) {
            this.user = v
            if (v.roles[0] === 0 || v.roles[0] === 1) {
              this.menu = this.admin
            } else if (v.roles[0] === 2) {
              this.menu = this.inmobiliaria
            } else if (v.roles[0] === 3) {
              this.menu = this.liderOp
            } else if (v.roles[0] === 4) {
              this.menu = this.legal
            } else if (v.roles[0] === 5) {
              this.menu = this.operario
            } else if (v.roles[0] === 6) {
              this.menu = this.comercio
            }
          }
        })
      }
    },
    ruta (itm) {
      if (itm) {
        this.$router.push(itm.ruta)
        for (const i in this.menu) {
          if (this.menu[i].items !== undefined) {
            for (const j in this.menu[i].items) {
              if (itm.ruta === this.menu[i].items[j].ruta) {
                this.selectedModule = this.menu[i].label
                this.icon = this.menu[i].icon
              }
            }
          } else {
            if (itm.ruta === this.menu[i].ruta) {
              this.selectedModule = this.menu[i].label
              this.icon = this.menu[i].icon
            }
          }
        }
      }
    },
    init () {
      for (const i in this.menu) {
        if (this.menu[i].items !== undefined) {
          for (const j in this.menu[i].items) {
            if (this.$route.path === this.menu[i].items[j].ruta) {
              this.selectedModule = this.menu[i].label
              this.icon = this.menu[i].icon
            } else if (this.$route.path === '/inicio/administrador') {
              this.selectedModule = 'Administrador'
              this.icon = 'home'
            }
          }
        } else {
          if (this.$route.path === this.menu[i].ruta) {
            this.selectedModule = this.menu[i].label
            this.icon = this.menu[i].icon
          } else if (this.$route.path === '/inicio/administrador') {
            this.selectedModule = 'Administrador'
            this.icon = 'home'
          }
        }
      }
    }
  }
}
</script>

<style lang="sass">
.my-menu-link
  color: white
  background: #F2C037
</style>
