/* Start Serendip library */
var Serendip = function () { };

Serendip.Events = (function () {
    var my = {};
    
    var _callbacks = {};
    
    my.on = function(event, callback, context) {
      var callbacks = _callbacks || (_callbacks = {});
      var events = callbacks[event] || (callbacks[event] = []);
      events.push({ callback: callback, context: context });
    };

    my.off = function(event, callback, context) {
      if (!callback && !context) {
        delete _callbacks[event];
      }

      var events = _callbacks[event] || [];
      for (var i = 0; i < events.length; i++) {
        if (!(callback && events[i].callback !== callback || context && events[i].context !== context)) {
          events.splice(i, 1);
        }
      }
    };

    my.trigger = function(event) {
      var args = Array.prototype.slice.call(arguments, 1);
      var callbacks = _callbacks || {};
      var events = callbacks[event] || [];
      for (var i = 0; i < events.length; i++) {
        var evt = events[i];
        evt.callback.apply(evt.context || my, args);
      }
    };
    
    return my;
}());
    