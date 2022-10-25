<template>
  <div class="q-pa-md">
    <div>
      <div class="text-h5 text-grey-10 text-weight-medium">Listado de formas de pago</div>
      <div class="text-grey-9">
        {{`En la siguiente tabla puedes ver todas las formas de pago\n
        configuradas en el sistema. Esta información la utilizaremos\n
        para crear Presupuestos en el módulo Ventas. Recuerda\n
        que en la columna Acción puedes editar o eliminar un\n
        registro.`}}
      </div>
    </div>

    <div class="row justify-end items-center q-py-md">
      <div class="row q-gutter-sm">
        <div class="row items-center">
          <div class="q-mr-sm text-weight-regular text-grey-10">Puedes filtar todas las columnas con un mismo filtro.</div>
          <q-input dense filled debounce="300" color="primary" v-model="filter" placeholder="Buscar forma de pago">
            <template v-slot:after>
              <q-btn  color="primary" icon="search" />
            </template>
          </q-input>
        </div>
        <q-btn no-caps dense color="primary" label="Crear forma de pago" icon="add" class="q-ml-sm q-px-sm"
        @click="other(true)" />
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
          <q-tab :name="item.val" :label="item.val + ' cuotas'"
          v-for="(item, index) in cuotas" :key="index"
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
      no-data-label="No hay formas registradas"
      no-results-label="No hay formas"
      class="no-shadow"
      :pagination.sync="pagination"
    >
      <template v-slot:body-cell-cuota="props">
        <q-td :props="props">
          <div class="row justify-start q-gutter-xs">
            <div>{{props.row.cuota}} cuotas</div>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-opcion="props">
        <q-td :props="props">
          <div class="row no-wrap justify-start q-gutter-xs">
            <q-btn size="sm" icon="visibility" color="orange" dense rounded push no-wrap style="width:90px"
            @click="form = props.row, verForma = true"/>
            <q-btn size="sm" icon="edit" color="blue" dense rounded push no-wrap style="width:90px"
            @click="other(false, props.row)"/>
            <q-btn size="sm" icon="delete" color="negative" dense rounded push no-wrap style="width:90px"
            @click="eliminar(props.row)"/>
          </div>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialog">
      <q-card class="q-pa-none" style="width:100%">
        <div class="row justify-between q-pa-sm bg-primary" style="width:100%">
          <img src="logoblanco.png" style="width:150px" />
          <q-btn round flat color="white" icon="clear" v-close-popup />
        </div>
        <div class="text-grey-8 text-center text-h5 q-mt-md">Forma de pago</div>
        <div class="q-px-lg q-pb-xl">
          <div>
            Nombre
            <q-input type="tel" outlined v-model="form.name"  dense placeholder="Ingrese el nombre"
            error-message="Este campo es requerido" :error="$v.form.name.$error" @blur="$v.form.name.$touch()"/>
          </div>
          <div>
            Cantidad de cuotas
            <q-select outlined dense color="black" v-model="form.cuota" :options="cuotas" label="Seleccione la cantidad de cuotas" map-options
              error-message="Este campo es requerido" :error="$v.form.cuota.$error" @blur="$v.form.cuota.$touch()"
              option-label="val" option-value="val" emit-value @input="verify(form.cuota)">
            </q-select>
          </div>
          <div v-if="listo" class="row">
              <div v-for="(item, index) in valorCuotas" :key="index" class="col-6 q-pl-xs q-mb-md">
                    Cuota {{index + 1}}
                    <q-input type="number" outlined v-model.number="valorCuotas[index]" suffix="%" dense placeholder="Valor de la cuota"/>
              </div>
          </div>
          <q-btn style="width:100%" no-caps label="Guardar" color="primary" size="lg"
          @click="!edit ? guardar() : actualizar()" />
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="verForma">
      <q-card class="q-pa-none" style="width:100%">
        <div class="row justify-between q-pa-sm bg-primary" style="width:100%">
          <img src="logoblanco.png" style="width:150px" />
          <q-btn round flat color="white" icon="clear" v-close-popup />
        </div>
        <div class="text-grey-8 text-center text-h5 q-mt-md">Forma de pago</div>
        <div class="text-grey-9 text-center text-subtitle1 text-bold q-mb-md">{{form.name}}</div>
        <div class="row q-pb-md">
          <div v-for="(item, index) in form.valorCuotas" :key="index" class="col-6 q-px-sm q-mb-md">
            Cuota {{index + 1}}
            <q-field outlined dense stack-label suffix="%">
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{form.valorCuotas[index]}}</div>
              </template>
            </q-field>
          </div>
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
      dialog: false,
      listo: false,
      edit: false,
      verForma: false,
      tab: null,
      filter: '',
      form: {},
      valorCuotas: [],
      allData: [],
      data: [],
      cuotas: [
        { val: 1 },
        { val: 2 },
        { val: 3 },
        { val: 4 },
        { val: 5 },
        { val: 6 },
        { val: 7 },
        { val: 8 },
        { val: 9 },
        { val: 10 },
        { val: 11 },
        { val: 12 }
      ],
      columns: [
        { name: 'name', label: 'Nombre', align: 'left', field: 'name', sortable: true },
        { name: 'cuota', label: 'Cantidad de cuotas', align: 'left', field: 'cuota' },
        { name: 'opcion', label: 'Opciones', align: 'left', field: 'opcion' }
      ],
      pagination: {
        rowsPerPage: 50 // current rows per page being displayed
      }
    }
  },
  validations: {
    form: {
      name: { required },
      cuota: { required }
    }
  },
  mounted () {
    this.getFormasPago()
  },
  methods: {
    getFormasPago () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api.get('formas_pagos').then(res => {
        if (res) {
          this.allData = res
          this.data = this.allData
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    other (bool, data) {
      if (bool) {
        this.listo = false
        this.edit = false
        this.form = {}
        this.valorCuotas = []
        this.$v.form.$reset()
      } else {
        this.listo = true
        this.edit = true
        this.form = JSON.parse(JSON.stringify(data))
        this.valorCuotas = this.form.valorCuotas
      }
      this.dialog = true
    },
    verify (data) {
      this.valorCuotas = []
      /* const porcentaje = 100 / data */
      for (let i = 0; i < data; i++) {
        this.valorCuotas.push(0)
      }
      this.listo = true
    },
    guardar () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        var total = 0
        for (let i = 0; i < this.valorCuotas.length; i++) {
          total = total + this.valorCuotas[i]
        }
        if (total === 100) {
          this.$q.loading.show({
            message: 'Guardando forma de pago...'
          })
          this.form.valorCuotas = this.valorCuotas
          this.$api.post('nueva_forma_pago', this.form).then(res => {
            if (res) {
              this.dialog = false
              this.getFormasPago()
              this.$q.notify({
                message: 'Forma de pago guardada con éxito',
                color: 'positive'
              })
              this.$q.loading.hide()
            } else {
              this.$q.loading.hide()
            }
          })
        } else {
          this.$q.dialog({
            title: 'Atención',
            message: 'El total de los porcentajes debe ser el 100%',
            persistent: false
          }).onOk(() => {
            // volver
          })
        }
      }
    },
    actualizar () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        var total = 0
        for (let i = 0; i < this.valorCuotas.length; i++) {
          total = total + this.valorCuotas[i]
        }
        if (total === 100) {
          this.$q.loading.show({
            message: 'Actualizando forma de pago...'
          })
          this.form.valorCuotas = this.valorCuotas
          this.$api.put('editar_forma_pago/' + this.form._id, this.form).then(res => {
            if (res) {
              this.dialog = false
              this.getFormasPago()
              this.$q.notify({
                message: 'Forma de pago actualizada con éxito',
                color: 'positive'
              })
              this.$q.loading.hide()
            } else {
              this.$q.loading.hide()
            }
          })
        } else {
          this.$q.dialog({
            title: 'Atención',
            message: 'El total de los porcentajes debe ser el 100%',
            persistent: false
          }).onOk(() => {
            // volver
          })
        }
      }
    },
    eliminar (data) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar esta forma de pago?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.put('eliminar_forma_pago/' + data._id).then(res => {
          if (res) {
            this.getFormasPago()
          }
        })
      }).onCancel(() => {
        // Cancel
      })
    },
    filtrar (val) {
      if (val !== null) {
        this.data = this.allData.filter(v => v.cuota === val)
      } else {
        this.data = this.allData
      }
    }
  }
}
</script>
