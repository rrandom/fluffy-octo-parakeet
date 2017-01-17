
import { Observer, observe } from 'core/observer/index'

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
    console.log(obj.a)
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
  })
})
