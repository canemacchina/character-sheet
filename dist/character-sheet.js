"use strict";var _stringify = require("babel-runtime/core-js/json/stringify");var _stringify2 = _interopRequireDefault(_stringify);var _keys = require("babel-runtime/core-js/object/keys");var _keys2 = _interopRequireDefault(_keys);var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require("babel-runtime/helpers/createClass");var _createClass3 = _interopRequireDefault(_createClass2);var _operations2 = require("./util/operations");var _operations3 = _interopRequireDefault(_operations2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

_define = _operations3.default.define,_modifier = _operations3.default.modifier,inventory = _operations3.default.inventory;

var CharacterSheetFactory = function CharacterSheetFactory() {
  var _sheetDefinitions = {};var

  CharacterSheet = function () {(0, _createClass3.default)(CharacterSheet, null, [{ key: "define", value: function define(



      name) {
        var def = {};
        _sheetDefinitions[name] = def;

        return _define(def)(name);
      } }]);

    function CharacterSheet() {var _this = this;var json = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};(0, _classCallCheck3.default)(this, CharacterSheet);this._characterDefinitions = {};this._subscriptions = [];
      this._characterDefinitions = json;

      var query = function query(name) {
        if (name) return _this.query(name);

        return _this;
      };

      ["subscribe", "unsubscribe", "modifier", "debug", "getSheet"].forEach(
      function (fnName) {
        query[fnName] = function () {return _this[fnName].apply(_this, arguments);};
      });


      return query;
    }(0, _createClass3.default)(CharacterSheet, [{ key: "getDescription", value: function getDescription(

      name) {
        var sheetDefinition = _sheetDefinitions[name] || {};
        var characterDefinition = this._characterDefinitions[name] || {};

        return (
          characterDefinition.description || sheetDefinition.description || null);

      } }, { key: "getValue", value: function getValue(

      name) {var _this2 = this;
        // numbers are
        if (typeof name === "number") return name;

        // inventory of values
        if (this.isInventory(name)) {
          var _inventory = [].concat((0, _toConsumableArray3.default)(
          _sheetDefinitions[name] && _sheetDefinitions[name].inventory ||
          []), (0, _toConsumableArray3.default)(
          this._characterDefinitions[name] &&
          this._characterDefinitions[name].inventory ||
          []));


          return _inventory.map(function (invName) {return _this2.getValue(invName);});
        }

        // start with a defined default value
        var definition =
        _sheetDefinitions[name] || this._characterDefinitions[name];

        // if this is a modifier, return as is, for now
        if (definition.type === "modifier") {
          return definition;
        }

        // false is a value we want to use, but ordinary || would be falsey
        var value =
        this._characterDefinitions[name] === null ||
        this._characterDefinitions[name] === undefined ?
        _sheetDefinitions[name].defaultValue :
        this._characterDefinitions[name];

        // next apply an overridden value
        if (
        this._characterDefinitions[name] &&
        this._characterDefinitions[name].value)
        {
          value = this._characterDefinitions[name].value;
        }

        var using = [];
        var modifies = null;

        // sheet operations
        var operations = _sheetDefinitions[name].operations || [];

        // next add character modifications
        (0, _keys2.default)(this._characterDefinitions).map(function (defName) {
          var definition = _this2._characterDefinitions[defName];

          // find only inventories
          if (_this2.isInventory(defName)) {
            // go through each item and apply its operations
            definition.inventory.forEach(function (inv) {
              // definition of item in inventory
              var invDef = _this2._characterDefinitions[inv];

              // remember what's being modified
              var allowModification = false;

              // go through every operation and add it to operations if it's modifying the definition in question
              invDef.operations.forEach(function (operation) {
                // determine if modifications are allowed
                if (operation.type === "modifies") {
                  if (operation.target === name) {
                    allowModification = true;
                  } else {
                    allowModification = false;
                  }
                }

                // if no modifications are allowed, do nothing
                if (!allowModification) return;

                // seems like they're allowed, add operation
                operations.push(operation);
              });
            });
          }
        });

        // apply all operations
        value = this._operations(operations, value);

        return value;
      } }, { key: "_operations", value: function _operations(

      operations, startValue) {var _this3 = this;
        var value = startValue;
        var using = null;
        var modifies = [];

        operations.forEach(function (operation) {
          switch (operation.type) {
            case "using":
              using = operation.targets.map(function (value) {return _this3.getValue(value);});
              break;
            case "calculate":
              // value = new Function("return " + operation.fn.toString())(...using);
              value = operation.fn.apply(operation, (0, _toConsumableArray3.default)(using));
              break;
            case "addOneForEvery":
              value += Math.floor(_this3.getValue(operation.target) / operation.n);
              break;
            case "subtractOneForEvery":
              value += Math.floor(_this3.getValue(operation.target) / operation.n);
              break;
            case "add":
              value += _this3.getValue(operation.value);
              break;
            case "subtract":
              value -= _this3.getValue(operation.value);
              break;}

        });

        return value;
      } }, { key: "_processOperation", value: function _processOperation(

      value, operation) {
        console.log(operation.type);
        switch (operation.type) {}

      } }, { key: "getSheetDefinition", value: function getSheetDefinition(

      name) {
        return _sheetDefinitions[name];
      } }, { key: "getSheet", value: function getSheet()

      {var _this4 = this;
        var sheet = {};

        (0, _keys2.default)(_sheetDefinitions).forEach(function (name) {
          sheet[name] = _this4.getValue(name);
        });

        return sheet;
      } }, { key: "getCharacterDefinition", value: function getCharacterDefinition(

      name) {
        var def = this._characterDefinitions[name];
        this._characterDefinitions[name] = def;

        return def;
      } }, { key: "isInventory", value: function isInventory(

      name) {
        var sheetDefinition = _sheetDefinitions[name] || {};
        var characterDefinition = this._characterDefinitions[name] || {};
        var defaultValue =
        characterDefinition.defaultValue || sheetDefinition.defaultValue;

        return Boolean(defaultValue && Array.isArray(defaultValue));
      } }, { key: "query", value: function query(

      name) {var _this5 = this;
        if (this.isInventory(name)) {
          var def = this.getCharacterDefinition(name);
          return inventory(def);
        } else {
          return {
            set: function set(value) {
              _this5._characterDefinitions[name] = value;
              _this5._publish();
            },
            description: function description() {return _this5.getDescription(name);},
            value: function value() {return _this5.getValue(name);} };

        }
      } }, { key: "_publish", value: function _publish()

      {
        this._subscriptions.forEach(function (f) {return f();});
      } }, { key: "subscribe", value: function subscribe(

      f) {
        this._subscriptions.push(f);
      } }, { key: "unsubscribe", value: function unsubscribe(

      f) {
        this._subscriptions = this._subscriptions.filter(function (s) {return s !== f;});
      } }, { key: "modifier", value: function modifier(

      name) {
        var def = {};

        this._characterDefinitions[name] = def;

        return _modifier(def)(name);
      } }, { key: "debug", value: function debug()

      {
        console.log("=== Sheet Definitions ===");
        console.log((0, _stringify2.default)(_sheetDefinitions, null, 2));

        console.log("=== Character Definitions ===");
        console.log((0, _stringify2.default)(this._characterDefinitions, null, 2));
      } }]);return CharacterSheet;}();


  return CharacterSheet;
};

module.exports = CharacterSheetFactory;