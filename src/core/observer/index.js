import _ from 'lodash'

export class Observer {

  constructor (value) {
    this.value = value
    Object.defineProperty(value, '__ob__', {
      value: this,
      enumerable: false,
      writable: true,
      configurable: true
    })
  }
}

export function observe (value) {
  if (!_.isObject(value)) {
    return
  }
  let ob
  if (Object.prototype.hasOwnProperty.call(value, '__ob__') &&
  value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (_.isPlainObject(value) && Object.isExtensible(value)) {
    ob = new Observer(value)
  }
  return ob
}
