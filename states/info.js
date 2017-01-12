
var moment = require('moment');

module.exports = function (app) {



  return {


    open: function () {
      var that = this;

      if (app.analytics) {
        app.analytics.sendAppView('info');
      }

      that.draw();
      that.page.open();
    },

    draw: function () {
      var that = this;

      that.page = new tabris.Page({
        title: '',
        background: app.config.app.toolbar.background,
        topLevel: false
      })
      .on('appear', function () {
        app.infoAction.set('visible', false);
      })
      .on('disappear', function () {
        app.infoAction.set('visible', true);
      });

      var logo = new tabris.ImageView({
        id: "logo",
        layoutData: {left: 10, right: 10, top: "15%"},
        image: {src: "res/img/vk.png"},
        scaleMode: "fit"
      }).appendTo(that.page);

      var info = new tabris.ImageView({
        id: "logo",
        layoutData: {left: 10, right: 10, centerY: 0},
        image: {src: "res/img/info.jpg"},
        scaleMode: "fit"
      }).appendTo(that.page);

      new tabris.TextView({
        id: 'website',
        markupEnabled: true,
        layoutData: {left: 10, right: 10, top: [info, 10]},
        textColor: "white",
        alignment: "center",
        text: "<small>www.vk-kp.info</small>"
      }).appendTo(that.page);

      new tabris.TextView({
        id: 'title',
        markupEnabled: true,
        layoutData: {left: 10, right: 10, bottom: 30},
        textColor: "white",
        // font: "bold 24px",
        alignment: "center",
        text: "Неофіційна мобільна версія<br/>розробник:<br/>Доманіцький С.<br/><b>seraphio777@gmail.com</b>"
      }).appendTo(that.page);

    },

    init: function () {
    }


  }

}
