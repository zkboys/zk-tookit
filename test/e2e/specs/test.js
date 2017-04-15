// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage
var config = require('../../../build/config/index');
var port = config.dev.port;
module.exports = {
    'default e2e tests': function (browser) {
        browser
            .url('http://localhost:' + port + '/signin.html')
            .waitForElementVisible('#framework', 5000)
            .assert.elementPresent('.login-wrap')
            .assert.containsText('h1', '用户登录')
            // .assert.elementCount('p', 3)
            .end()
    }
}
