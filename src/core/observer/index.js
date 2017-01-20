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
    if (_.isArray(value)) {
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  walk (obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      observe(obj[keys[i]])
    }
  }

  observeArray (items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
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
  } else if ((_.isArray(value) || _.isPlainObject(value)) &&
  Object.isExtensible(value)) {
    ob = new Observer(value)
  }
  return ob
}

