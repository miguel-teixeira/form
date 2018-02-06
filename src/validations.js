import axios from 'axios';

export default function (form) {
    return {
        required: {
            validate (field, params) {
                if (form[field] === '') {
                    form.errors[field] = params.message
                        ? params.message
                        : `${field} is required.`;
                }
            }
        },
        email: {
            validate (field, params) {
                if (!this.testEmail(form[field])) {
                    form.errors[field] = params.message
                        ? params.message
                        : 'Invalid email.';
                }
            },
            testEmail (email) {
                return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
            }
        },
        date: {
            validate (field, params) {
                let date = moment(form[field]);

                if (!date.isValid()) {
                    form.errors[field] = params.message
                        ? params.message
                        : 'Invalid date.';
                }
            }
        },
        is: {
            validate (field, params) {
                if (form[field] !== params.value) {
                    form.errors[field] = params.message
                        ? params.message
                        : `Value should be ${params.value}.`;
                }
            }
        },
        minLength: {
            validate (field, params) {
                if (form[field].length < params.minLength) {
                    form.errors[field] = params.message
                        ? params.message
                        : `Minimum length is ${params.minLength}.`;
                }
            }
        },
        maxLength: {
            validate (field, params) {
                if (form[field].length > params.maxLength) {
                    form.errors[field] = params.message
                        ? params.message
                        : `Maximum length is ${params.maxLength}.`;
                }
            }
        },
        digits: {
            validate (field, params) {
                if (!this.testDigits(form[field])) {
                    form.errors[field] = params.message
                        ? params.message
                        : `Only digits are allowed.`;
                }
            },
            testDigits (value) {
                return /^\d+$/.test(value);
            }

        },
        zipCode: {
            validate (field, params) {
                if (!this.testZipCode(form[field])) {
                    form.errors[field] = params.message
                        ? params.message
                        : `Format: xxxx-xxx.`;
                }
            },
            testZipCode (zipCode) {
                return /^[0-9]{4}-[0-9]{3}$/.test(zipCode);
            }
        },
        phone: {
            validate (field, params) {
                if (!this.testPhone(form[field])) {
                    form.errors[field] = params.message
                        ? params.message
                        : `Formato: +351 xxxxxxxxx.`;
                }
            },
            testPhone (phone) {
                return /^\+\d{2,3}\s?\d{6,11}$/.test(phone);
            }
        },
        username: {
            validate (field, params) {
                if (!this.testUsername(form[field])) {
                    form.errors[field] = params.message
                        ? params.message
                        : 'Invalid format.';
                }
            },
            testUsername (username) {
                return /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?![_.])$/.test(username);
            }
        },
        password: {
            validate (field, params) {
                if (!this.testPassword(form[field])) {
                    form.errors[field] = params.message
                        ? params.message
                        : '1 uppercase, 1 lowercase and 1 number.';
                }
            },
            testPassword (password) {
                return /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{6,20}$/.test(password);
            }
        },
        equalTo: {
            validate (field, params) {
                if (form[field] !== form[params.field]) {
                    form.errors[field] = params.message
                        ? params.message
                        : `${field} doesn't match ${params.field}`;
                }
            }
        },
        'toggleValidation': {
            validate (field, params) {
                form.validateField(params.field);
            }
        },
        'remote': {
            validate (field, params) {
                axios[params.requestType](params.url, {[field]: form[field]})
                    .then((response) => {
                        if (response.data !== params.successMessage) {
                            form.errors[field] = params.message
                                ? params.message
                                : response.data
                        }
                    });
            },
        }
    }
}
