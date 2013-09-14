// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Orders = new Meteor.Collection("orders");

if (Meteor.isClient) {

  var res = HTTP.get('pizzas.json', function(nothing, body) {
    console.log(body);
  });

  Template.pizzalist.entries = function () {
    return Orders.find({}, {sort: {name: 1}});
  };

  Template.pizzalist.events({
    'keydown, click input.inc': function (e) {
      if (e.type === 'click' || e.type === 'keydown' && e.which === 13) {
        var el = document.getElementById('pizzaname');
        if (el.value.length > 0)  {
          Orders.insert({name: el.value, amount: 1});
          el.value = "";
        }
      }
    },
    'click .action.plus': function () {
      Orders.update(this._id, {$inc: {amount: 1}});
    },
    'click .action.minus': function () {
      Orders.update(this._id, {$inc: {amount: -1}});
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    // Nothing yet!

    // if (Orders.find().count() === 0) {
    //   var names = ["Ada Lovelace",
    //                "Grace Hopper",
    //                "Marie Curie",
    //                "Carl Friedrich Gauss",
    //                "Nikola Tesla",
    //                "Claude Shannon"];
    //   for (var i = 0; i < names.length; i++)
    //     Orders.insert({name: names[i], amount: Math.floor(Random.fraction()*10)*5});
    // }
  });
}
