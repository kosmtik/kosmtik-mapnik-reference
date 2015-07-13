L.K.Map.addInitHook(function () {
    this.whenReady(function () {
        var container = L.DomUtil.create('div', 'mapnik-reference-container'), data,
            title = L.DomUtil.create('h3', '', container),
            docContainer = L.DomUtil.create('div', '', container),
            params = {
                filterSymbolizers: '',
                filterRules: ''
            },
            form = new L.K.FormBuilder(params, [
                ['filter', {handler: 'Input', placeholder: 'Filter symbolizers and rules…'}]
            ], {id: 'mapnik-reference-form'});
        title.innerHTML = 'CartoCSS Reference (<span class="version"></span>)';
        title.appendChild(form.build());
        var addRule = function (container, parentName, name, properties) {
            name = properties.css || name;
            var filter = (params.filter || '').toLowerCase();
            if ((parentName + ' ' + name).search(filter.split('').join('.*')) === -1) return;
            var title = L.DomUtil.create('h5', 'rule', container);
            title.innerHTML = name + '=';
            var type = L.DomUtil.create('em', 'type', title);
            type.innerHTML = L.Util.isArray(properties.type) ? 'list' : properties.type;
            if (properties.status && properties.status !== 'stable') {
                var status = L.DomUtil.create('span', 'status ' + properties.status, title);
                status.innerHTML = properties.status;
            }
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
            if (properties.range) {
                el = L.DomUtil.create('p', '', container);
                el.innerHTML = '<strong>Range: </strong>' + properties.range;
            }
        };
        var addSymbolizer = function (name, rules) {
            var wrapper = L.DomUtil.create('div', 'symbolizer', docContainer);
            var title = L.DomUtil.create('h4', '', wrapper);
            var content = L.DomUtil.create('div', 'rules', wrapper);
            title.innerHTML = name;
            for (var rule in rules) addRule(content, name, rule, rules[rule]);
            // No rule has matched: hide.
            if (!content.textContent) wrapper.style.display = 'none';
            else wrapper.style.display = 'block';
        };
        var build = function () {
            var versionContainer = container.querySelector('.version');
            versionContainer.textContent = data.version;
            docContainer.innerHTML = '';
            for (var symbolizer in data.symbolizers) addSymbolizer(symbolizer, data.symbolizers[symbolizer]);
        };
        form.on('postsync', build);
        var fetchData = function () {
            form.helpers.filter.input.focus();
            if (data) return;
            L.K.Xhr.get('/mapnik-reference/', {
                callback: function (status, _data) {
                    data = JSON.parse(_data);
                    build();
                }
            });
        };
        this.sidebar.addTab({
            label: 'Reference',
            className: 'mapnik-reference',
            content: container,
            callback: fetchData,
            large: true
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
