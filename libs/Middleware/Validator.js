const validRules = [
    'required',
    'email',
    'min',
    'max',
    'unique',
    'confirmed'
];

const axios = require('axios');
const DatabaseConnection = require('../../database/database');
class Validator {
    params;
    data;
    errors;
    validRules;
    uniques = [];
    constructor(data = {}, params = {}) {
        this.params = params;
        this.data = data;
        this.errors = {};
        this.validRules = validRules;
        this.database = new DatabaseConnection();
        this.handle();
    }

    handle() {
        let keysToValidate = Object.keys(this.params);
        for (const key of keysToValidate) {
            let rules = this.params[key].split('|');
            for (const rule of rules) {
                let [ruleName, ruleValue] = rule.split(':');
                if (ruleName === 'unique') {
                    this.uniques.push({ key, table: ruleValue });
                } else {
                    // Perform validation for other rules
                    const isValid = this.validate(key, ruleName, ruleValue);
                    if (!isValid) {
                        return;
                    }
                }
            }
        }
        // this.handleUniqueValidations(uniqueKeys);
    }

    async handleUniqueValidations(uniqueKeys) {
        for (const { key, table } of uniqueKeys) {
            const isUnique = await this.validateUnique(this.data[key], table, key);
            if (!isUnique) {
                this.errors[key] = `The ${key} must be unique.`;
            }
        }
    }

    async validate(key, ruleName, ruleValue = undefined) {
        let returnData = true;

        switch (ruleName) {
            case 'required':
                if (!this.data[key] || this.data[key] === '') {
                    this.errors[key] = 'This field is required.';
                    returnData = false;
                }
                break;
            case 'email':
                if (!this.validateEmail(this.data[key])) {
                    this.errors[key] = 'Invalid email address.';
                    returnData = false;
                }
                break;
            case 'min':
                if (this.data[key].length < Number(ruleValue)) {
                    this.errors[key] = `This field must be at least ${ruleValue} characters.`;
                    returnData = false;
                }
                break;
            case 'max':
                if (this.data[key].length > Number(ruleValue)) {
                    this.errors[key] = `This field must be at most ${ruleValue} characters.`;
                    returnData = false;
                }
                break;
            case 'unique':
                const isUnique = await this.validateUnique(this.data[key], ruleValue, key);
                if (!isUnique) {
                    this.errors[key] = `The ${key} must be unique`;
                    returnData = false;
                }
                break;
            case 'confirmed':
                if (this.data[`${key}_confirmation`] !== this.data[key]) {
                    this.errors[key] = 'This field must match the confirmation field.';
                    returnData = false;
                }
                break;
            default:
                break;
        }

        return returnData;
    }  

    validateEmail(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }
    async validateUnique(email, table, key) {
        let sql = `SELECT ${key} FROM ${table} WHERE ${key} = ?`;
        let data = await this.database.runQuery(sql, [email]);
        return data.length === 0;
    }
    async fails() {
        let returnData = (Object.keys(this.errors).length > 0 ? this.errors : false);
        if (this.uniques.length === 0){
            return returnData;
        }
        await this.handleUniqueValidations(this.uniques);
        return await (Object.keys(this.errors).length > 0 ? this.errors : false);
    }
    

    setErrors(key, value){
        this.errors[key] = value;
    }
}

module.exports = Validator;