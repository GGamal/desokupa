'use strict'
const Expense = use('App/Models/Expense')
const Contrato = use('App/Models/Contrato')
const User = use('App/Models/User')
const moment = require('moment')
let numeral = require('numeral');
numeral.register('locale', 'fr', {
  delimiters: {
    thousands: '.'
  },
  currency: {
    symbol: '€'
  }
});
// numeral.locale('fr');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with expenses
 */
class ExpenseController {
  /**
   * Show a list of all expenses.
   * GET expenses
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const data = (await Expense.query().where({}).fetch()).toJSON()
    let total = 0
    for (const i in data) {
      const contract = (await Contrato.query().where('_id', data[i].contract_id).first()).toJSON()
      const user = (await User.query().where('_id', data[i].user_id).first()).toJSON()
      data[i].contractTitle = contract.numero
      data[i].userName = user.roles[0] === 0 ? user.full_name : user.name + ' ' + user.last_name
      data[i].date = moment(data[i].created_at).format('DD/MM/YYYY')
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
   * Render a form to be used for creating a new expense.
   * GET expenses/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new expense.
   * POST expenses
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const user = (await auth.getUser()).toJSON()
    let body = request.all()
    body.user_id = user._id
    const expense = await Expense.create(body)
    response.send(expense)

  }

  /**
   * Display a single expense.
   * GET expenses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing expense.
   * GET expenses/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update expense details.
   * PUT or PATCH expenses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a expense with id.
   * DELETE expenses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ExpenseController
