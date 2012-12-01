/* General functions */
if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun /*, thisp*/) {
    var len = this.length >>> 0;
    if (typeof fun != "function")
    throw new TypeError();

    var res = [];
    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in this) {
        var val = this[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, this))
        res.push(val);
      }
    }
    return res;
  };
}


/* Start Serendip library */
var Serendip = function () { };

Serendip.Events = (function () {
    var my = {};
    
    my.on = function(event, callback, context) {
      var callbacks = this._callbacks || (this._callbacks = {});
      var events = callbacks[event] || (callbacks[event] = []);
      events.push({ callback: callback, context: context });
    };

    my.off = function(event, callback, context) {
      if (!callback && !context) {
        delete this._callbacks[event];
      }

      var events = this._callbacks[event] || [];
      for (var i = 0; i < events.length; i++) {
        if (!(callback && events[i].callback !== callback || context && events[i].context !== context)) {
          events.splice(i, 1);
        }
      }
    };

    my.trigger = function(event) {
      var args = Array.prototype.slice.call(arguments, 1);
      var callbacks = this._callbacks || {};
      var events = callbacks[event] || [];
      for (var i = 0; i < events.length; i++) {
        var evt = events[i];
        evt.callback.apply(evt.context || this, args);
      }
    };
    
    return my;
}());
    