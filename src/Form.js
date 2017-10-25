import Errors from './Errors'
import validations from './validations'

export default class {
  constructor (data, rules, extraValidations = {}) {
    this.defaultData = {}

    if (data) {
      Object.assign(this.defaultData, data)

      Object.keys(data).forEach(key => { this[key] = data[key] })
    }

    this.errors = new Errors(Object.keys(this.defaultData))

    this.validations = validations(this)

    if (extraValidations) {
      Object.assign(this.validations, extraValidations)
    }

    this.rules = rules || {}
  }

  reset () {
    Object.keys(this.defaultData).forEach(key => { this[key] = this.defaultData[key] })
  }

  validate (field) {
    if (!this.rules[field]) {
      return
    }

    this.errors[field] = ''

    for (let index in this.rules[field]) {
      let rule = this.rules[field][index]
      let validation = Object.keys(rule)[0]

      this.validations[validation].validate(field, rule[validation])

      if (this.errors.has(field)) {
        break
      }
    }
  }

  data () {
    let data = {}

    Object.keys(this.defaultData).forEach(key => { data[key] = this[key] })

    return data
  }

  validateSome (fields) {
    fields.forEach(field => { this.validate(field) })
  }

  submit (url) {
      return axios[post](url, this.data())
        .then((response) => {
          resolve(response)
        }).catch((error) => {
          if (error.response.status === 422) {
            Object.keys(error.response.data).forEach((key) => {
              this.errors[key] = error.response.data[key][0]
            })
          }

          reject(error)
        })
    })
  }
}
