

module.exports = function (app) {



  return {

    offset: 0,

    items: {},

    draw: function () {
      var that = this;

      var page = new tabris.Page({
        title: "",
        topLevel: true
      });



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

var page = new tabris.Page({
  title: "Collection View",
  topLevel: true
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


      app.pages.list = page;
    },

    init: function () {
      this.draw();
    },

    load: function () {

    },

    open: function () {

    }



  }

}
