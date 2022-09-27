<template>
  <div class="q-pa-md">
      <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-6 q-px-md">
              <div class="text-h6 q-pb-sm">Comercial</div>
              <q-card class="text-white bg-primary q-pa-md" style="height:80%; border-radius: 15px">
                <div class="row justify-between text-h6">
                    <div>Nombre: {{user.name}}</div>
                    <div>Código: {{user.codigo}}</div>
                </div>
                <div class="text-h6">DNI: {{user.dni}}</div>
                <div class="text-subtitle1">Teléfono 1: {{user.phone1}}</div>
                <div class="text-subtitle1">Teléfono 2: {{user.phone2}}</div>
                <div class="text-subtitle1">Email: {{user.email}}</div>
              </q-card>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 q-px-md">
              <div class="text-h6 q-pb-sm">Ventas</div>
              <q-card class="row items-center no-wrap" style="height:80%; border-radius: 15px">
                  <q-img src="image 64.png" style="width:250px; border-radius: 15px" />
                  <div>
                      <div class="text-h6">Cantidad de ventas</div>
                      <div class="text-primary text-h4 text-bold">{{cantidad}}</div>
                      <div class="text-h6">Total: <b class="text-green text-h4 text-bold">{{total}}</b></div>
                  </div>
              </q-card>
          </div>
      </div>

    <div class="row items-center q-pt-md">
      <div class="text-h6 cursor-pointer q-pr-sm" @click="filtrar(null), tab = null">Listado de Ventas</div>
      <div class="row q-gutter-sm">
            <q-input dense filled debounce="300" color="primary" v-model="filter" placeholder="Buscar venta">
            <template v-slot:after>
                <q-btn  color="primary" icon="search" />
            </template>
            </q-input>
        </div>
    </div>
    <div class="row q-pt-xs q-pb-md">
      <q-tabs
          v-model="tab"
          dense
          align="left"
          active-color="white"
          no-caps
          class="col-12"
        >
          <q-tab :name="item.val" :label="item.name"
          v-for="(item, index) in status" :key="index"
          @click="filtrar(item.val), tab = item.val" :class="tab === item.val ? 'bg-white text-red' : 'bg-primary text-white'" />
        </q-tabs>
    </div>

    <q-table
      :data="data"
      :columns="columns"
      row-key="name"
      :filter="filter"
      table-class="text-grey-9"
      table-header-class="text-black"
      no-data-label="No hay ventas registradas"
      no-results-label="No hay ventas"
    >
      <template v-slot:body-cell-type="props">
        <q-td :props="props">
          <div class="text-center">{{props.row.type === 1 ? 'Contrato Desokupa' : 'Contrato 365'}}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-valor="props">
        <q-td :props="props">
          <div class="text-center">{{props.row.valor ? props.row.valor + ' ' : '---'}}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div class="row no-wrap items-center justify-center">
            <q-icon name="circle" size="sm" :color="props.row.status === 0 ? 'orange' : props.row.status === 1 ? 'blue' : props.row.status === 2 ? 'green' : props.row.status === 4 ? 'blue' : props.row.status === 5 ? 'yellow' : props.row.status === 6 ? 'blue' : props.row.status === 7 ? 'yellow' : props.row.status === 8 ? 'green' : 'red'" />
            <div>{{props.row.status === 0 ? 'Generado' : props.row.status === 1 ? 'Llenado' : props.row.status === 2 ? 'Aprobado' : props.row.status === 4 ? 'Disponible para Op' : props.row.status === 5 ? 'Asignado a OP' : props.row.status === 6 ? 'Disponible para Legal' : props.row.status === 7 ? 'Tomado por Legal' : props.row.status === 8 ? 'Finalizado' : 'Rechazado'}}</div>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-opcion="props">
        <q-td :props="props">
          <div class="row no-wrap justify-center q-gutter-xs">
            <q-btn v-if="props.row.status > 0" label="Ver" icon="visibility" color="orange" size="sm" dense rounded push no-wrap style="width:90px"
            @click="$router.push('/contrato/' + props.row._id)"/>
          </div>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      filterSelec: null,
      tab: null,
      url: '',
      filter: '',
      cantidad: 0,
      total: 0,
      user: {},
      dataFormulario: {},
      allData: [],
      data: [],
      status: [
        { val: 0, name: 'Generados' },
        { val: 2, name: 'Aprobados' },
        { val: 3, name: 'Rechazados' },
        { val: 4, name: 'Disponible para Op' },
        { val: 5, name: 'Asignado a Op' },
        { val: 6, name: 'Disponible para Legal' },
        { val: 7, name: 'Tomado por Legal' },
        { val: 8, name: 'Finalizados' }
      ],
      columns: [
        { name: 'numero', label: 'Número', align: 'left', field: 'numero', sortable: true },
        { name: 'type', label: 'Tipo', align: 'center', field: 'type' },
        { name: 'pagoInfo', label: 'Forma de pago', align: 'center', field: 'pagoInfo' },
        { name: 'valor', label: 'Valor', align: 'center', field: 'valor' },
        { name: 'status', label: 'Estado', align: 'center', field: 'status' },
        { name: 'opcion', label: 'Opciones', align: 'center', field: 'opcion' }
      ]
    }
  },
  mounted () {
    this.getUser()
    this.getVentas()
  },
  methods: {
    async getUser () {
      await this.$api.get('user_by_id/' + this.$route.params.id).then(res => {
        if (res) {
          this.user = res
        }
      })
    },
    getVentas () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api.get('contratos_by_user/' + this.$route.params.id).then(res => {
        if (res) {
          this.allData = res
          this.data = this.allData
          for (let i = 0; i < res.length; i++) {
            if (res[i].status === 2) {
              this.cantidad = this.cantidad + 1
              this.total = this.total + res[i].valor
            }
          }
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    filtrar (val) {
      if (val !== null) {
        this.data = this.allData.filter(v => v.status === val)
      } else {
        this.data = this.allData
      }
    }
  }
}
</script>
