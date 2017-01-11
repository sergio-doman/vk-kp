
var DOMParser = require('xmldom').DOMParser;


module.exports = function (app) {



  return {

    page: {},

    catId: 0,

    pagination: {
      offset: 0,
      count: 0
    },

    draw: function () {
      var that = this;

      var page = that.page = new tabris.Page({
        title: "",
        topLevel: true
      });

      // page.children("#loading").first().

      new tabris.TextView({
        id: 'loading',
        layoutData: {centerX: 0, centerY: 0},
        alignment: "center",
        textColor: "black",
        visible: false,
        text: "Завантаження.."
      }).appendTo(that.page);


/*
      that.elements.loading.animate({
          opacity: 0.25,
          transform: {
            rotation: 0.75 * Math.PI,
            scaleX: 2.0,
            scaleY: 2.0
//            translationX: 100,
//            translationY: 200
          }
        }, {
          delay: 0,
          duration: 1000,
          repeat: 1,
          reverse: true,
          easing: "ease-out"
        }
      );
*/

/*
var IMAGE_PATH = "images/";
var people = [
  ["Holger", "Staudacher", "holger.jpg"],
  ["Ian", "Bull", "ian.jpg"],
  ["Jochen", "Krause", "jochen.jpg"],
  ["Jordi", "Böhme López", "jordi.jpg"],
  ["Markus", "Knauer", "markus.jpg"],
  ["Moritz", "Post", "moritz.jpg"],
  ["Ralf", "Sternberg", "ralf.jpg"],
  ["Tim", "Buschtöns", "tim.jpg"]
].map(function(element) {
  return {firstName: element[0], lastName: element[1], image: IMAGE_PATH + element[2]};
});


new tabris.CollectionView({
  layoutData: {left: 0, top: 0, right: 0, bottom: 0},
  items: people,
  itemHeight: 32,
  initializeCell: function(cell) {
    var nameTextView = new tabris.TextView({
      layoutData: {left: 30, top: 16, right: 30},
      alignment: "center"
    }).appendTo(cell);
    cell.on("change:item", function(widget, person) {

      nameTextView.set("text", person.firstName);
    });
  }
}).on("select", function(target, value) {
  console.log("selected", value.firstName);
}).appendTo(page);
*/

    },

    init: function () {
      this.draw();
    },

    fetch: function (catId, offset, callback) {
      var url = app.config.url + 'novini/zmist/' + catId + '-?format=feed';
      console.log('url: ', url);

      fetch(url).then(function(response) {
        return response.text();
      }).catch(function(err) {
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
            "author": xmlItems[i].getElementsByTagName("author")[0].firstChild.nodeValue,
            "category": xmlItems[i].getElementsByTagName("category")[0].firstChild.nodeValue,
            "description": xmlItems[i].getElementsByTagName("description")[0].firstChild.nodeValue,
            "pubDate": xmlItems[i].getElementsByTagName("pubDate")[0].firstChild.nodeValue
          };

          response.items.push(item);
        }

        callback(null, response);
      });


/*
      var req = request(url);

      var feedparser = new FeedParser();

      req.on('error', function (error) {
        callback('Network error');
      });

      req.on('response', function (res) {
        var stream = this; // `this` is `req`, which is a stream

        if (res.statusCode !== 200) {
          this.emit('error', new Error('Bad status code'));
        }
        else {
          stream.pipe(feedparser);
        }
      });

      feedparser.on('error', function (error) {
        // always handle errors
        callback('Invalid response');
      });


      feedparser.on('readable', function () {

        var stream = this;
        var meta = this.meta;
        var item;

        while (item = stream.read()) {
          console.log(item);
        }
      });
*/
    },

    update: function () {
      console.log('update fresh news list');
    },

    load: function (catId, offset) {
      console.log('load123 ', catId);
      this.fetch(catId, 0, function (err, data) {
        console.log('fetched ', err);
      });
    },

    open: function (catId) {
      this.load(catId);
      this.catId = catId;
      this.page.set('title', app.catsNames[catId]);
      this.page.children("#loading").first().set('visible', true);
      this.page.open();
    }



  }

}
