var ref = require('mapnik-reference');

class Plugin {
    constructor(config) {
        config.addJS('/node_modules/kosmtik-mapnik-reference/front.js');
        config.addCSS('/node_modules/kosmtik-mapnik-reference/front.css');
        config.on('server:init', this.attachRoutes.bind(this));
    }

    serve(req, res) {
        res.writeHead(200, {
            'Content-Type': 'application/javascript'
        });
        res.write(JSON.stringify(ref.load(this.config.parsed_opts.mapnik_version)));
        res.end();
    }

    attachRoutes(e) {
        e.server.addRoute('/mapnik-reference/', this.serve);
    }
}

exports = module.exports = { Plugin };
