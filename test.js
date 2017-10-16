"use strict";

/* eslint-disable no-console */

const Assert = require(".");
const identity = v => v;

function equals() {
    const a = 4;
    const b = 5;
    const c = "4";

    Assert.that(a).isEqualTo(a);
    Assert.that(a).isNotEqualTo(b);

    Assert.that(() => Assert.that(a).isEqualTo(b)).throws(Assert.Error);
    Assert.that(() => Assert.that(a).isNotEqualTo(a)).throws(Assert.Error);
    Assert.that(() => Assert.that(a).isEqualTo(c)).throws(Assert.Error);
}

function nulls() {
    Assert.that(null).isNull();
    Assert.that("banana").isNotNull();

    Assert.that(() => Assert.that("apple").isNull()).throws(Assert.Error);
    Assert.that(() => Assert.that(null).isNotNull()).throws(Assert.Error);
}

function undefines() {
    Assert.that(undefined).isUndefined();
    Assert.that(null).isNotUndefined();

    Assert.that(() => Assert.that(null).isUndefined()).throws(Assert.Error);
    Assert.that(() => Assert.that(undefined).isNotUndefined())
        .throws(Assert.Error);
}

function naNs() {
    Assert.that(NaN).isNaN();
    Assert.that(4).isNotNaN();

    Assert.that(() => Assert.that(4).isNaN()).throws(Assert.Error);
    Assert.that(() => Assert.that(NaN).isNotNaN()).throws(Assert.Error);
}


function promises() {

    function testRejection(promise) {
        return promise.then(() => {
            throw new Error ("Rejection expected");
        }, identity);
    }

    const resolved = Promise.resolve(true);
    const rejected = Promise.reject(new Error("A terrible error"));

    Assert.that(resolved).isAPromise();
    Assert.that("BANANA").isNotAPromise();

    Assert.that(() => Assert.that("BANANA").isAPromise()).throws(Assert.Error);
    Assert.that(() => Assert.that(resolved).isNotAPromise())
        .throws(Assert.Error);

    return Promise.all([
        Assert.that(resolved).isFulfilled(),
        Assert.that(rejected).isRejected(),
        Assert.that(resolved).isFulfilled(it => it.isEqualTo(true)),
        Assert.that(rejected).isRejected((error) => {
            error.hasProperty("message",
                value => value.isEqualTo("A terrible error"));
        }),
        Assert.that(resolved).becomes(true),
        Assert.that(rejected).isRejectedWith(Error),
        testRejection(Assert.that(rejected).isFulfilled()),
        testRejection(Assert.that(resolved).isRejected()),
        testRejection(Assert.that(resolved).isFulfilled((value) =>
            value.isEqualTo(false)
        )),
        testRejection(Assert.that(rejected).isRejected((error) => {
            error.hasProperty("message",
                value => value.isEqualTo("A terrible mistake"));
        }))
    ]);
}

function properties() {
    const object = { a: 1, b: "text", c: null };
    Assert.that(object).hasProperty("a");
    Assert.that(object).hasProperty("a", it => it.isEqualTo(1));
    Assert.that(() => Assert.that(object).hasProperty("x"))
        .throws(Assert.Error);
    Assert.that(() => Assert.that(object)
        .hasProperty("a", it => it.isEqualTo(2))).throws(Assert.Error);

    Assert.that(object).doesNotHaveProperty("z");
    Assert.that(() => Assert.that(object).doesNotHaveProperty("a"))
        .throws(Assert.Error);
}

function ownProperties() {
    const object = { a: 1, b: "text", c: null };
    Assert.that(object).hasOwnProperty("a");
    Assert.that(object).hasOwnProperty("a", value => value.isEqualTo(1));
    Assert.that(() => Assert.that(object).hasOwnProperty("x"))
        .throws(Assert.Error);
    Assert.that(() => Assert.that(object)
        .hasOwnProperty("a", value => value.isEqualTo(2))).throws(Assert.Error);

    Assert.that(object).doesNotHaveOwnProperty("z");
    Assert.that(() => Assert.that(object).doesNotHaveOwnProperty("a"))
        .throws(Assert.Error);
}

