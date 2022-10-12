<template>
  <div class="q-pa-md">
        <div class="row justify-between q-pa-sm bg-primary" style="width:100%">
          <img src="desocupa 1.png" style="width:150px" />
          <q-btn round flat color="white" icon="clear" v-close-popup />
        </div>
        <div class="text-grey-8 text-center text-h5 q-mt-md">Editar producto</div>
        <div class="q-px-lg q-pb-xl" >
          <div style="font-size: 18px;">
            Nombre
            <q-input type="tel" outlined v-model="form.name"  dense placeholder="Ingrese el nombre"
            error-message="Este campo es requerido" :error="$v.form.name.$error" @blur="$v.form.name.$touch()"/>
          </div>
          <div style="font-size: 18px;">
            Categoria
            <q-select outlined dense color="black" v-model="form.categoria" :options="categorias" label="Seleccione una categoria" map-options
              error-message="Este campo es requerido" :error="$v.form.categoria.$error" @blur="$v.form.categoria.$touch()"
              option-label="name" option-value="name" emit-value>
            </q-select>
          </div>
          <div class="row justify-center" style="font-size: 18px;">
            Subcategoria
          </div>
          <div class="row justify-center">
            <q-checkbox size="150px" v-model="form.subdevapps" val="150px" label="Dev apps" />
            <q-checkbox size="150px" v-model="form.submarketing" val="150px" label="Marketing" />
            <q-checkbox size="150px" v-model="form.subhosting" val="150px" label="Hosting" />
            <q-checkbox size="150px" v-model="form.subservicioit" val="150px" label="Servicio IT" />
          </div>
          <div class=" row justify-center">
           <q-file outlined v-model="form.imagen" style="max-width: 200px" label="Adjuntar imagen" filled bottom-slots>
             <template v-slot:before>
             </template>
             <template v-slot:prepend>
               <q-icon name="attach_file" />
             </template>
           </q-file>
         </div>
      <div class="row justify-center">
        <p style="font-size: 12px;">Imagen de 800x800 px</p>
      </div>
      <div><q-input type="tel" dense outlined class="q-pa-md row justify-center " style="width:100%"></q-input></div>
          <q-btn style="width:100%" no-caps label="Guardar" color="primary" size="lg"
          @click="!edit ? guardar() : actualizar()" />
      </div>

  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      imagen: null,
      listo: false,
      edit: false,
      verForma: false,
      tab: null,
      filter: '',
      form: {},
      allData: [],
      data: [],
      categorias: [
        { name: 'Dev Apps' },
        { name: 'Marketing' },
        { name: 'Hosting' },
        { name: 'Servicio IT' }
      ]
    }
  },
  validations: {
    form: {
      name: { required },
      categoria: { required },
      subdevapps: false,
      submarketing: false,
      subservicioit: false,
      subhosting: false,
      imagen: { required }
    }
  },
  methods: {
    guardar () {
      this.$v.form.$touch()
      const formData = new FormData()
      formData.append('imagen', this.form.imagen)
      formData.append('form', JSON.stringify(this.form))
      console.log(this.form)
      this.$api.post('nuevo_producto', formData).then(res => {
        if (res) {
          this.$q.notify({
            message: 'Producto creado',
            color: 'positive'
          })
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    actualizar () {
      this.$v.form.$touch()
      this.$api.put('editar_producto/' + this.form._id, this.form).then(res => {
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
    },
    eliminar (data) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar esta forma de pago?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.put('eliminar_producto/' + data._id).then(res => {
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
    },
    getFormasPago () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api.get('productos').then(res => {
        if (res) {
          this.allData = res
          this.data = this.allData
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    }
  }
}
</script>
