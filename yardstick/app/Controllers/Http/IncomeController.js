'use strict'
const Income = use('App/Models/Income')
const Contrato = use('App/Models/Contrato')
const User = use('App/Models/User')
let numeral = require('numeral');
/* numeral.register('locale', 'fr', {
  delimiters: {
    thousands: '.'
  },
  currency: {
    symbol: '€'
  }
}); */
numeral.locale('fr');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with incomes
 */
class IncomeController {
  /**
   * Show a list of all incomes.
   * GET incomes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ response }) {
    const data = (await Income.query().where({}).fetch()).toJSON()
    let total = 0
    for (const i in data) {
      const contract = (await Contrato.query().where('_id', data[i].contract_id).first()).toJSON()
      const user = (await User.query().where('_id', data[i].user_id).first()).toJSON()
      data[i].contractTitle = contract.numero
      data[i].userName = user.roles[0] === 0 ? user.full_name : user.name + ' ' + user.last_name
      total = total + data[i].amount
      data[i].amount = numeral(data[i].amount).format('0,0€');
    }
    total = numeral(total).format('0,0€');
    const send = {
      data,
      total
    }
    response.send(send)
  }

  /**
   * Render a form to be used for creating a new income.
   * GET incomes/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new income.
   * POST incomes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single income.
   * GET incomes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing income.
   * GET incomes/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update income details.
   * PUT or PATCH incomes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a income with id.
   * DELETE incomes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = IncomeController
