// client-only collection to demo interoperability with server-side one
Fruits = new Mongo.Collection(null);

['Apple', 'Banana', 'Cherry', 'Date', 'Fig', 'Lemon', 'Melon', 'Prune', 'Raspberry', 'Strawberry', 'Blueberry', 'Blackberry', 'Boysenberry', 'Licorice', 'Watermelon', 'Tomato', 'Jackfruit', 'Kiwi', 'Lime', 'Clementine', 'Tangerine', 'Orange', 'Grape'].forEach(function (fruit) {
  Fruits.insert({type: fruit})
});

Template.pubsub.helpers({
  settings: function() {
    return {
      position: Session.get("position"),
      limit: 30,  // more than 20, to emphasize matches outside strings *starting* with the filter
      rules: [
        {
          token: '@',
          // string means a server-side collection; otherwise, assume a client-side collection
          collection: 'BigCollection',
          field: 'name',
          options: '', // Use case-sensitive match to take advantage of server index.
          template: Template.serverCollectionPill,
          noMatchTemplate: Template.serverNoMatch
        },
        {
          token: '!',
          collection: Fruits,  // Mongo.Collection object means client-side collection
          field: 'type',
          // set to true to search anywhere in the field, which cannot use an index.
          matchAll: true,  // 'ba' will match 'bar' and 'baz' first, then 'abacus'
          template: Template.clientCollectionPill
        }
      ]
    };
  }
});

Template.pubsub.events({
  "autocompleteselect textarea": function(e, t, doc) {
    console.log("selected ", doc);
  },
  "click #save": function(e){
    //get input value
    var text = $('#autocomplete-input').val();
    //clear input on save
    $('#autocomplete-input').val("");

    //split string on blank
    var testRE = text.split(" ");
    //find each word containing @
    _.each(testRE, function(word){
      if(word.indexOf("@") != -1){
        //insert each found tag to db
        var myWord = word.substr(1);
        BigCollection.insert({name: myWord});
      }
    });
  }
});
