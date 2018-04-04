const rewire = require('rewire');
const expect = require('expect');
const PushCard = rewire('./PushCard');

describe('PushCard', () => {

    let res = {
        data: {
            response: {
                token: 'some-token',
                userId: 'some-user-id',
                accountId: 'some-account-id',
                status: 'success',
                buttons: [
                    { value: 'check in' },
                    { value: 'check out' }
                ]
            }
        }
    };

    let axios = {
        post: function () {
            return Promise.resolve(res)
        }
    };

    PushCard.__set__('axios', axios);

    describe('Login', () => {
        it('should actions include two values(check in and check out).', (done) => {
            new PushCard.PushCard().login().then(pushCard => {
                try {
                    expect(pushCard.actions.length).toBe(2);
                    expect(pushCard.actions[0]).toBe('check in');
                    expect(pushCard.actions[1]).toBe('check out');
                    expect(pushCard.actions).toEqual(['check in', 'check out']);
                    done();
                } catch (e) { done(e); }
            });
        });
    });
});