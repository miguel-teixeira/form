import Errors from './Errors'
import validations from './validations'
import axios from 'axios';

export default class {
    constructor (data, rules, extraValidations = {}) {
        this.defaultData = {};

        if (data) {
            Object.assign(this.defaultData, data);

            Object.keys(data).forEach(key => { this[key] = data[key] });
        }

        this.errors = new Errors(Object.keys(this.defaultData));

        this.validations = validations(this);

        if (extraValidations) {
            Object.assign(this.validations, extraValidations);
        }

        this.rules = rules || {};
    }

    validateSome(fields) {
        fields.forEach(field => { this.validateField(field) });
    }

    validate() {
        this.validateSome(Object.keys(this.defaultData));
    }

    validateField(field) {
        if (!this.rules[field]) {
            return
        }

        this.errors[field] = '';

        for (let index in this.rules[field]) {
            let rule = this.rules[field][index];
            let validation = Object.keys(rule)[0];

            this.validations[validation].validate(field, rule[validation]);

            if (this.errors.has(field)) {
                break;
            }
        }
    }

    reset() {
        Object.keys(this.defaultData).forEach(key => { this[key] = this.defaultData[key] });
    }

    hasErrors() {
        return this.errors.empty()
    }

    data() {
        let data = {};

        Object.keys(this.defaultData).forEach(key => { data[key] = this[key] });

        return data;
    }

    submit(requestType, url) {
        return axios[requestType](url, this.data());
    }

    observeSome(formName, fields, context) {
        fields.forEach(name => {
            context.$watch(`${formName}.${name}`, () => {
                this.validateField(name);
            });
        })
    };

    observe(formName, context) {
        this.observeSome(formName, Object.keys(this.defaultData), context);
    }
}
