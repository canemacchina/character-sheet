"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; // helper: add operation to a definition
var addOperation = function addOperation() {var operation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};return {
    to: function to(definition) {
      definition.operations = definition.operations || [];
      definition.operations.push(operation);
    } };};


// entry point: define
var define = function define() {var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};return function () {var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    definition.name = name;
    definition.type = "definition";
    return { default: default_(definition), describe: describe(definition) };
  };};

// entry point: modifier
var modifier = function modifier() {var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};return function () {var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    definition.name = name;
    definition.type = "modifier";
    return { describe: describe(definition), modifies: modifies(definition) };
  };};

var modifies = function modifies() {var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};return function (target) {
    addOperation({
      type: "modifies",
      target: target }).
    to(definition);

    return {
      add: add(definition),
      subtract: subtract(definition),
      addOne: addOne(definition),
      subtractOne: subtractOne(definition) };

  };};

var describe = function describe() {var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};return function () {var description = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    definition.description = description;

    return {
      default: default_(definition),
      using: using(definition),
      addOne: addOne(definition),
      modifies: modifies(definition) };

  };};

var default_ = function default_() {var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};return function (value) {
    definition.defaultValue = value;

    return { using: using(definition), describe: describe(definition) };
  };};

var using = function using() {var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};return function () {for (var _len = arguments.length, targets = new Array(_len), _key = 0; _key < _len; _key++) {targets[_key] = arguments[_key];}
    addOperation({
      type: "using",
      targets: targets.concat() }).
    to(definition);

    return {
      calculate: calculate(definition) };

  };};

var add = function add() {var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};return function (value) {
    addOperation({
      type: "add",
      value: value }).
    to(definition);

    return {
      add: add(definition),
      subtract: subtract(definition),
      addOne: addOne(definition),
      subtractOne: subtractOne(definition),
      modifies: modifies(definition) };

  };};

var subtract = function subtract() {var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};return function (value) {
    addOperation({
      type: "subtract",
      value: value }).
    to(definition);

    return {
      add: add(definition),
      subtract: subtract(definition),
      addOne: addOne(definition),
      subtractOne: addOne(definition) };

  };};

var addOne = function addOne() {var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};return function (target) {return {
      forEvery: function forEvery(n) {
        addOperation({
          type: "addOneForEvery",
          target: target,
          n: n }).
        to(definition);

        return {
          add: add(definition),
          subtract: subtract(definition),
          addOne: addOne(definition),
          subtractOne: subtractOne(definition) };

      } };};};


var subtractOne = function subtractOne() {var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};return function (target) {return {
      forEvery: function forEvery(n) {
        addOperation({
          type: "subtractOneForEvery",
          target: target,
          n: n }).
        to(definition);

        return {
          add: add(definition),
          subtract: subtract(definition),
          addOne: addOne(definition),
          subtractOne: subtractOne(definition) };

      } };};};


var calculate = function calculate() {var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};return function (fn) {
    addOperation({
      type: "calculate",
      fn: fn }).
    to(definition);

    return {
      add: add(definition),
      subtract: subtract(definition),
      addOne: addOne(definition) };

  };};

var inventory = function inventory() {var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};return {
    give: give(definition),
    take: take(definition) };};


var give = function give() {var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};return function (name) {var quantity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    definition.inventory = definition.inventory || [];
    while (quantity--) {definition.inventory.push(name);}

    return {
      give: give(definition),
      take: take(definition) };

  };};

var take = function take() {var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};return function (name) {var quantity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    definition.inventory = definition.inventory || [];
    definition.inventory = definition.inventory.filter(function (inv) {
      if (inv === name && quantity--) return false;
      return true;
    });

    return {
      give: give(definition),
      take: take(definition) };

  };};var _default =

{ define: define, modifier: modifier, inventory: inventory };exports.default = _default;