
import add from '../src/add'

describe('A suite of basic functions', function () {
  it('add numbers', function () {
    expect(3).toEqual(add(1, 2))
  })
})
