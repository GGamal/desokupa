'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Inmueble extends Model {
  localidad () {
    return this.hasOne('App/Models/Localidad', '_id', 'localidad_id')
  }
  localidad () {
    return this.hasOne('App/Models/Provincia', '_id', 'provincia_id')
  }
}

module.exports = Inmueble
