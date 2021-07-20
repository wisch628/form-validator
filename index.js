class FormValidator {
    constructor(form, fields) {
        this.form = form;
        this.fields = fields;
        this.validFields = [];
    }
    initialize() {
        this.validateOnSubmit();
        this.validateOnEntry();
    }
    validateOnSubmit() {
        this.form.addEventListener ('submit', event => {
            event.preventDefault();
            this.fields.forEach(field => {
                const input = document.querySelector(`#${field.id}`)
                let valid = this.validateFields(input);
                if (valid) {this.validFields.push(field)}
            })
            if (this.validFields.length === this.fields.length) {
                document.querySelector('.success').innerText = "Success!";
                this.fields.forEach(field => {
                    const input = document.querySelector(`#${field.id}`)
                    input.value = '';
                })
            } else {
                this.validFields = [];
            }
        })
    }

    validateOnEntry(){
        this.fields.forEach(field => {
            const input = document.querySelector(`#${field.id}`)
            input.addEventListener('input', event => {
                this.validateFields(input);
            })
        })
    }

    validateFields(field) {
        if (field.value.trim() === '') {
            this.setStatus(field, `${field.previousElementSibling.innerText} cannot be blank`, "error")
            return false;
        } else if (field.type === 'email') {
            const re = /\S+@\S+\.\S+/
            if (re.test(field.value)) {
                this.setStatus(field, null, "success")
            } else {
                this.setStatus(field, `Please enter a valid email`, "error")  
                return false;
            } 
        } else if (field.id === 'password') {
            if (field.value.length < 8) {
                this.setStatus(field, `Password is should be at least 8 characters`, "error") 
                return false;
            } else if (! /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/.test(field.value)) {
                this.setStatus(field, `Password must contain one number, one upper case letter, and one lower case letter`, "error") 
                return false;
            } else {
                this.setStatus(field, null, "success")
            } 
        } else if (field.id === 'password_confirmation') {
            const passwordField = this.form.querySelector('#password');
            if (field.value !== passwordField.value) {
                this.setStatus(field, `Passwords do not match`, "error") 
                return false;
            } else {
                this.setStatus(field, null, "success")
            } 
        } else {
            this.setStatus(field, null, "success")
            }
            return true;
        }

    setStatus(field, message, status) {
        const successIcon = field.parentElement.querySelector('.icon-success');
        const errorIcon = field.parentElement.querySelector('.icon-error');
        const errorMessage = field.parentElement.querySelector('.error-message');

        if (status === 'success') {
            if (errorIcon) {
                errorIcon.classList.add('hidden')
            }
            if (errorMessage) {
                errorMessage.innerText = '';
            }
            successIcon.classList.remove('hidden')
            field.classList.remove('input-error')
        }
        if (status === 'error') {
            if (successIcon) {successIcon.classList.add('hidden')}
            errorMessage.innerText = message;
            errorIcon.classList.remove('hidden')
            field.classList.add('input-error')
        }
    }
}

const form = document.querySelector('form');
const fields = document.querySelectorAll('input');
const validator = new FormValidator(form, fields);

validator.initialize();