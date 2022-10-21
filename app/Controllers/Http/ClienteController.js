'use strict'

const Clientes = use("App/Models/Cliente")
const Inmuebles = use("App/Models/Inmueble")
const Provincia = use("App/Models/Provincia")
const Localidad = use("App/Models/Localidad")

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with clientes
 */
class ClienteController {
  /**
   * Show a list of all clientes.
   * GET clientes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth }) {
    const user = (await auth.getUser()).toJSON()
    let clientes = []
    if (user.roles[0] === 0 || user.roles[0] === 1) {
      clientes = (await Clientes.query().where({admin: true}).fetch()).toJSON()
    } else if (user.roles[0] === 6) {
      clientes = (await Clientes.query().where({comercial_id: user._id}).fetch()).toJSON()
    }
    clientes = clientes.filter(v => v.isDeleted !== true)
    for (let i = 0; i < clientes.length; i++) {
      clientes[i].full_name = clientes[i].name
      clientes[i].inmuebles = (await Inmuebles.query().where({cliente_id: clientes[i]._id}).fetch()).toJSON()
      for (const j in clientes[i].inmuebles) {
        clientes[i].inmuebles[j].locationName = (await Localidad.find(clientes[i].inmuebles[j].localidad_id)).name
        clientes[i].inmuebles[j].provinceName = (await Provincia.find(clientes[i].inmuebles[j].provincia_id)).name
      }
      if (clientes[i].last_name) {
        clientes[i].full_name = clientes[i].full_name + ' ' + clientes[i].last_name
      }
      if (clientes[i].provincia_id) {
        clientes[i].provincia = (await Provincia.find(clientes[i].provincia_id)).name
      }
      if (clientes[i].localidad_id) {
        clientes[i].localidad = (await Localidad.find(clientes[i].localidad_id)).name
      }
    }

    response.send(clientes)
  }

  async indexInmueble ({ request, response, auth }) {
    const user = (await auth.getUser()).toJSON()
    let inmuebles = []
    if (user.roles[0] === 0 || user.roles[0] === 1) {
      inmuebles = (await Inmuebles.query().where({admin: true}).fetch()).toJSON()
    } else if (user.roles[0] === 6) {
      inmuebles = (await Inmuebles.query().where({comercial_id: user._id}).fetch()).toJSON()
    }
    inmuebles = inmuebles.filter(v => v.isDeleted !== true)
    for (let i = 0; i < inmuebles.length; i++) {
      var cliente = (await Clientes.find(inmuebles[i].cliente_id))
      if (cliente.type === 2) {
        inmuebles[i].cliente_name = cliente.name
      } else {
        inmuebles[i].cliente_name = cliente.name + ' ' + cliente.last_name
      }
      if (inmuebles[i].provincia_id) {
        inmuebles[i].provincia = (await Provincia.find(inmuebles[i].provincia_id)).name
      }
      if (inmuebles[i].localidad_id) {
        inmuebles[i].localidad = (await Localidad.find(inmuebles[i].localidad_id)).name
      }
    }

    response.send(inmuebles)
  }

  async clientById({ params, response }) {
    try {
      const cliente = await Clientes.find(params.id)
      if (cliente.provincia_id) {
        cliente.provincia = await Provincia.find(cliente.provincia_id)
        cliente.provincia.localidades = (await Localidad.query().where({provincia_id: cliente.provincia.id}).fetch()).toJSON()
      }
      if (cliente.localidad_id) {
        cliente.localidad = await Localidad.find(cliente.localidad_id)
      }
      response.send(cliente)
    } catch (error) {
      console.error('cliente by id: ' + error.name + ':' + error.message)
    }
  }

  async inmuebleById({ params, response }) {
    try {
      const inmueble = await Inmuebles.find(params.id)
      if (inmueble.provincia_id) {
        inmueble.provincia = await Provincia.find(inmueble.provincia_id)
        inmueble.provincia.localidades = (await Localidad.query().where({provincia_id: inmueble.provincia.id}).fetch()).toJSON()
      }
      if (inmueble.localidad_id) {
        inmueble.localidad = await Localidad.find(inmueble.localidad_id)
      }
      response.send(inmueble)
    } catch (error) {
      console.error('inmueble by id: ' + error.name + ':' + error.message)
    }
  }

  /**
   * Render a form to be used for creating a new cliente.
   * GET clientes/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, auth }) {
    const user = (await auth.getUser()).toJSON()
    var dat = request.all()
    dat.comercial_id = user._id
    if (user.roles[0] === 0 || user.roles[0] === 1) {
      dat.admin = true
    } else {
      dat.admin = false
    }
    const cliente = await Clientes.create(dat)
    response.send(cliente)
  }

  async createInmueble ({ request, response, auth }) {
    const user = (await auth.getUser()).toJSON()
    var dat = request.all()
    dat.comercial_id = user._id
    if (user.roles[0] === 0 || user.roles[0] === 1) {
      dat.admin = true
    } else {
      dat.admin = false
    }
    const inmueble = await Inmuebles.create(dat)
    response.send(inmueble)
  }

  /**
   * Create/save a new cliente.
   * POST clientes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single cliente.
   * GET clientes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing cliente.
   * GET clientes/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update cliente details.
   * PUT or PATCH clientes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    let client_id = params.id
    let body = request.all()
    delete body.provincia
    delete body.localidad
    let editar = await Clientes.query().where('_id', client_id).update(body)
    response.send(editar)
  }

  async updateInmueble ({ params, request, response }) {
    let inmueble_id = params.id
    let body = request.all()
    delete body.provincia
    delete body.localidad
    let editar = await Inmuebles.query().where('_id', inmueble_id).update(body)
    response.send(editar)
  }

  /**
   * Delete a cliente with id.
   * DELETE clientes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async delete ({ params, request, response }) {
    const { id } = params;
    const cliente = await Clientes.find(id);
    let clientDeleted = await Clientes.query().where('_id', id).update({ isDeleted: true })
    response.send(true)
  }

  async destroyInmueble ({ params, request, response }) {
    const { id } = params;
    const inmueble = await Inmuebles.find(id);
    let estateDeleted = await Inmuebles.query().where('_id', id).update({ isDeleted: true })
    response.send(true)
  }
}

module.exports = ClienteController
