// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Orders = new Meteor.Collection("orders");

if (Meteor.isClient) {

  var res = HTTP.get('pizzas.json', function(nothing, body) {
    console.log(body);
  });

  Template.pizzalist.entries = function () {
    return Orders.find({}, {sort: {score: -1, name: 1}});
  };

  Template.pizzalist.selected_name = function () {
    var entry = Orders.findOne(Session.get("selected_player"));
    return entry && entry.name;
  };

  Template.pizzalist.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.pizzalist.events({
    'click input.inc': function () {
      Orders.update(Session.get("selected_player"), {$inc: {score: 5}});
    }
  });

  Template.entry.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Orders.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Orders.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
    }
  });
}
