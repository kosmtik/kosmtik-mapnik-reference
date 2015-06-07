L.K.Map.addInitHook(function () {
    this.whenReady(function () {
        var container = L.DomUtil.create('div', 'mapnik-reference-container'), data,
            title = L.DomUtil.create('h3', '', container),
            formContainer = L.DomUtil.create('div', '', container),
            docContainer = L.DomUtil.create('div', '', container),
            params = {
                filter: ''
            },
            builder = new L.K.FormBuilder(params, [
                ['filter', {handler: 'Input', placeholder: 'Filter symbolizers…'}]
            ], {id: 'mapnik-reference-form'});
        title.innerHTML = 'CartoCSS Reference';
        formContainer.appendChild(builder.build());
        var addRule = function (container, name, properties) {
            name = properties.css || name;
            var filter = (params.filter || '').toLowerCase();
            if (filter && name.toLowerCase().indexOf(filter) === -1) return;
            var title = L.DomUtil.create('h5', 'rule', container);
            title.innerHTML = name + '=';
            var type = L.DomUtil.create('em', 'type', title);
            type.innerHTML = L.Util.isArray(properties.type) ? 'list' : properties.type;
            var doc = L.DomUtil.create('p', 'doc', container);
            doc.innerHTML = properties.doc;
            var el = L.DomUtil.create('p', '', container);
            el.innerHTML = '<strong>Default: </strong>' + (properties['default-value'] || 'none');
            if (properties['default-meaning']) {
                var meaning = L.DomUtil.create('em', '', el);
                meaning.innerHTML = ' (' + properties['default-meaning'] + ')';
            }
            if (L.Util.isArray(properties.type)) {
                el = L.DomUtil.create('p', '', container);
                el.innerHTML = '<strong>Values: </strong>' + properties.type.join(', ');
            }
            if (properties.functions) {
                el = L.DomUtil.create('p', '', container);
                el.innerHTML = '<strong>Functions: </strong>' + properties.functions.join(', ');
            }
        };
        var addSymbolizer = function (name, rules) {
            var content = L.DomUtil.create('div', 'symbolizer', docContainer);
            var title = L.DomUtil.create('h4', '', content);
            title.innerHTML = name;
            for (var rule in rules) addRule(content, rule, rules[rule]);
        };
        var build = function () {
            docContainer.innerHTML = '';
            for (var symbolizer in data.symbolizers) addSymbolizer(symbolizer, data.symbolizers[symbolizer]);
        };
        builder.on('synced', build);
        var fetchData = function () {
            if (data) return;
            L.K.Xhr.get('/mapnik-reference/', {
                callback: function (status, _data) {
                    data = JSON.parse(_data);
                    console.log(data);
                    build();
                }
            });
        };
        this.sidebar.addTab({
            label: 'Reference',
            className: 'mapnik-reference',
            content: container,
            callback: fetchData
        });
        this.commands.add({
            keyCode: L.K.Keys.H,
            shiftKey: true,
            altKey: true,
            callback: function () { this.sidebar.open('.mapnik-reference'); },
            context: this,
            name: 'Help: Carto Language Reference'
        });
    });
});
