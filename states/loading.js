

module.exports = function (app) {



  return {

    draw: function () {
      var page = new tabris.Page({
        title: '',
        topLevel: true
      });

      page.set('background', '#db322d');

      var logo = new tabris.ImageView({
        image: {src: "res/img/vk.png" },
        scaleMode: 'fit',
        layoutData: {centerX: 0, centerY: -50}
      }).appendTo(page);

      new tabris.TextView({
        layoutData: {centerX: 0, top: [logo, 10]},
        textColor: "white",
        text: "неофіційна мобільна версія"
      }).appendTo(page);

      new tabris.TextView({
        layoutData: {centerX: 0, bottom: '1%'},
        textColor: "white",
        text: "Завантаження.."
      }).appendTo(page);


      app.pages.loading = page;
    },


    init: function () {
      this.draw();
    }


  }

}
