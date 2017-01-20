
import _ from 'lodash'

export default class Dep {

  constructor () {
    this.subs = []
  }

  addSub (sub) {
    this.subs.push(sub)
  }

  removeSub (sub) {
    _.remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    for (let i = 0; i < this.subs.length; i++) {
      this.subs[i].update()
    }
  }
}

Dep.target = null
