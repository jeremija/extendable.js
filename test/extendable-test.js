describe('Extendable', function() {
    describe('extend()', function() {
        it('should have the function extend', function() {
            expect(Extendable).to.be.ok();
            expect(Extendable.extend).to.be.a('function');
        });

        var newObject;
        var props = {
            b: 2,
            c: {
                d: 4
            }
        };
        it('should extend without errors', function() {
            newObject = Extendable.extend(props);
        });
        it('new object should have the same props as original', function() {
            expect(newObject).to.have.property('b');
            expect(newObject.b).to.be(props.b);
            expect(newObject).to.have.property('c');
            expect(newObject.c).to.be(props.c);
            expect(newObject.c.d).to.be(props.c.d);
        });
        it('new object should have the Extendable as a prototype', function() {
            expect(Extendable.isPrototypeOf(newObject)).to.be(true);
            expect(newObject.extend).to.be.a('function');
            expect(newObject.extend).to.be(Extendable.extend);
        });
    });
    describe('override()', function() {
        it('should have the function override', function() {
            expect(Extendable.override).to.be.a('function');
        });
        var original = {
            a: 1,
            b: 2,
            sum: function(c, d) {
                return this.a + this.b + c + d;
            }
        };
        it('should extend and override without errors', function() {
            // create the first object
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

            // original 1 + 2 + 3 + 4 = 10
            expect(original.sum(3, 4)).to.be(10);
            // extended (1 + 5 + 3 + 4) * 2 = 26
            expect(extended.sum(3, 4)).to.be(26);
        });
    });
    describe('create()', function() {
        it('should have the function create', function() {
            expect(Extendable.create).to.be.a('function');
        });
        it('objects should be able to coexist independently', function() {
            var MyObject = Extendable.extend({});

            var Module = MyObject.extend({
                name: 'unitialized-module',
                init: function(p_name) {
                    this.name = p_name;
                }
            });

            var module1 = Module.create();
            var module2 = Module.create();

            module1.init('mod1');
            expect(Module.name).to.be('unitialized-module');
            expect(module1.name).to.be('mod1');
            expect(module2.name).to.be('unitialized-module');

            module2.init('mod2');
            expect(Module.name).to.be('unitialized-module');
            expect(module1.name).to.be('mod1');
            expect(module2.name).to.be('mod2');
        });
    });
    describe('creating new instances', function() {
        var Class;
        it('should extend constructor with prototype', function() {
            function ClassConstructor(p_params) {
                this.a = p_params.a;
                this.b = p_params.b;
            }
            var ClassPrototype = {
                getA: function() {
                    return this.a;
                },
                getB: function() {
                    return this.b;
                }
            };
            Class = Extendable.extend(ClassConstructor, ClassPrototype);

            expect(Class).to.be(ClassConstructor);
            expect(Class.prototype.getA).to.be(ClassPrototype.getA);
            expect(Class.prototype.getB).to.be(ClassPrototype.getB);
            expect(Class.extend).to.be(Extendable._extendConstructor);
        });
        it('should instantiate with new', function() {
            var clazz = new Class({
                a: 1,
                b: 2
            });
            expect(clazz instanceof Class).to.be(true);
            expect(clazz.a).to.be(1);
            expect(clazz.getA()).to.be(1);
            expect(clazz.b).to.be(2);
            expect(clazz.getB()).to.be(2);
        });
        var ExtendedClass;
        it('should be able to extend constructor', function() {
            function ExtendedClassConstructor(p_params) {
                // Class.call(this, p_params);
                this.superclass(p_params);
                this.c = p_params.c;
            }
            var ExtendedClassPrototype = {
                getC: function() {
                    return this.c;
                }
            };
            ExtendedClass =
                Class.extend(ExtendedClassConstructor, ExtendedClassPrototype);

            expect(ExtendedClass.extend).to.be(Class.extend);
            expect(ExtendedClass).to.be(ExtendedClassConstructor);
        });
        it('extended class hould instantiate with new', function() {
            var extended = new ExtendedClass({
                a: 3,
                b: 4,
                c: 5
            });
            expect(extended instanceof ExtendedClass).to.be(true);
            expect(extended instanceof Class).to.be(true);
            expect(extended.a).to.be(3);
            expect(extended.b).to.be(4);
            expect(extended.c).to.be(5);
            expect(extended.getA()).to.be(3);
            expect(extended.getB()).to.be(4);
            expect(extended.getC()).to.be(5);
        });
    });
});