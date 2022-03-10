const fs = require('fs')
module.exports = {
    devServer: {
        host: 'localhost',
        // public: 'https://192.168.1.8:8080',
        disableHostCheck: true,
        https: {
            key: fs.readFileSync('./certs/dev_localhost.key'),
            cert: fs.readFileSync('./certs/dev_localhost.pem'),
        },
    },
    publicPath: process.env.DEPLOY_SITE === 'netlify' && process.env.NODE_ENV === 'production' ? '/' : '/tindercloneclient/'
}