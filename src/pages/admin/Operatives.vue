<template>
  <div class="q-pa-md">
    <div>
      <div class="text-h5 text-grey-10 text-weight-medium cursor-pointer" @click="filtrar(null), tab = null">Listado de operativos disponibles</div>
      <div class="text-grey-9">
        {{`En la siguiente tabla puedes ver todos los contratos disponibles para ser asignacion a un operativo.`}}
      </div>
    </div>

    <div class="row justify-end items-center q-py-md">
      <div>
        <div class="row items-center">
          <div class="q-mr-sm text-weight-regular text-grey-10">Puedes filtar todas las columnas con un mismo filtro.</div>
          <q-input dense filled debounce="300" color="primary" v-model="filter" placeholder="Buscar contrato">
            <template v-slot:after>
              <q-btn  color="primary" icon="search" />
            </template>
          </q-input>
        </div>
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
      no-data-label="No hay contratos"
      no-results-label="No hay contratos"
    >
      <template v-slot:body-cell-type="props">
        <q-td :props="props">
          <div class="text-center">{{props.row.type === 1 ? 'Contrato Desokupa' : 'Contrato 365'}}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-valor="props">
        <q-td :props="props">
          <div class="text-center">{{props.row.valor ? props.row.valor + '€' : '---'}}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div class="row no-wrap items-center justify-center">
            <q-icon name="circle" size="sm" :color="props.row.status === 2 ? 'green' : props.row.status === 4 ? 'blue' : props.row.status === 5 ? 'yellow' : props.row.status === 6 ? 'blue' : props.row.status === 7 ? 'yellow' : 'green'" />
            <div>{{props.row.status === 2 ? 'Aprobado' : props.row.status === 4 ? 'Disponible para Op' : props.row.status === 5 ? 'Asignado a Op' : props.row.status === 6 ? 'Disponible para Legal' : props.row.status === 7 ? 'Tomado por Legal' :  'Finalizado'}}</div>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-opcion="props">
        <q-td :props="props">
          <div class="row no-wrap justify-center q-gutter-xs">
            <q-btn label="Ver" icon="visibility" color="orange" size="sm" dense rounded push no-wrap style="width:90px"
            @click="$router.push('/contrato/' + props.row._id)"/>
            <q-btn v-if="props.row.status === 2" label="Disponible" icon="done" color="green" size="sm" dense rounded push no-wrap style="width:90px"
            @click="cambiar(props.row)"/>
            <q-btn label="Subir Documento" icon="upload_file" color="grey-8" size="sm" dense rounded push no-wrap style="width:130px"
            @click="otherAdjunto(props.row)"/>
            <q-btn label="PDF" icon="picture_as_pdf" color="brown" size="sm" dense rounded push no-wrap style="width:90px"
            @click="generarPdf(props.row)"/>
            <q-btn v-if="props.row.type === 1" label="Valor" icon="euro" color="primary" size="sm" dense rounded push no-wrap style="width:90px"
            @click="generarValor(props.row)"/>
            <q-btn v-if="props.row.status !== 8" label="Generar gasto" icon="money_off" color="red" size="sm" dense rounded push no-wrap style="width:110px"
            @click="setExpenseShow(props.row)"/>
          </div>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="newValor">
      <q-card class="q-pa-none" style="width:100%">
        <div class="row justify-between q-pa-sm bg-primary" style="width:100%">
          <img src="desocupa 1.png" style="width:150px" />
          <q-btn round flat color="white" icon="clear" v-close-popup />
        </div>
        <div class="text-grey-8 text-center text-h5 q-mt-md">Valor del contrato</div>
        <div class="q-px-lg q-pb-xl">
          <div>
            Valor
            <q-input type="number" outlined v-model.number="valor" dense placeholder="Ingrese el valor"
            error-message="Este campo es requerido" :error="$v.valor.$error" @blur="$v.valor.$touch()"/>
          </div>
          <q-btn style="width:100%" no-caps label="Guardar" color="primary" size="lg"
          @click="saveValor()" />
        </div>
      </q-card>
    </q-dialog>

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
          <q-btn style="width:100%" no-caps label="Generar" color="primary" size="lg"
          @click="generar()" />
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="newDocument">
      <q-card class="q-pa-none" style="width:100%">
        <div class="row justify-between q-pa-sm bg-primary" style="width:100%">
          <img src="desocupa 1.png" style="width:150px" />
          <q-btn round flat color="white" icon="clear" v-close-popup />
        </div>
        <div class="text-grey-8 text-center text-h5 q-mt-md">Añadir Archivo</div>
        <div class="q-px-lg q-pb-xl">
          <div>
            Nombre del Archivo
            <q-input outlined v-model="title"  dense placeholder="Ingrese el nombre del archivo"
            error-message="Este campo es requerido" :error="$v.title.$error" @blur="$v.title.$touch()"/>
          </div>
          <div>
            <div class="row items-center q-pb-md">
              <div class="q-pr-md">Archivo</div>
              <q-file dense outlined v-model="documento" label="Selecciona un archivo" accept=".pdf"
              error-message="Este campo es requerido" :error="$v.documento.$error" @blur="$v.documento.$touch()">
                <template v-slot:prepend>
                  <q-icon class="cursor-pointer" name="folder" color="primary" />
                </template>
              </q-file>
            </div>
          </div>
          <q-btn style="width:100%" no-caps label="Guardar" color="primary" size="lg"
          @click="addDocument()" />
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
import { openURL } from 'quasar'
import env from '../../env'
export default {
  data () {
    return {
      newHito: false,
      newDocument: false,
      newValor: false,
      show: false,
      adjunto: null,
      documento: null,
      tab: null,
      valor: null,
      filter: '',
      title: '',
      baseu: '',
      form: {},
      contract: {},
      form2: {},
      dataFormulario: {},
      allData: [],
      data: [],
      status: [
        { val: 4, name: 'Disponible para Operaciones' },
        { val: 5, name: 'Asignado a Operaciones' }
      ],
      columns: [
        { name: 'numero', label: 'Número', align: 'left', field: 'numero', sortable: true },
        { name: 'inmobiliaria', label: 'Inmobiliaria', align: 'center', field: 'inmobiliaria', sortable: true },
        { name: 'comercial', label: 'Comercial', align: 'center', field: 'comercial', sortable: true },
        { name: 'clientName', label: 'Cliente', align: 'center', field: 'clientName', sortable: true },
        { name: 'adminName', label: 'Creado por', align: 'center', field: 'adminName', sortable: true },
        { name: 'type', label: 'Tipo', align: 'center', field: 'type' },
        { name: 'pagoInfo', label: 'Forma de pago', align: 'center', field: 'pagoInfo' },
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
    },
    title: { required },
    documento: { required },
    valor: { required },
    form2: {
      amount: { required },
      description: { required, maxLength: maxLength(256), minLength: minLength(6) }
    }
  },
  mounted () {
    this.baseu = env.apiUrl + 'pdf_file/'
    this.getContratos()
  },
  methods: {
    getContratos () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.comercios = []
      this.$api.post('contratos_by_status', { status: [4, 5] }).then(res => {
        if (res) {
          this.allData = res
          this.data = this.allData
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
    },
    generarValor (data) {
      this.dataFormulario = data
      this.valor = data.valor
      this.$v.valor.$reset()
      this.newValor = true
    },
    cambiar (data) {
      this.dataFormulario = data
      this.adjunto = null
      this.form = {}
      this.$v.form.$reset()
      this.newHito = true
    },
    otherAdjunto (data) {
      this.dataFormulario = data
      this.title = ''
      this.$v.title.$reset()
      this.documento = null
      this.$v.documento.$reset()
      this.newDocument = true
    },
    saveValor () {
      this.$v.valor.$touch()
      if (!this.$v.valor.$error) {
        this.$q.loading.show({
          message: 'Guardando valor...'
        })
        this.$api.put('status_contrato/' + this.dataFormulario._id, { valor: this.valor }).then(v => {
          if (v) {
            this.getContratos()
            this.newValor = false
            this.$q.notify({
              message: 'Valor guardado con éxito',
              color: 'positive'
            })
            this.$q.loading.hide()
          } else {
            this.$q.loading.hide()
          }
        })
      }
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
            this.$api.put('status_contrato/' + this.dataFormulario._id, { status: 4 }).then(v => {
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
    addDocument () {
      this.$v.documento.$touch()
      this.$v.title.$touch()
      if (!this.$v.documento.$error && !this.$v.title.$error) {
        this.$q.loading.show({
          message: 'Guardando archivo...'
        })
        var formData = new FormData()
        formData.append('file', this.documento)
        formData.append('dat', JSON.stringify(this.title))
        this.$api.post('subir_archivo/' + this.dataFormulario._id, formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          if (res) {
            this.newDocument = false
            this.$q.notify({
              message: 'Archivo agregado con éxito',
              color: 'positive'
            })
            this.$q.loading.hide()
          } else {
            this.$q.loading.hide()
          }
        })
      }
    },
    async generarPdf (data) {
      this.$q.loading.show({
        message: 'Generando PDF...'
      })
      var text = data.type === 2 ? 'generar_pdf_365' : 'generar_pdf_desokupa'
      await this.$api.post(text, data).then(res => {
        if (res) {
          var vm = this
          setTimeout(function () {
            openURL(vm.baseu + res)
            vm.$q.loading.hide()
          }, 5000)
        } else {
          this.$q.loading.hide()
        }
      })
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

<style lang="scss" scoped>
.button-subir {
  text-decoration: none;
  padding: 10px;
  font-weight: 540;
  font-size: 0px;
  color: white;
  background-color: $primary;
  border-radius: 100%;
  height:40px;
  width:40px;
  cursor: pointer;
}
</style>
