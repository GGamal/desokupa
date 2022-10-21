'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Provincia extends Model {
    localidades() {
        return this.hasMany('App/Models/Localidad', 'id', 'provincia_id')
    }
}

module.exports = Provincia
