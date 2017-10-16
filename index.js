"use strict";

function isAPromise(promise) {
    return promise !== null &&
        (typeof promise === "object" || typeof promise === "function") &&
        typeof promise.then === "function";
}

function isDeeplyEqualTo(a, b) {
    if (a === b) {
        return true;
    }

    if (a === null || b === null) {
        return false;
    }

    const type = typeof a;
    const otherType = typeof b;

    //TODO SUPPORT SYMBOLS
    if (type !== otherType ||
        type !== "object" ||
        a.constructor !== b.constructor) {
        return false;
    }

    if (Array.isArray(a)) {
        return a.length === b.length ? a.every(
            (elem, i) => isDeeplyEqualTo(elem, b[i])
        ) : false;
    }

    const names = Object.getOwnPropertyNames(a);

    if (names.length !== Object.getOwnPropertyNames(b).length) {
        return false;
    }

    return names.every(
        (name) => b.hasOwnProperty(name) && isDeeplyEqualTo(a[name], b[name])
    );
}

class AssertionError extends Error {
    constructor(message, expected, actual) {
        super(message);
        this.expected = expected;
        this.actual = actual;
    }
}


class Assertion {

    constructor(value) {
        this.__value = value;
    }

    //Properties

    get value() {
        return this.__value;
    }

    get andIt() {
        return this;
    }

    // ########### EQUALITY #############

    isEqualTo(expected) {
        if (expected !== this.value) {
            throw new AssertionError(
                "Expected: " + expected + " Actual: " + this.value,
                expected, this.value);
        }
        return this;
    }

    isNotEqualTo(notExpected) {
        if (notExpected === this.value) {
            throw new AssertionError(
                "Not Expected: " + notExpected + " Actual: " + this.value);
        }
        return this;
    }

    isDeeplyEqualTo(expected) {
        if (!isDeeplyEqualTo(this.value, expected)) {
            throw new Assert.Error(
                "Value is not deep equal to argument",
                expected, this.value);
        }
        return this;
    }

    // ######### IS & IS NOT ############

    isNull() {
        if (this.value !== null) {
            throw new AssertionError("Value is not null", null, this.value);
        }
        return this;
    }

    isNotNull() {
        if (this.value === null) {
            throw new AssertionError("Value is null",
                "Not null", this.value);
        }
        return this;
    }

    isUndefined() {
        if (typeof this.value !== "undefined") {
            throw new AssertionError("Value in not undefined",
                undefined, this.value);
        }
        return this;
    }

    isNotUndefined() {
        if (typeof this.value === "undefined") {
            throw new AssertionError("Value is undefined",
                "Not undefined", this.value);
        }
        return this;
    }

    isNaN() {
        if (!isNaN(this.value)) {
            throw new AssertionError("Value in not NaN", NaN, this.value);
        }
        return this;
    }

    isNotNaN() {
        if (isNaN(this.value)) {
            throw new AssertionError("Value is NaN", "Not NaN", this.value);
        }
        return this;
    }

    isAPromise() {
        if (!isAPromise(this.value)) {
            throw new AssertionError("Value is not a promise");
        }
        return this;
    }

    isNotAPromise() {
        if (isAPromise(this.value)) {
            throw new AssertionError("Value is a promise");
        }
        return this;
    }

    isANumber() {
        if (typeof this.value !== "number") {
            throw new AssertionError("Value is not a number");
        }
    }

    isNotANumber() {
        if (typeof this.value === "number") {
            throw new AssertionError("Value is a number");
        }
    }

    isAString() {
        if (typeof this.value !== "string") {
            throw new AssertionError("Value is not a string");
        }
    }

    isNotAString() {
        if (typeof this.value === "string") {
            throw new AssertionError("Value is a string");
        }
    }

    isAnArray() {
        if (!Array.isArray(this.value)) {
            throw new AssertionError("Value is not an array",
                "array", this.value);
        }
        return this;
    }

    isNotAnArray() {
        if (Array.isArray(this.value)) {
            throw new AssertionError("Value is an array",
                "Not array", this.value);
        }
        return this;
    }

    // ############ PROPERTIES ##############

    hasProperty(name, cb) {
        if (!(this.value && name in this.value)) {
            throw new AssertionError("missing property " + name + " in value");
        }

        if (typeof cb === "function") {
            cb(Assert.that(this.value[name]));
        }
        return this;
    }

    doesNotHaveProperty(name) {
        if (this.value && name in this.value) {
            throw new AssertionError("found property " + name + " in value");
        }
        return this;
    }

