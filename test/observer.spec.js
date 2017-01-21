
import {
  Observer,
   observe,
  set as setProp,
  del as delProp
} from 'core/observer/index'
import Dep from 'core/observer/dep'
import { hasOwn } from 'core/util/index'

describe('Observer', () => {
  it('create on non-observables', () => {
    const ob1 = observe(1)
    expect(ob1).toBeUndefined()

    const ob3 = observe(Object.freeze({}))
    expect(ob3).toBeUndefined()
  })

  it('create on object', () => {
    const obj = {
      a: {},
      b: {}
    }
    const ob1 = observe(obj)
    expect(ob1 instanceof Observer).toBe(true)
    expect(ob1.value).toBe(obj)
    expect(obj.__ob__).toBe(ob1)

    expect(obj.a.__ob__ instanceof Observer).toBe(true)
    expect(obj.b.__ob__ instanceof Observer).toBe(true)

    const ob2 = observe(obj)
    expect(ob2).toBe(ob1)
  })

  it('create on null', () => {
    const obj = Object.create(null)
    obj.a = {}
    obj.b = {}
    const ob1 = observe(obj)
    expect(ob1 instanceof Observer).toBe(true)
    expect(ob1.value).toBe(obj)
    expect(obj.__ob__).toBe(ob1)

    expect(obj.a.__ob__ instanceof Observer).toBe(true)
    expect(obj.b.__ob__ instanceof Observer).toBe(true)

    const ob2 = observe(obj)
    expect(ob2).toBe(ob1)
  })

  it('create on already observed object', () => {
    const obj = {}
    let val = 0
    let getCount = 0
    Object.defineProperty(obj, 'a', {
      configurable: true,
      enumerable: true,
      get () {
        getCount++
        return val
      },
      set (v) { val = v }
    })

    const ob1 = observe(obj)
    expect(ob1 instanceof Observer).toBe(true)
    expect(ob1.value).toBe(obj)
    expect(obj.__ob__).toBe(ob1)

    getCount = 0

    obj.a
    expect(getCount).toBe(1)
    obj.a
    expect(getCount).toBe(2)

    const ob2 = observe(obj)
    expect(ob2).toBe(ob1)

    obj.a = 10
    expect(val).toBe(10)
  })

  it('create on property with only getter', () => {
    const obj = {}
    Object.defineProperty(obj, 'a', {
      configurable: true,
      enumerable: true,
      get () { return 123 }
    })

    const ob1 = observe(obj)
    expect(ob1 instanceof Observer).toBe(true)
    expect(ob1.value).toBe(obj)
    expect(obj.__ob__).toBe(ob1)

    expect(obj.a).toBe(123)

    const ob2 = observe(obj)
    expect(ob2).toBe(ob1)

    try {
      obj.a = 101
    } catch (e) {}
    expect(obj.a).toBe(123)
  })

  it('create on property with only setter', () => {
    const obj = {}
    let val = 10
    Object.defineProperty(obj, 'a', { // eslint-disable-line accessor-pairs
      configurable: true,
      enumerable: true,
      set (v) { val = v }
    })

    const ob1 = observe(obj)
    expect(ob1 instanceof Observer).toBe(true)
    expect(ob1.value).toBe(obj)
    expect(obj.__ob__).toBe(ob1)

    expect(obj.a).toBe(undefined)

    const ob2 = observe(obj)
    expect(ob2).toBe(ob1)

    obj.a = 100
    expect(val).toBe(100)
  })

  it('create on property which is marked not configurable', () => {
    const obj = {}
    Object.defineProperty(obj, 'a', {
      configurable: false,
      enumerable: true,
      val: 10
    })

    const ob1 = observe(obj)
    expect(ob1 instanceof Observer).toBe(true)
    expect(ob1.value).toBe(obj)
    expect(obj.__ob__).toBe(ob1)
  })

  it('create on array', () => {
    const arr = [{}, {}]
    const ob1 = observe(arr)
    expect(ob1 instanceof Observer).toBe(true)
    expect(ob1.value).toBe(arr)
    expect(arr.__ob__).toBe(ob1)

    expect(arr[0].__ob__ instanceof Observer).toBe(true)
    expect(arr[1].__ob__ instanceof Observer).toBe(true)
  })

  it('observing object prop change', () => {
    const obj = { a: { b: 2 }, c: NaN }
    observe(obj)

    const watcher = {
      deps: [],
      addDep (dep) {
        this.deps.push(dep)
        dep.addSub(this)
      },
      update: jasmine.createSpy()
    }

    Dep.target = watcher
    obj.a.b
    Dep.target = null
    expect(watcher.deps.length).toBe(3) // obj.a + a + a.b

    obj.a.b = 3
    expect(watcher.update.calls.count()).toBe(1)

    obj.a = { b: 4 }
    expect(watcher.update.calls.count()).toBe(2)

    watcher.deps = []
    Dep.target = watcher
    obj.a.b
    obj.c
    Dep.target = null
    expect(watcher.deps.length).toBe(4)

    obj.a.b = 5
    expect(watcher.update.calls.count()).toBe(3)

    obj.c = NaN
    expect(watcher.update.calls.count()).toBe(3)
  })

  it('observing object prop change on defined property', () => {
    const obj = { val: 2 }
    Object.defineProperty(obj, 'a', {
      configurable: true,
      enumerable: true,
      get () { return this.val },
      set (v) {
        this.val = v
        return this.val
      }
    })

    observe(obj)
    // mock a watcher!
    const watcher = {
      deps: [],
      addDep: function (dep) {
        this.deps.push(dep)
        dep.addSub(this)
      },
      update: jasmine.createSpy()
    }
    // collect dep
    Dep.target = watcher
    expect(obj.a).toBe(2) // Make sure 'this' is preserved
    Dep.target = null
    obj.a = 3
    expect(obj.val).toBe(3) // make sure 'setter' was called
    obj.val = 5
    expect(obj.a).toBe(5) // make sure 'getter' was called
  })

  it('observing set on non-existing prop', () => {
    const obj1 = { a: 1 }
    const ob1 = observe(obj1)
    const dep1 = ob1.dep

    spyOn(dep1, 'notify')
    setProp(obj1, 'b', 2)
    expect(obj1.b).toBe(2)
    expect(dep1.notify.calls.count()).toBe(1)
  })

  it('not observing set on existing prop', () => {
    const obj1 = { a: 1 }
    const ob1 = observe(obj1)
    const dep1 = ob1.dep

    spyOn(dep1, 'notify')
    setProp(obj1, 'b', 2)
    expect(obj1.b).toBe(2)
    expect(dep1.notify.calls.count()).toBe(1)

    setProp(obj1, 'b', 3)
    expect(obj1.b).toBe(3)
    expect(dep1.notify.calls.count()).toBe(1)
  })

 /*
  it('del obj prop works', () => {
    const obj2 = { a: 1 }
    delProp(obj2, 'a')
    expect(hasOwn(obj2, 'a')).toBe(false)
  })

  it('observing del on existing prop', () => {
    const obj1 = { a: 1 }
    const ob1 = observe(obj1)
    const dep1 = ob1.dep

    delProp(obj1, 'a')
    expect(hasOwn(obj1, 'a')).toBe(false)
    expect(dep1.notify.calls.count()).toBe(1)
  })

  it('not observing del non-existing prop', () => {
    const obj1 = { a: 1 }
    const ob1 = observe(obj1)
    const dep1 = ob1.dep

    delProp(obj1, 'a')
    expect(hasOwn(obj1, 'a')).toBe(false)
    expect(dep1.notify.calls.count()).toBe(1)

    delProp(obj1, 'a')
    expect(dep1.notify.calls.count()).toBe(1)
  })

  it('obsering set/del works on Object.create(null)', () => {
    const obj3 = Object.create(null)
    obj3.a = 1
    const ob3 = observe(obj3)
    const dep3 = ob3.dep

    spyOn(dep3, 'notify')
    setProp(obj3, 'b', 2)
    expect(obj3.b).toBe(2)
    expect(dep3.notify.calls.count()).toBe(1)

    delProp(obj3, 'a')
    expect(hasOwn(obj3, 'a')).toBe(false)
    expect(dep3.notify.calls.count()).toBe(2)
  })
  */
})
