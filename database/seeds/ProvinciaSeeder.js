'use strict'

/*
|--------------------------------------------------------------------------
| ProvinciaSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Provincia = use("App/Models/Provincia")
const ProvinciasData = [
  {
    id: 1,
    name: "Alava"
   },
   {
    id: 2,
    name: "Albacete"
   },
   {
    id: 3,
    name: "Alicante"
   },
   {
    id: 4,
    name: "Almeria"
   },
   {
    id: 5,
    name: "Avila"
   },
   {
    id: 6,
    name: "Badajoz"
   },
   {
    id: 7,
    name: "Islas Baleares"
   },
   {
    id: 8,
    name: "Barcelona"
   },
   {
    id: 9,
    name: "Burgos"
   },
   {
    id: 10,
    name: "Cáceres"
   },
   {
    id: 11,
    name: "Cádiz"
   },
   {
    id: 12,
    name: "Castellón"
   },
   {
    id: 13,
    name: "Ciudad Real"
   },
   {
    id: 14,
    name: "Córdoba"
   },
   {
    id: 15,
    name: "Coruña"
   },
   {
    id: 16,
    name: "Cuenca"
   },
   {
    id: 17,
    name: "Girona"
   },
   {
    id: 18,
    name: "Granada"
   },
   {
    id: 19,
    name: "Guadalajara"
   },
   {
    id: 20,
    name: "Gipuzkoa"
   },
   {
    id: 21,
    name: "Huelva"
   },
   {
    id: 22,
    name: "Huesca"
   },
   {
    id: 23,
    name: "Jaén"
   },
   {
    id: 24,
    name: "León"
   },
   {
    id: 25,
    name: "Llid"
   },
   {
    id: 26,
    name: "La Rioja"
   },
   {
    id: 27,
    name: "Lugo"
   },
   {
    id: 28,
    name: "Madid"
   },
   {
    id: 29,
    name: "Málaga"
   },
   {
    id: 30,
    name: "Murcia"
   },
   {
    id: 31,
    name: "Navarra"
   },
   {
    id: 32,
    name: "Ourense"
   },
   {
    id: 33,
    name: "Asturias"
   },
   {
    id: 34,
    name: "Palencia"
   },
   {
    id: 35,
    name: "Las Palmas"
   },
   {
    id: 36,
    name: "Pontevedra"
   },
   {
    id: 37,
    name: "Salamanca"
   },
   {
    id: 38,
    name: "Sta. Cruz de Tenerife"
   },
   {
    id: 39,
    name: "Cantabria"
   },
   {
    id: 40,
    name: "Segovia"
   },
   {
    id: 41,
    name: "Sevilla"
   },
   {
    id: 42,
    name: "Soria"
   },
   {
    id: 43,
    name: "Tarragona"
   },
   {
    id: 44,
    name: "Teruel"
   },
   {
    id: 45,
    name: "Toledo"
   },
   {
    id: 46,
    name: "Valencia"
   },
   {
    id: 47,
    name: "Valladoid"
   },
   {
    id: 48,
    name: "Bizkaia"
   },
   {
    id: 49,
    name: "Zamora"
   },
   {
    id: 50,
    name: "Zaragoza"
   },
   {
    id: 51,
    name: "Ceuta"
   },
   {
    id: 52,
    name: "Melilla"
   }
]

class ProvinciaSeeder {
  async run () {
    for (let i of ProvinciasData) {
      let cat = await Provincia.findBy('id', i.id)
      if (!cat) {
        await Provincia.create(i)
      }
    }
    console.log('Finished Provincias')
  }
}

module.exports = ProvinciaSeeder