function numbers() {

    Assert.that(4.3).isANumber();
    Assert.that("5").isNotANumber();

    Assert.that(() => Assert.that("3").isANumber()).throws(Assert.Error);
    Assert.that(() => Assert.that(3).isNotANumber()).throws(Assert.Error);

    Assert.that(3).isAbove(2);
    Assert.that(3).isAtLeast(2);
    Assert.that(3).isAtLeast(3);
    Assert.that(2).isBelow(3);
    Assert.that(2).isAtMost(2);
    Assert.that(2).isAtMost(3);

    Assert.that(() => Assert.that(3).isAbove(3)).throws(Assert.Error);
    Assert.that(() => Assert.that(3).isAbove(4)).throws(Assert.Error);
    Assert.that(() => Assert.that(3).isAtLeast(4)).throws(Assert.Error);
    Assert.that(() => Assert.that(3).isBelow(3)).throws(Assert.Error);
    Assert.that(() => Assert.that(3).isBelow(2)).throws(Assert.Error);
    Assert.that(() => Assert.that(3).isAtMost(2)).throws(Assert.Error);
}

function strings() {

    const string1 = "banana";

    Assert.that("a").isAString();
    Assert.that(1).isNotAString();
    Assert.that(new String("a")).isNotAString();

    Assert.that(() => Assert.that(2).isAString()).throws(Assert.Error);
    Assert.that(() => Assert.that("d").isNotAString()).throws(Assert.Error);

    Assert.that(string1).hasLengthOf(string1.length);
    Assert.that(string1).hasLengthOf(it => it.isAbove(string1.length - 1));

    Assert.that(() => Assert.that(string1).hasLengthOf(string1.length + 1))
        .throws(Assert.Error);
    Assert.that(() => Assert.that(string1).hasLengthOf(
        it => it.isAbove(string1.length + 1))
    ).throws(Assert.Error);
}

function arrays() {
    const array1 = [2, 1, 3, 1];

    Assert.that(array1).isAnArray();
    Assert.that("banana").isNotAnArray();

    Assert.that(() => Assert.that("banana").isAnArray()).throws(Assert.Error);
    Assert.that(() => Assert.that(array1).isNotAnArray()).throws(Assert.Error);

    Assert.that(array1).hasLengthOf(array1.length);
    Assert.that(array1).hasLengthOf(it => it.isAbove(array1.length - 1));

    Assert.that(() => Assert.that(array1).hasLengthOf(array1.length + 1))
        .throws(Assert.Error);
    Assert.that(() => Assert.that(array1).hasLengthOf(
        it => it.isAbove(array1.length + 1))
    ).throws(Assert.Error);
}

function throws() {
    function testException(fn) {
        try {
            fn();
        } catch (e) {
            if (!(e instanceof Assert.Error)) {
                throw new Error(fn + " should throw an Assert.Error");
            }
            return;
        }
        throw new Error(fn + " should throw an exception");
    }

    class SomeError extends Error {}

    Assert.that(() => { throw new Error(); }).throws();
    Assert.that(() => { throw new SomeError(); }).throws(SomeError);

    testException(() => { Assert.that(() => {}).throws(); });
    testException(() => { Assert.that(() => { throw new Error(); })
        .throws(SomeError);
    });
}

function satisfies() {
    const value = "banana";
    Assert.that(value).satisfies(value => value === "banana");
    Assert.that(() => Assert.that(value).satisfies(value => value === "lemon"))
        .throws(Assert.Error);
}

function anyOf() {
    const number = 2;
    Assert.that(number).isAnyOf([it => it.isAnArray(), it => it.isANumber()]);
    Assert.that(() => Assert.that(number).isAnyOf([
        it => it.isAnArray()
    ])).throws(Assert.Error);
}

function frozens() {
    const frozen = Object.freeze({});
    const notFrozen = {};

    Assert.that(frozen).isFrozen();
    Assert.that(notFrozen).isNotFrozen();

    Assert.that(() => Assert.that(notFrozen).isFrozen()).throws(Assert.Error);
    Assert.that(() => Assert.that(frozen).isNotFrozen()).throws(Assert.Error);
}

