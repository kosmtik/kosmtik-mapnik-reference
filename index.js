var ref = require('mapnik-reference');

var Plugin = function (config) {
    config.addJS('/node_modules/kosmtik-mapnik-reference/front.js');
    config.addCSS('/node_modules/kosmtik-mapnik-reference/front.css');
    config.on('server:init', this.attachRoutes.bind(this));
};

Plugin.prototype.serve = function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'application/javascript'
    });
    res.write(JSON.stringify(ref.load(this.config.parsed_opts.mapnik_version)));
    res.end();
};

Plugin.prototype.attachRoutes = function (e) {
    e.server.addRoute('/mapnik-reference/', this.serve);
};

exports.Plugin = Plugin;
