let axios = require('axios').default;
const data = require('../data.json');

class PushCard {
    constructor(account, password, companyName, latitude, longitude) {
        this.account = account;
        this.password = password;
        this.companyName = companyName || data.companyName;
        this.latitude = latitude || data.location.latitude;
        this.longitude = longitude || data.location.longitude;
        this.token = this.userId = this.accountId = this.actions = null;
    }

    async login() {
        try {
            const loginUrl = `${data.url + this.companyName + data.apiUrl + data.action.login}`;
            const loginData = {
                account: this.account,
                password: this.password,
                companyName: this.companyName,
                isAccount: 'true',
                notificationToken: ''
            };

            let res = await axios.post(loginUrl, loginData);
            const { token , userId, accountId, status } = res.data.response;
            this.token = token;
            this.userId = userId;
            this.accountId = accountId;
            const queryData = {
                token , userId, accountId
            };
        
            const queryUrl = `${data.url + this.companyName + data.apiUrl + data.action.pushCardQuery}`;
            res = await axios.post(queryUrl, queryData);
            const { buttons } = res.data.response;
            if (buttons) {
                this.actions = buttons.map(({value}) => value);
            }
            return this;
        } catch (e) {
            throw new Error(`Login Failed (Please Check Your Account, Password or Company Name). -> ${e.message}`);
        }
    }

    async checkIn() {
        if (!this._isLogin()) throw new Error('Please Login First.');
        try {
            const pushCardUrl = `${data.url + this.companyName + data.apiUrl + data.action.pushCard}`;
            const pushCardData = {
                userId: this.userId,
                accountId: this.accountId,
                latitude: this.latitude,
                longitude: this.longitude,
                value: this.actions[0],
                token: this.token
            };

            const res = await axios.post(pushCardUrl, pushCardData);
            return res.data.response.status;
        } catch (e) {
            throw new Error(`Check In Failed. -> ${e.message}`);
        }
    }

    async checkOut() {
        if (!this._isLogin()) throw new Error('Please Login First.');
        try {
            const pushCardUrl = `${data.url + this.companyName + data.apiUrl + data.action.pushCard}`;
            const pushCardData = {
                userId: this.userId,
                accountId: this.accountId,
                latitude: this.latitude,
                longitude: this.longitude,
                value: this.actions[1],
                token: this.token
            };
            const res = await axios.post(pushCardUrl, pushCardData);
            return res.data.response.status;
        } catch (e) {
            throw new Error(`Check Out Failed. -> ${e.message}`);
        }
    }

    _isLogin() {
        return !!this.accountId && !!this.token && !!this.userId; 
    }
}

module.exports = {
    PushCard
}