function plugins() {
    const banana = "I am a banana!";
    const apple = "I am an apple";

    Assert.addPlugin((proto) => {
        proto.isABanana = function isABanana() {
            if (this.value !== banana) {
                throw new Assert.Error("It not a banana");
            }
            return this;
        };
    });

    Assert.that(banana).isABanana();
    Assert.that(() => Assert.that(apple).isABanana()).throws(Assert.Error);
}

function isInstanceOf() {
    const object = {};
    Assert.that(object).isInstanceOf(Object);
    Assert.that(() => Assert.that(object).isInstanceOf(Array))
        .throws(Assert.Error);
}

function deeplyEquals() {

    const obj1 = { a: 1, b: "str", c: null, d: { a: "deep" }};
    const obj2 = { a: 1, b: "str", c: null, d: { a: "deep" }};
    const obj3 = { a: 1, b: "str", c: null, d: { b: "deep" }};
    const obj4 = { a: 1, b: "str", c: 5};

    const deepObject1 = { a: { b: { c: "banana" } } };
    const deepObject2 = { a: { b: { c: "banana" } } };

    Assert.that(obj1).isDeeplyEqualTo(obj2);
    Assert.that(null).isDeeplyEqualTo(null);
    Assert.that(undefined).isDeeplyEqualTo(undefined);
    Assert.that(3).isDeeplyEqualTo(3);
    Assert.that({}).isDeeplyEqualTo({});
    Assert.that(deepObject1).isDeeplyEqualTo(deepObject2);
    Assert.that([]).isDeeplyEqualTo([]);
    Assert.that([1]).isDeeplyEqualTo([1]);
    Assert.that([1, 3]).isDeeplyEqualTo([1, 3]);
    Assert.that([1, obj1]).isDeeplyEqualTo([1, obj2]);
    Assert.that([1, [1, obj1]]).isDeeplyEqualTo([1, [1, obj2]]);

    Assert.that(() => Assert.that(obj1).isDeeplyEqualTo(obj3))
        .throws(Assert.Error);
    Assert.that(() => Assert.that(obj1).isDeeplyEqualTo(obj4))
        .throws(Assert.Error);
    Assert.that(() => Assert.that(obj1).isDeeplyEqualTo(null))
        .throws(Assert.Error);
    Assert.that(() => Assert.that(null).isDeeplyEqualTo(obj1))
        .throws(Assert.Error);
    Assert.that(() => Assert.that(4).isDeeplyEqualTo(3))
        .throws(Assert.Error);
    Assert.that(() => Assert.that(undefined).isDeeplyEqualTo(null))
        .throws(Assert.Error);
    Assert.that(() => Assert.that([]).isDeeplyEqualTo({})).throws(Assert.Error);
    Assert.that(() => Assert.that([[1, obj1]]).isDeeplyEqualTo([[1, obj3]]))
        .throws(Assert.Error);
    Assert.that(() => Assert.that([]).isDeeplyEqualTo({ length: 0 }))
        .throws(Assert.Error);
    Assert.that(() => Assert.that(["banana"]).isDeeplyEqualTo([2]))
        .throws(Assert.Error);
    Assert.that(() => Assert.that([1, 3]).isDeeplyEqualTo([3, 1]))
        .throws(Assert.Error);
    Assert.that(() => Assert.that(["4"]).isDeeplyEqualTo([4]))
        .throws(Assert.Error);
}

Promise.resolve()
    .then(equals)
    .then(deeplyEquals)
    .then(numbers)
    .then(strings)
    .then(promises)
    .then(properties)
    .then(ownProperties)
    .then(nulls)
    .then(undefines)
    .then(naNs)
    .then(arrays)
    .then(throws)
    .then(satisfies)
    .then(anyOf)
    .then(frozens)
    .then(plugins)
    .then(isInstanceOf)
    .catch((e) => {
        console.error(e);
        process.exitCode = 1;
    });
