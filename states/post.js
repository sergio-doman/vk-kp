

module.exports = function (app) {



  return {

    offset: 0,

    items: {},

    draw: function () {
      var that = this;

      var page = new tabris.Page({
        title: "Новина",
        topLevel: true
      });



      app.pages.post = page;
    },

    init: function () {
      this.draw();
    }



  }

}
