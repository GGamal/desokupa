<template>
  <div class="q-pa-md">
    <div class="row justify-between items-center q-py-md">
      <div class="text-h6 cursor-pointer">Lista de Contratos Tomados</div>
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
      no-data-label="No hay contratos tomados"
      no-results-label="No hay contratos tomados"
    >
      <template v-slot:body-cell-valor="props">
        <q-td :props="props">
          <div class="text-center">{{props.row.valor ? props.row.valor + '€' : '---'}}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div class="row no-wrap items-center justify-center">
            <q-icon name="circle" size="sm" :color="props.row.status === 7 ? 'yellow' : ''" />
            <div>{{props.row.status === 7 ? 'Tomado por legal' : ''}}</div>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-opcion="props">
        <q-td :props="props">
          <div class="row no-wrap justify-center q-gutter-xs">
            <q-btn label="Ver" icon="visibility" color="orange" size="sm" dense rounded push no-wrap style="width:90px"
            @click="$router.push('/contrato/' + props.row._id)"/>
            <q-btn v-if="props.row.status === 7" label="Operario" icon="flag" color="blue" size="sm" dense rounded push no-wrap style="width:90px"
            @click="cambiar(false, props.row)"/>
            <q-btn label="Generar gasto" icon="money_off" color="red" size="sm" dense rounded push no-wrap style="width:110px"
            @click="setExpenseShow(props.row)"/>
            <q-btn v-if="props.row.status === 7" label="Finalizar" color="green" size="sm" dense rounded push no-wrap style="width:90px"
            @click="cambiar(true, props.row)"/>
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
          <q-btn style="width:100%" no-caps :label="status === 5 ? 'Asignar operario' : 'Finalizar contrato'" color="primary" size="lg"
          @click="generar()" />
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="show">
      <q-card class="q-pa-none" style="width:100%">
        <div class="row justify-between q-pa-sm bg-primary" style="width:100%">
          <img src="desocupa 1.png" style="width:150px" />
          <q-btn round flat color="white" icon="clear" v-close-popup />
        </div>
        <div class="text-grey-8 text-center text-h5 q-my-md">Generar Gasto</div>
        <div class="q-px-lg q-pb-xl">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Monto del gasto
            <q-input min="0" prefix="€" outlined type="number" v-model.number="form2.amount" dense placeholder="Ingrese el monto"
            error-message="Este campo es requerido" :error="$v.form2.amount.$error" @blur="$v.form2.amount.$touch()" style="width:100%"/>
            <q-input outlined type="textarea" v-model="form2.description" dense placeholder="Ingrese una breve descripción del gasto"
            error-message="Este campo es requerido" :error="$v.form2.description.$error" @blur="$v.form2.description.$touch()" style="width:100%"/>
          </div>
          <q-btn style="width:100%" no-caps label="Guardar" color="primary" size="lg"
          @click="setExpense()"/>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      newHito: false,
      adjunto: null,
      status: null,
      filter: '',
      form: {},
      form2: {},
      contract: {},
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
      ],
      show: false
    }
  },
  validations: {
    form: {
      titulo: { required },
      coment: { required }
    },
    form2: {
      amount: { required },
      description: { required, maxLength: maxLength(256), minLength: minLength(6) }
    }
  },
  mounted () {
    this.getContratos()
  },
  methods: {
    getContratos () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.comercios = []
      this.$api.get('contratos_asignados_legal').then(res => {
        if (res) {
          this.allData = res
          this.data = this.allData
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    cambiar (bool, data) {
      if (bool) {
        this.status = 8
      } else {
        this.status = 5
      }
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
            this.$api.put('status_contrato/' + this.dataFormulario._id, { status: this.status }).then(v => {
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
    },
    setExpenseShow (data) {
      this.contract = { ...data }
      this.show = true
    },
    setExpense () {
      this.$v.form2.$touch()
      if (!this.$v.form2.$error) {
        this.$q.loading.show({
          message: 'Guardando datos...'
        })
        this.form2.contract_id = this.contract._id
        this.$api.post('setExpense', this.form2).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Gasto realizado con éxito',
              color: 'positive'
            })
            this.$q.loading.hide()
            this.$v.$reset()
            this.form2 = {}
            this.show = false
          } else {
            this.$q.loading.hide()
          }
        })
      } else {
        this.$q.notify({
          message: 'Debe ingresar todos los datos requeridos',
          color: 'negative'
        })
      }
    }
  }
}
</script>
