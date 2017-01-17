
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
})
