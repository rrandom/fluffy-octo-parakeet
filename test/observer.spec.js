
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
})
