(function (routeConfig) {

  'use strict';

  routeConfig.init = function (app) {

    // *** index *** //
    const index = require('../routes/index');
    // *** highscores *** //
    const highscores = require('../routes/highscores');
    // // *** setup *** //
    const setup = require('../routes/setup');
    // // *** play *** //
    const play = require('../routes/play');
    // // *** register *** //
    const register = require('../routes/register');
    // // *** otherPages *** //
    const otherPages = require('../routes/otherPages');
    // // *** forgot-password *** //
    const forgot_password = require('../routes/forgot-password');

    // // *** login *** //
    const login = require('../routes/login');

    const expressValidator = require('express-validator');
    const flash = require('connect-flash');

    // Express Validator
    app.use(expressValidator({
      errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
        root    = namespace.shift(),
        formParam = root;

        while (namespace.length) {
          formParam += '[' + namespace.shift() + ']';
        }
        return {
          param: formParam,
          msg: msg,
          value: value
        };
      }
    }));

    // Connect Flash
    app.use(flash());

    // *** register index *** //
    app.use('/', index);
    // *** register highscores *** //
    app.use('/highscores', highscores);
    // *** register setup *** //
    app.use('/setup', setup);
    // *** register play *** //
    app.use('/play', play);
    // *** register register *** //
    app.use('/register', register);
    // *** register forgot-password *** //
    app.use('/forgot-password', forgot_password);
    // *** register login *** //
    app.use('/login', login);

    // *** ALL ROUTES GO ABOVE THIS! *** //
    // *** register other pages.  *** //
    app.use('*', otherPages);

  };

})(module.exports);
