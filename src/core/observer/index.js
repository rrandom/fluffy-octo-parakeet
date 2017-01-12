import _ from 'lodash'

export class Observer {

  constructor (value) {
    this.value = value
    value.__ob__ = this    // value.__ob__ = this
  }
}

export function observe (value) {
  if (!_.isObject(value)) {
    return
  } else if (value.hasOwnProperty('__ob__') && value.__ob__ instanceof Observer) {
    return value.__ob__
  } else if (Object.isExtensible(value)) {
    return new Observer(value)
  }
}
