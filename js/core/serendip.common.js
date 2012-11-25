
/* Start Serendip library */
var Serendip = function () { };

Serendip.Class = function () { 
    $.extend(this, Simple.Events);
};

Serendip.Class.extend = function (properties) {
    var klass = this;
    var subClass = function (options) {
        Serendip.extend(this, new klass(options), properties, options);
    }
    subClass.extend = this.extend;
        
    return subClass;
};

Serendip.extend = function () {
    var target = arguments[0] || {}, i = 1, length = arguments.length, options;
    for (; i < length; i++) {
        if ((options = arguments[i]) != null) {
            for (var name in options) {
                var src = target[name], copy = options[name];
                if (target === copy) {
                    continue;
                }
                if (copy && typeof copy == 'object' && !copy.nodeType) {
                    target[name] = Serendip.extend(src || (copy.length != null ? [] : {}), copy);
                }
                else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    return target;
};