    hasOwnProperty(name, cb) {
        if (!(this.value instanceof Object &&
            this.value.hasOwnProperty(name))) {
            throw new AssertionError(
                "missing own property " + name + " in value");
        }
        if (typeof cb === "function") {
            cb(Assert.that(this.value[name]));
        }
        return this;
    }

    doesNotHaveOwnProperty(name) {
        if (this.value instanceof Object && this.value.hasOwnProperty(name)) {
            throw new AssertionError(
                "found own property " + name + " in value");
        }
        return this;
    }

    //TODO Is this correct?
    hasLengthOf(test) {
        const length = this.value && this.value.length;
        if (Number.isInteger(test)) {
            if (length !== test) {
                throw new AssertionError("Length does not match", test, length);
            }
        } else if (typeof test === "function") {
            test(new Assertion(length));
        } else {
            throw new Error ("Requires integer or function");
        }
        return this;
    }

    isFulfill(cb) {
        return this.value.then(
            value => typeof cb === "function" ?
                cb(Assert.that(value)) :
                value,
            ex => {
                throw new AssertionError(
                    "No rejection expected", "Resolved promise", ex);
            }
        );
    }

    isRejected(cb) {
        return this.value.then(
            value => {
                throw new AssertionError(
                    "Rejection expected but resolved with value: " + value);
            },
            ex => typeof cb === "function" ? cb(Assert.that(ex)) : ex
        );
    }

    isAbove(number) {
        if (this.value <= number) {
            throw new AssertionError(
                "Value is not above expected", number, this.value);
        }
        return this;
    }

    isAtLeast(number) {
        if (this.value < number) {
            throw new AssertionError(
                "Value is not at least as expected", number, this.value);
        }
        return this;
    }

    isBelow(number) {
        if (this.value >= number) {
            throw new AssertionError(
                "Value is not below expected", number, this.value);
        }
        return this;
    }

    isAtMost(number) {
        if (this.value > number) {
            throw new AssertionError(
                "Value is not at most as expected", number, this.value);
        }
        return this;
    }

    satisfies(cb) {
        if (typeof cb !== "function") {
            throw new Error("satifices requires a callback function");
        }
        const result = cb(this.value);
        if (!result) {
            throw new AssertionError("It does not satifice");
        }
        return this;
    }

    isInstanceOf(clazz) {
        if (!(this.value instanceof clazz)) {
            throw new AssertionError(
                "value is not instance of class", clazz, this.value);
        }
        return this;
    }

    anyOf(iterable) {
        if (!Array.isArray(iterable)) {
            throw new Error("anyOf must receive an iterable");
        }
        for (const cb of iterable) {
            try {
                cb(this);
                return this; //hooray!
            } catch (ex) {
                //Ignore the exception
            }
        }
        throw new AssertionError(
            "Value does not pass any assertion in the list");
    }

    isFrozen() {
        if (!Object.isFrozen(this.value)) {
            throw new AssertionError("Value is not frozen");
        }
        return this;
    }


    isNotFrozen() {
        if (Object.isFrozen(this.value)) {
            throw new AssertionError("Value is frozen");
        }
        return this;
    }

    throws(test) {
        const cb = this.value;
        if (typeof cb !== "function") {
            throw new Error("Assert throws requires a function");
        }
        try {
            this.value();
        } catch (ex) {
            if (typeof test === "function") {
                if (typeof test.prototype.constructor === "function") {
                    if (!(ex instanceof test)) {
                        throw new AssertionError(
                            "Error class does not match",
                            test.prototype.constructor.name,
                            ex.constructor.name);
                    }
                } else {
                    test(new Assertion(ex));
                }
            }
            return;
        }
        throw new AssertionError("Exception not thrown");
    }

}

function assertThat(object, path) {
    return new Assertion(object, path);
}

function addPlugin (cb) {
    cb(Assertion.prototype, 1);
}

class Assert {
    constructor () {
        throw Error("no instances allowed");
    }
}

Assert.that = assertThat;
Assert.addPlugin = addPlugin;
Assert.Error = AssertionError;


// function dummy() {
//     class Dummy {}
//     Dummy.__instance = new Dummy;
//     Dummy.that = function () { return Dummy.__instance; };

//     Object.getOwnPropertyNames(Assertion.prototype)
//         .filter(it => it !== "constructor")
//         .filter(it => typeof Assert.prototype[it] === "function")
//         .forEach(it => Dummy.prototype[it] = it.startsWith("will") ? ()
//=> Promise.resolve() : () => Dummy.__instance);
// }

module.exports = Assert;
