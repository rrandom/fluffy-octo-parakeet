import _ from 'lodash'

import Dep from './dep'
import { hasOwn } from '../util/index'

export class Observer {

  constructor (value) {
    this.value = value
    this.dep = new Dep()
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
      defineReactive(obj, keys[i], obj[keys[i]])
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
  if (hasOwn(value, '__ob__') &&
  value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if ((_.isArray(value) || _.isPlainObject(value)) &&
  Object.isExtensible(value)) {
    ob = new Observer(value)
  }
  return ob
}

export function defineReactive (obj, key, val) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  const getter = property && property.get
  const setter = property && property.set

  let childOb = observe(val)

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val

      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-disable no-self-compare */

      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = observe(newVal)
      dep.notify()
    }
  })
}

