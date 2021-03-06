import RegisterWith from './util/RegisterWith';
import Operation from '../Operation';
// import Calculate from './Calculate'

/**
 * NOTE: CURRENTLY OBSOLETE! USING IS BAKED INTO DEFINITION
 * MAY WANT TO MOVE THIS BACK TO HERE
 */

// @RegisterWith(Operation)
class Using extends Operation {
  static type = 'using';

  _value = null;

  constructor({ value = null }) {
    super(...arguments);
    this._value = value;
  }

  static from(addOperation) {
    let o = new Using({ value: addOperation.value });
    return o;
  }

  import(addOperation) {
    this._value = addOperation.value;
  }

  export() {
    return {
      type: Using.type,
      value: this._value
    };
  }

  transform(value, resolver) {
    console.info('@@ Using - Not implemented');
    return value;
  }
}

export default RegisterWith(Operation)(Using);
