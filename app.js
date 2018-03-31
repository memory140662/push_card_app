const yargs = require('yargs');
const PushCard = require('./module/PushCard').PushCard;

const argv = yargs.options({
    a: {
        demand: true,
        alias: 'account',
        describe: 'User Account',
    },
    p: {
        demand: true,
        alias: 'password',
        describe: 'User Password',
    },
    c: {
        demand: false,
        alias: 'company',
        describe: 'Company Name',
    },
    lat: {
        demand: false,
        alias: 'latitude',
        describe: 'Location latitude',
    },
    lng: {
        demand: false,
        alias: 'longitude',
        describe: 'Location longitude',
    },
    act: {
        demand: true,
        alias: 'action',
        describe: 'Action type must be "checkin" or "checkout".',
    }
})
.help()
.alias('h', 'help')
.version(false)
.argv;

const {
    account,
    password,
    company,
    latitude,
    longitude,
    action
} = argv;

const pushCard = new PushCard(
    account,
    password,
    company,
    latitude,
    longitude
);

switch (action) {
    case 'checkin':
        pushCard.login().then(pc => pc.checkIn())
        .then(status => {
            console.log(`Check in ${status}`);
            return process.exit(0);
        })
        .catch(err => {
            console.error(`Check in fail. (${err.message})`);
            process.exit(1);
        });
        break;
    case 'checkout':
        pushCard.login().then(pc => pc.checkOut())
        .then(status => {
            console.log(`Check out ${status}`);
            process.exit(0);
        })
        .catch(err => {
            console.error(`Check out fail. (${err.message})`);
            process.exit(1);
        });
        break;
    default:
        console.error(`Action type error. (${action})`);
        process.exit(1);
}



