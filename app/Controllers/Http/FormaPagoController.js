'use strict'

const Formas = use("App/Models/FormaPago")

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with formapagos
 */
class FormaPagoController {
  /**
   * Show a list of all formapagos.
   * GET formapagos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    let data = (await Formas.query().where({}).fetch()).toJSON()
    data = data.filter(v => v.isDeleted !== true)
    response.send(data)
  }

  /**
   * Render a form to be used for creating a new formapago.
   * GET formapagos/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
    var data = request.all()
    const newForma = await Formas.create(data)
    response.send(newForma)
  }

  /**
   * Create/save a new formapago.
   * POST formapagos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single formapago.
   * GET formapagos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing formapago.
   * GET formapagos/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update formapago details.
   * PUT or PATCH formapagos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    let forma_id = params.id
    let body = request.all()
    let editar = await Formas.query().where('_id', forma_id).update(body)
    response.send(editar)
  }

  /**
   * Delete a formapago with id.
   * DELETE formapagos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const { id } = params;
    const forma = await Formas.find(id);
    let paymentMethodDeleted = await Formas.query().where('_id', id).update({ isDeleted: true })
    response.send(true)
  }
}

module.exports = FormaPagoController
