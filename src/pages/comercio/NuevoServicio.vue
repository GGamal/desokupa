<template>
  <div class="q-pa-md">
        <div class="row justify-between q-pa-sm bg-primary" style="width:100%">
          <img src="logoblanco.png" style="width:150px" />
          <q-btn round flat color="white" icon="clear" v-close-popup />
        </div>
        <div class="text-grey-8 text-center text-h5 q-mt-md">Nuevo producto</div>
        <div class="q-px-lg q-pb-xl" >
          <div style="font-size: 18px;">
            Nombre
            <q-input type="tel" outlined v-model="form.name"  dense placeholder="Ingrese el nombre"
            error-message="Este campo es requerido" :error="$v.form.name.$error" @blur="$v.form.name.$touch()"/>
          </div>
          <div class="q-pa-md">
          <div class="q-gutter-md row items-start q-pa-md justify-center">
            <q-select
              filled
              label="Servicios"
              v-model="form.categoria"
              multiple
              :options="categorias"
              map-options
              counter
              hint="Servicios seleccionados"
              style="width: 280px"
              option-label="name"
              option-value="name"
              label-color="grey-1"
              bg-color="grey-8"
              use-chips
            />
          </div>
          </div>
          <div class=" row justify-center q-mt-md">
           <q-file outlined v-model="form.imagen" style="max-width: 200px" label="Adjuntar imagen" filled bottom-slots label-color="grey-1" bg-color="grey-8">
             <template v-slot:before>
             </template>
             <template v-slot:prepend>
               <q-icon name="attach_file" color="grey-1"/>
             </template>
           </q-file>
         </div>
      <div class="row justify-center">
        <p style="font-size: 12px;">Imagen de 800x800 px</p>
      </div>
      <div class="row justify-center"><q-input v-model="form.descripcion" type="textarea" dense outlined class="q-pa-md row justify-center "   cols="100" rows="4"></q-input></div>
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
        'Dev Apps. ',
        'Marketing. ',
        'Hosting. ',
        'Servicio IT. '
      ]
    }
  },
  validations: {
    form: {
      name: { required },
      categoria: { required },
      imagen: { required },
      descripcion: { required }
    }
  },
  methods: {
    // guardar () {
    //   this.$v.form.$touch()
    //   this.$v.name.$touch()
    //   this.$v.apoderado.$touch()
    //   const formData = new FormData()
    //   formData.append('imagen', this.form.imagen)
    //   formData.append('form', JSON.stringify(this.form))
    //   console.log(this.form.imagen)
    //   this.$api.post('nuevo_producto', formData).then(res => {
    //     if (res) {
    //       this.$q.notify({
    //         message: 'Servicio registrado con éxito',
    //         color: 'positive'
    //       })
    //       this.$q.loading.hide()
    //       this.$router.go(-1)
    //     } else {
    //       this.$q.loading.hide()
    //     }
    //   })
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
          // this.dialog = true
          // this.getFormasPago()
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
    }
  }
}
</script>
