
import { observe } from 'core/observer/index'

describe('Observer', () => {
  it('create on non-observables', () => {
    const ob1 = observe(1)
    expect(ob1).toBeUndefined()

    const ob3 = observe(Object.freeze({}))
    expect(ob3).toBeUndefined()
  })
})
