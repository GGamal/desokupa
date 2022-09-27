<template>
  <div class="q-pa-md">
    <div class="row justify-between items-center q-py-md">
      <div class="text-h6 cursor-pointer">Lista de Contratos Disponibles</div>
      <div class="row">
        <q-input dense filled debounce="300" color="primary" v-model="filter" placeholder="Buscar contrato">
          <template v-slot:after>
            <q-btn  color="primary" icon="search" />
          </template>
        </q-input>
      </div>
    </div>

    <q-table
      :data="data"
      :columns="columns"
      row-key="name"
      :filter="filter"
      table-class="text-grey-9"
      table-header-class="text-black"
      no-data-label="No hay contratos disponibles"
      no-results-label="No hay contratos disponibles"
    >
      <template v-slot:body-cell-valor="props">
        <q-td :props="props">
          <div class="text-center">{{props.row.valor ? props.row.valor + '€' : '---'}}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div class="row no-wrap items-center justify-center">
            <q-icon name="circle" size="sm" :color="props.row.status === 6 ? 'blue' : ''" />
            <div>{{props.row.status === 6 ? 'Disponible' : ''}}</div>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-opcion="props">
        <q-td :props="props">
          <div class="row no-wrap justify-center q-gutter-xs">
            <q-btn label="Ver" icon="visibility" color="orange" size="sm" dense rounded push no-wrap style="width:90px"
            @click="$router.push('/contrato/' + props.row._id)"/>
            <q-btn label="Tomar" icon="flag" color="blue" size="sm" dense rounded push no-wrap style="width:90px"
            @click="asignar(props.row)"/>
          </div>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="newHito">
      <q-card class="q-pa-none" style="width:100%">
        <div class="row justify-between q-pa-sm bg-primary" style="width:100%">
          <img src="desocupa 1.png" style="width:150px" />
          <q-btn round flat color="white" icon="clear" v-close-popup />
        </div>
        <div class="text-grey-8 text-center text-h5 q-mt-md">Generar Tarea</div>
        <div class="q-px-lg q-pb-xl">
          <div>
            Nombre de la tarea
            <q-input outlined v-model="form.titulo"  dense placeholder="Ingrese el título"
            error-message="Este campo es requerido" :error="$v.form.titulo.$error" @blur="$v.form.titulo.$touch()"/>
          </div>
          <div>
            Descripción
            <q-input type="textarea" outlined v-model="form.coment" dense
            error-message="Este campo es requerido" :error="$v.form.coment.$error" @blur="$v.form.coment.$touch()"/>
          </div>
          <div>
            <div class="row items-center q-pb-md">
              <div class="q-pr-md">Archivo</div>
              <q-file dense outlined v-model="adjunto" label="Selecciona un archivo" accept=".pdf">
                <template v-slot:prepend>
                  <q-icon class="cursor-pointer" name="folder" color="primary" />
                </template>
              </q-file>
            </div>
          </div>
          <q-btn style="width:100%" no-caps label="Tomar contrato" color="primary" size="lg"
          @click="generar()" />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      newHito: false,
      adjunto: null,
      filter: '',
      user: {},
      form: {},
      dataFormulario: {},
      allData: [],
      data: [],
      columns: [
        { name: 'numero', label: 'Número', align: 'left', field: 'numero', sortable: true },
        { name: 'inmobiliaria', label: 'Inmobiliaria', align: 'center', field: 'inmobiliaria', sortable: true },
        { name: 'comercial', label: 'Comercial', align: 'center', field: 'comercial', sortable: true },
        { name: 'clientName', label: 'Cliente', align: 'center', field: 'clientName', sortable: true },
        { name: 'adminName', label: 'Creado por', align: 'center', field: 'adminName', sortable: true },
        { name: 'valor', label: 'Valor', align: 'center', field: 'valor' },
        { name: 'status', label: 'Estado', align: 'center', field: 'status' },
        { name: 'date', label: 'Fecha de Creación', align: 'center', field: 'date' },
        { name: 'opcion', label: 'Opciones', align: 'center', field: 'opcion' }
      ]
    }
  },
  validations: {
    form: {
      titulo: { required },
      coment: { required }
    }
  },
  mounted () {
    this.getUser()
    this.getContratos()
  },
  methods: {
    getUser () {
      this.$api.get('user_logueado').then(v => {
        if (v) {
          this.user = v
        }
      })
    },
    getContratos () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.comercios = []
      this.$api.post('contratos_by_status', { status: [6] }).then(res => {
        if (res) {
          this.allData = res
          this.data = this.allData
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    asignar (data) {
      this.dataFormulario = data
      this.adjunto = null
      this.form = {}
      this.$v.form.$reset()
      this.newHito = true
    },
    generar () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Generando Tarea...'
        })
        this.form.contrato_id = this.dataFormulario._id
        var formData = new FormData()
        if (this.adjunto) {
          this.form.img = true
          formData.append('file', this.adjunto)
        } else {
          this.form.img = false
        }
        formData.append('dat', JSON.stringify(this.form))
        this.$api.post('generar_hito', formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          if (res) {
            this.$api.put('status_contrato/' + this.dataFormulario._id, { legal_id: this.user._id, status: 7 }).then(v => {
              if (v) {
                this.getContratos()
                this.newHito = false
                this.$q.notify({
                  message: 'Tarea generada con éxito',
                  color: 'positive'
                })
                this.$q.loading.hide()
              } else {
                this.$q.loading.hide()
              }
            })
          } else {
            this.$q.loading.hide()
          }
        })
      }
    }
  }
}
</script>
