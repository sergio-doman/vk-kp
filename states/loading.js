

module.exports = function (app) {



  return {

    page: {},

    draw: function () {
      var that = this;

      that.page = new tabris.Page({
        title: '',
        topLevel: true
      });

      that.page.set('background', app.config.app.toolbar.background);

      var logo = new tabris.ImageView({
        image: {src: "res/img/splash.jpg" },
        scaleMode: 'fit',
        layoutData: {left: "20%", right: "20%", centerY: -50}
      }).appendTo(that.page);

      new tabris.TextView({
        layoutData: {centerX: 0, top: [logo, 10]},
        textColor: "white",
        text: "неофіційна мобільна версія"
      }).appendTo(that.page);


      new tabris.ActivityIndicator({
        centerX: 0,
        // centerY: 0
        bottom: '1%'
      }).appendTo(that.page);
    },


    init: function () {
      this.draw();
    }

  }

}
