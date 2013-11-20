#Extendable.js

A Node.js, AMD module, or global module which assists in extending objects and overriding object methods.

#Usage

##Node.js

```javascript
    var Extendable = require('extendable.js');
```

##AMD require

```javascript
require(['extendable.js'], function(Extendable) {
    //
});
```

or you can use it as a global variable `window.Extendable` in your browser.

#Examples

##extend()

`extend(props)` creates a new object, set the current object (`this`) as the object's prototype and copies the first-level properties of `props` to the new object.

```javascript
var props = {
    a: 1,
    b: {
      c: 3
    }
};
var extended = Extendable.extend(props);
````

Object `extended` has properties a and b copied from `props` and it's prototype is Extendable:

```javascript
extended.a === props.a;             // returns true
extended.b === props.b;             // returns true
Extendable.isPrototypeOf(extended); // returns true
```

##create()

Acts the same as if the `extend()` was called without any arguments, returns the same as calling `Object.create(this)`.

##override()

`override(methodName, newMethod)` overrides an existing method `methodName` in the object and adds the ability to call the overridden method from the new method:

```javascript
var obj1 = Extendable.extend({
    value: 5,
    calculate: function(a) {
        return this.value + a;
    }
});

var obj2 = obj1.extend().override('calculate', function(p_super, a, b) {
    return p_super(a) + b;
});

obj1.calculate(3);     // returns 8
obj2.calculate(3, 10); // returns 18
```

Additional combinations are possible:

```javascript
var original = {
    a: 1,
    b: 2,
    sum: function(c, d) {
        return this.a + this.b + c + d;
    }
};

var extended = Extendable.extend(original)
    // override the sum method
    .override('sum', function(p_super, c, d) {
        var value = p_super(c, d);
        return value * 2;
    })
    // extend the with the overridden method and modify the
    // variable which is used in the overridden method.
    .extend({
        b: 5
    });

original.sum(3, 4); // 1 + 2 + 3 + 4 = 10
extended.sum(3, 4); // (1 + 5 + 3 + 4) * 2 = 26
```

#License

MIT