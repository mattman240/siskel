var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    // change the state of the like
    this.set('like', !this.get('like'));
  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {
    // when collection or model changes
    this.on('change', function() {
      // sort the list
      this.sort();
    });
  },

  comparator: 'title',

  sortByField: function(field) {
    // update sort field
    this.comparator = field;
    // re-sort the list
    this.sort();
  }

});

var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    // on a change it should invoke a funtion
    // that rerenders the page
    this.model.on('change', this.render, this);
  },

  events: {
    'click button': 'handleClick',
    // 'change': 'render'
  },

  handleClick: function() {
    // turn a click into a toggle of the like attribute
    this.model.toggleLike();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {
    // needs to re-render when sorted
    this.collection.on('sort', this.render, this);
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
