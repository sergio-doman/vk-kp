
var moment = require('moment');

module.exports = function (app) {



  return {

    newsRss: {},
    news: {},
    page: {},

    fetch: function (url, callback) {
      fetch(url).then(function(response) {
        return response.json();
      }).catch(function(err) {
        callback('Failed to load post');
      }).then(function(json) {
        callback(null, json);
      });
    },

    open: function (newsRss) {
      var that = this;

      that.newsRss = newsRss;
      that.draw();
      that.page.open();

      that.fetch(newsRss.link + '?format=json', function (err, data) {
        if (err) {
          window.plugins.toast.showShortTop(err);
        }
        else {
          that.news = data;
          that.draw2();
        }
      });
    },

    draw: function () {
      var that = this;

      that.page = new tabris.Page({
        title: '',
        topLevel: false
      });

      new tabris.TextView({
        id: 'loading',
        layoutData: {centerX: 0, centerY: 0},
        text: "Завантаження.."
      }).appendTo(that.page);

      var scrollView = new tabris.ScrollView({
        id: 'panel',
        visible: false,
        layoutData: {left: 0, right: 0, top: 0, bottom: 0},
        direction: "vertical"
        // ,background: "#ccc"
      }).appendTo(that.page);

      var titleText = new tabris.TextView({
        id: 'title',
        markupEnabled: true,
        layoutData: {left: 10, right: 10, top: 20},
        font: "bold 24px",
        text: "test title"
      }).appendTo(scrollView);

      var dateText = new tabris.TextView({
        id: 'date',
        layoutData: {left: 10, right: 10, top: [titleText, 10]},
        textColor: '#444',
        text: "",
        alignment: "left"
      }).appendTo(scrollView);

      var mainimage = new tabris.ImageView({
        id: "mainimage",
        layoutData: {left: 10, right: 10, top: [dateText, 10]},
        scaleMode: "fit"
      }).appendTo(scrollView);

      var introText = new tabris.TextView({
        id: 'intro',
        markupEnabled: true,
        layoutData: {left: 10, right: 10, top: [mainimage, 10]},
        text: ""
      }).appendTo(scrollView);

      var moreText = new tabris.TextView({
        id: 'more',
        markupEnabled: true,
        layoutData: {left: 10, right: 10, top: [introText, 1]},
        text: ""
      }).appendTo(scrollView);

    },

    draw2: function () {
      var that = this;

      that.page.children("#loading").first().set('visible', false);
      that.page.children("#panel").first().set('visible', true);

      that.page.children("#panel").first().children("#title").first().set({
        'text': '<b>' + that.news.item.title + '</b>'
      });

      that.page.children("#panel").first().children("#date").first().set({
        'text': moment(that.news.item.created).format('DD.MM.YYYY, HH:mm')
      });

      that.page.children("#panel").first().children("#mainimage").first().set({
        'image': {src: app.config.url + that.news.item.imageLarge}
      });

      that.page.children("#panel").first().children("#intro").first().set({
        'text': that.news.item.introtext
      });

      that.page.children("#panel").first().children("#more").first().set({
        'text': that.news.item.fulltext + "<br />"
      });

    },

    init: function () {
    }


  }

}
