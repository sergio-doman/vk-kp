
var _ = require('lodash');
var moment = require('moment');
var DOMParser = require('xmldom').DOMParser;

module.exports = function (app) {

  var collectionItemHeight = 80;
  var rssItemsLength = 10;


  return {

    page: {},

    catId: 0,
    guids: [],
    total: 0,

    progress: false,
    stopAppending: false,

    draw: function () {
      var that = this;

      var page = that.page = new tabris.Page({
        title: "",
        topLevel: true
      });

      new tabris.CollectionView({
        id: 'newslist',
        layoutData: {left: 0, top: 0, right: 0, bottom: 0},
        items: [],
        refreshEnabled: true,
        itemHeight: collectionItemHeight,
        initializeCell: function(cell) {

          var imageView = new tabris.ImageView({
            layoutData: {right: 1, top: 1, bottom: 1, width: 100},
            scaleMode: "fill"
          }).appendTo(cell);

          var dateTextView = new tabris.TextView({
            layoutData: {left: 10, right: 10, bottom: 1, height: 30},
            textColor: '#444',
            markupEnabled: true,
            text: "",
            alignment: "left"
          }).appendTo(cell);

          var titleTextView = new tabris.TextView({
            layoutData: {left: 10, top: 10, right: [imageView, 10], bottom: [dateTextView, 5]},
            textColor: 'black', //   '#a01514',
            alignment: "left"
          }).appendTo(cell);

          cell.on("change:item", function(widget, obj) {
            that.guids.push(obj.guid);

            imageView.set("image", {src: obj.img ? obj.img : 'res/img/no-image.png'});
            dateTextView.set("text", '<small>' + obj.date + '</small>');
            titleTextView.set("text", obj.title);
          });
        }
      })
      .on("refresh", function() {
        that.refresh();
      })
      .on("select", function(target, value) {
        app.states.view.open(value);
      })
      .on("scroll", function(collectionView, event) {
        if (collectionView.get("lastVisibleIndex") == that.total - 1) {
          that.append();
        }
      })
      .appendTo(that.page);
    },

    init: function () {
      this.draw();
    },

    fetchRss: function (catId, offset, callback) {
      var that = this;

      if ('undefined' == typeof offset) {
        offset = 0;
      }

      that.progress = true;

      that.page.children("#newslist").first().set({
        refreshIndicator: true,
        refreshMessage: 'Завантаження..'
      });

      var urlRss = app.config.url + 'novini/zmist/' + catId + '-?format=feed';
      if (offset > 0) {
        urlRss += '&start=' + offset;
      }

      fetch(urlRss).then(function(response) {
        return response.text();
      }).catch(function(err) {
        that.progress = false;
        that.page.children("#newslist").first().set({
          refreshIndicator: false,
          refreshMessage: ''
        });

        callback('Network error');
      }).then(function(str) {

        var response = {
          items: [],
          total: 0
        };

        var xml = new DOMParser().parseFromString(str, 'text/xml');
        var xmlItems = xml.getElementsByTagName("rss")[0].getElementsByTagName("channel")[0].getElementsByTagName("item");

        response.total = xmlItems.length;

        for (var i = 0; i < xmlItems.length; i++) {
          var item = {
            "title": xmlItems[i].getElementsByTagName("title")[0].firstChild.nodeValue,
            "link": xmlItems[i].getElementsByTagName("link")[0].firstChild.nodeValue,
            "guid": xmlItems[i].getElementsByTagName("guid")[0].firstChild.nodeValue,
            "author": xmlItems[i].getElementsByTagName("author")[0].firstChild.nodeValue,
            "category": xmlItems[i].getElementsByTagName("category")[0].firstChild.nodeValue,
            "description": xmlItems[i].getElementsByTagName("description")[0].firstChild.nodeValue,
            "pubDate": new Date(xmlItems[i].getElementsByTagName("pubDate")[0].firstChild.nodeValue)
          };

          var img = item.description.match(/"K2FeedImage"><img src="(.+?)"/i);
          if (img.length >= 2) {
            item.img = img[1];
          }

          item.date = moment(item.pubDate).format('DD.MM.YYYY, HH:mm');

          item.description = '';

          response.items.push(item);
        }

        if (response.items.length < rssItemsLength) {
          that.stopAppending = true;
        }

        that.progress = false;
        that.page.children("#newslist").first().set({
          refreshIndicator: false,
          refreshMessage: ''
        });

        callback(null, response);
      });
    },

    refresh: function () {
      var that = this;

      if (that.progress) {
        return;
      }

      that.fetchRss(that.catId, 0, function (err, data) {
        if (err) {
          window.plugins.toast.showShortTop(err);
        }
        else if (data.total > 0) {

          var newItems = _.filter(data.items, function(i) {
            return -1 == _.indexOf(that.guids, i.guid);
          });

          if (newItems.length > 0) {
            that.total += newItems.length;
            that.page.children("#newslist").first().insert(newItems, 0);
          }

        }
      });

    },

    append: function () {
      var that = this;

      if (that.stopAppending || that.progress) {
        return;
      }

      that.fetchRss(that.catId, that.total, function (err, data) {
        if (err) {
          window.plugins.toast.showShortTop(err);
        }
        else if (data.total > 0) {
          that.total += data.total;
          that.page.children("#newslist").first().insert(data.items);

          setTimeout(function () {
            if ( that.page.children("#newslist").first().get("lastVisibleIndex") == that.total - 1) {
              that.append();
            }
          }, 1000);
        }

      });
    },

    clear: function () {
      var that = this;

      that.guids = [];
      that.progress = false;
      that.stopAppending = false;
      that.page.children("#newslist").first().set('items', []);
      that.total = 0;
    },

    open: function (catId) {
      var that = this;

      if (app.analytics) {
        app.analytics.sendAppView('list');
      }

      that.clear();
      that.catId = catId;

      that.append();
      that.page.set('title', app.catsNames[catId]);
      that.page.open();
    }



  }

}
