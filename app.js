
var _ = require('lodash');
var async = require('async');

var app = {
  config: {},

  menu: {},
  catsNames: {},
  cats: {},
  pages: {},
  states: {},


  openCat: function (catId) {
    console.log('openCat, catId = ', catId);

    app.pages.list.set('title', app.catsNames[catId]);
    app.pages.list.open();
  },

  loadCats: function (callback) {
    var f = [];
    _(app.config.cats).forEach(function (cat) {
      f.push(function (cb) {

        fetch(app.config.url + cat.url).then(function(response) {
          return response.json();
        }).catch(function(err) {
          cb();
        }).then(function(json) {
          delete json.category.events;
          app.cats[cat.id] = json.category;
          cb();
        });

      });
    });

    async.parallel(f, function () {
      if ('function' == typeof callback) {
        callback();
      }
    });
  },

  initMenu: function () {
    app.menu = new tabris.Drawer();
    app.menu.set('textColor', app.config.app.toolbar.textColor);
    app.menu.set('background', app.config.app.toolbar.background);

    var menuItems = [];
    var build = function (list, level) {
      _(list).forEach(function (item) {
        app.catsNames[item.id] = item.name;
        menuItems.push({id: item.id, name: item.name, level: level, nameShifted: Array((level + 1) * 2).join(" ") + item.name, type: 'cat'});
        if ('chidlren' in item && "object" == typeof item.chidlren) {
          build(item.chidlren, level + 1);
        }
      });
    }
    build(app.cats, 0);

    new tabris.CollectionView({
      layoutData: {left: 0, top: 0, right: 0, bottom: 0},
      items: menuItems,
      itemHeight: 36,
//      font: "bold 24px",
      initializeCell: function(cell) {
        var nameTextView = new tabris.TextView({
          layoutData: {left: 30, top: 16, right: 30},
          textColor: app.config.app.toolbar.textColor
        }).appendTo(cell);

        cell.on("change:item", function(widget, it) {
          nameTextView.set("text", it.nameShifted);
        });

      }
    }).on("select", function(target, value) {
      app.openCat(value.id);
      app.menu.close();
    }).appendTo(app.menu);
  },

  init: function () {
    app.config = require('./config');


    tabris.ui.set('textColor', app.config.app.toolbar.textColor);
    tabris.ui.set('background', app.config.app.toolbar.background);
    tabris.ui.set("displayMode", "fullscreen");
    // tabris.ui.set('toolbarVisible', false);

    app.states.loading = require('./states/loading')(app);
    app.states.loading.init();

    app.states.list = require('./states/list')(app);
    app.states.list.init();


    app.pages.loading.open();
    app.loadCats(function () {
      app.initMenu();
      app.openCat(app.config.cats[0].id);
    });





  }


}

module.exports = app;

