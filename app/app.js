// Generated by CoffeeScript 1.9.2
var app;

app = app || {};

app.main = {
  init: function() {
    resource_nodes['intro'].volume = 0.5;
    resource_nodes['intro'].play();
    setTimeout((function() {
      return fade_out(resource_nodes['intro']);
    }), 3000);
    hide('loading');
    app.menu.init();
    show('app');
  }
};
