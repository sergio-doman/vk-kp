
var _ = require('lodash');
var async = require('async');

var app = {
  config: {},

  menu: {},
  catsNames: {},
  cats: {},
  states: {},
  infoAction: null,

  clickCat: function (catId) {
    app.states.list.open(catId);
  },

  loadCats: function (callback) {
    fetch(app.config.urlCats).then(function(response) {
      return response.json();
    }).catch(function(err) {
      callback('Failed to load categories list');
    }).then(function(json) {
      setTimeout(function () {
        app.cats = json;
        callback();
      }, 2000);
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


    var logo = new tabris.ImageView({
      image: {src: "res/img/vk.png" },
      scaleMode: 'fit',
      layoutData: {left: "30%", top: 5, right: "30%"}
    }).appendTo(app.menu);

    new tabris.CollectionView({
      layoutData: {left: 0, top: [logo, 1], right: 0, bottom: 0},
      items: menuItems,
      itemHeight: 36,
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
      app.clickCat(value.id);
      app.menu.close();
    }).appendTo(app.menu);

    app.infoAction = new tabris.Action({
      title: 'Інформація',
      placementPriority: 'high',
      image: {src: "res/img/info.png"}
    }).on("select", function() {
      app.states.info.open();
    });
  },

  init: function () {
    app.config = require('./config');

    tabris.ui.set('textColor', app.config.app.toolbar.textColor);
    tabris.ui.set('background', app.config.app.toolbar.background);
    tabris.ui.set("displayMode", "fullscreen");
    tabris.ui.set('toolbarVisible', false);

    app.states.loading = require('./states/loading')(app);
    app.states.loading.init();
    app.states.list = require('./states/list')(app);
    app.states.list.init();
    app.states.view = require('./states/view')(app);
    app.states.view.init();
    app.states.info = require('./states/info')(app);
    app.states.info.init();

    app.states.loading.page.open();
    app.loadCats(function (err) {
      tabris.ui.set('toolbarVisible', true);
      app.initMenu();
      app.clickCat(app.config.defaultCat);
    });
  }

}

module.exports = app;

