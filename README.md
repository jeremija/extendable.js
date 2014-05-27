#Extendable.js

A Node.js, AMD module, or global module which assists in extending objects and overriding object methods using prototypal inheritance.

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

##Extension of object literals

###extend()

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

###create()

Acts the same as if the `extend()` was called without any arguments, returns the same as calling `Object.create(this)`.

###override()

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
    // extend the object with the overridden method and modify the
    // variable which is used in the overridden method.
    .extend({
        b: 5
    });

original.sum(3, 4); // 1 + 2 + 3 + 4 = 10
extended.sum(3, 4); // (1 + 5 + 3 + 4) * 2 = 26
```

##Constructor extension

```javascript

// Person.js AMD module
define(['Extendable'], function(Extendable) {
    
    function Person(name) {
        this.name = name;
    }
    
    var PersonPrototype = {
        setJob: function(job) {
            this.job = job;
        },
        setAge: function(age) {
            this.age = age;
        }
    };
    
    return Extendable.extend(Person, PersonPrototype);
    
});

// Plumber.js AMD module
define(['Person'], function(Person) {
    
    function Plumber(name, tools) {
        this.superclass.call(this, name);
        
        this.setJob('plumber');
        this.setAge(25);
        this.setTools(tools);
    }
    
    var PlumberPrototype = {
        setTools: function(tools) {
            this.tools = tools;
        }
    };
    
    return Person.extend(Plumber, PlumberPrototype);
});

// index.js
require(['Plumber', 'Person'], function(Plumber, Person) {

    var joe = new Plumber('joe', 'wrench');
    
    // joe instanceof Plumber returns true
    // joe instanceof Person returns true
    // Person.prototype.isPrototypeOf(joe) returns true
    // Plumber.prototype.isPrototypeOf(joe) returns true
    
    // joe.age is 25
    // joe.job is 'plumber'
    // joe.tools is 'wrench'

});

```

#License

MIT
