/* This script expects node.js  and mocha */

"use strict";

describe("BitSet", function () {
  const TypedFastBitSet = require("../TypedFastBitSet.js");

  function arraysEquals(a, b) {
    let i = a.length;
    if (i != b.length) return false;
    while (i--) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  it("Testing set/get/clear", function () {
    const mb = new TypedFastBitSet();
    const N = 1024;
    for (let i = 0; i < N; i++) {
      mb.add(i);
      if (!mb.has(i)) throw "set did not register";
      if (mb.size() != i + 1) throw "cardinality bug " + i + " " + mb.size();
      for (let j = 0; j <= i; j++) {
        if (!mb.has(j)) throw "bad get";
      }
      for (let j = i + 1; j < N; j++) {
        if (mb.has(j)) throw "bad get";
      }
    }
    for (let i = N - 1; i >= 0; i--) {
      mb.remove(i);
      if (mb.has(i)) throw "clear did not register";
      if (mb.size() != i) throw "cardinality bug " + i + " " + mb.size();
      for (let j = 0; j < i; j++) {
        if (!mb.has(j)) throw "bad get";
      }
      for (let j = i; j < N; j++) {
        if (mb.has(j)) throw "bad get";
      }
    }
  });

  it("Testing init", function () {
    const ai = [1, 2, 4, 5, 10];
    const mb = new TypedFastBitSet(ai);
    if (mb.size() != ai.length) throw "bad init";
  });

  it("Testing array", function () {
    for (let i = 0; i < 128; i++) {
      for (let j = 0; j < i; j++) {
        const ai = [j, i];
        const mb = new TypedFastBitSet(ai);
        if (!arraysEquals(ai, mb.array())) throw "bad array";
      }
    }
  });

  it("Testing card", function () {
    for (let offset = 1; offset < 32; offset++) {
      const mb = new TypedFastBitSet();
      for (let i = 0; i < 1024; i++) {
        mb.add(i * offset);
        if (mb.size() != i + 1)
          throw "bad card " + i + " offset = " + offset + " " + mb.size();
      }
    }
  });

  it("Testing values", function () {
    const ai = [1, 2, 4, 5, 10];
    const mb = new TypedFastBitSet(ai);
    const a = mb.array();
    if (!arraysEquals(a, ai)) throw "bad values";
    for (let i = 0; i < a.length; i++) {
      if (!mb.has(a[i])) throw "bad enumeration";
    }
  });

  it("Testing clone", function () {
    const ai = [1, 2, 4, 5, 10, 31, 32, 63, 64];
    const mb = new TypedFastBitSet(ai);
    const mb2 = mb.clone();
    const a = mb2.array();
    if (!arraysEquals(a, ai)) throw "bad values";
    if (!mb.equals(mb2)) throw "bad clone";
  });

  it("Testing trim", function () {
    const ai = [1, 2, 4, 5, 10, 31, 32, 63, 64, 127, 2030];
    const mb = new TypedFastBitSet(ai);
    const mb2 = mb.clone();
    mb2.trim();
    const a = mb2.array();
    if (!arraysEquals(a, ai)) throw "bad values";
    if (!mb.equals(mb2)) throw "bad trim/clone";
  });

  it("Testing intersection", function () {
    const a1 = [1, 2, 4, 5, 10];
    const a2 = [1, 2, 4, 5, 10, 100, 1000];
    const mb1 = new TypedFastBitSet(a1);
    const mb2 = new TypedFastBitSet(a2);
    let pinter = mb1.intersection_size(mb2);
    mb1.intersection(mb2);
    if (pinter != mb1.size()) throw "bad size";
    const a = mb1.array();
    if (!arraysEquals(a, a1)) throw "bad values";
    pinter = mb2.intersection_size(mb1);
    mb2.intersection(mb1);
    if (pinter != mb2.size()) throw "bad size";
    if (!mb1.equals(mb2)) throw "bad intersect";
  });

  it("Testing difference", function () {
    const a1 = [1, 2, 4, 5, 10];
    const a2 = [1, 2, 4, 5, 10, 100, 1000];
    let mb1 = new TypedFastBitSet(a1);
    const mb2 = new TypedFastBitSet(a2);
    mb1.difference(mb2);
    if (!mb1.isEmpty()) throw "bad diff";
    mb1 = new TypedFastBitSet(a1);
    mb2.difference(mb1);
    if (mb2.size() != 2) throw "bad diff";
  });

  it("Testing union", function () {
    const a1 = [1, 2, 4, 5, 10];
    const a2 = [1, 2, 4, 5, 10, 100, 1000];
    let mb1 = new TypedFastBitSet(a1);
    const mb2 = new TypedFastBitSet(a2);
    let punion = mb1.union_size(mb2);
    mb1.union(mb2);
    if (punion != mb1.size()) throw "bad size";
    if (!mb1.equals(mb2)) throw "bad diff";
    mb1 = new TypedFastBitSet(a1);
    punion = mb2.union_size(mb1);
    mb2.union(mb1);
    if (punion != mb2.size()) throw "bad size";
    const a = mb2.array();
    if (!arraysEquals(a, a2)) throw "bad values";
  });
});
