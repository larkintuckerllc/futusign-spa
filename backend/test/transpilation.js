import chai from "chai"
chai.should()

describe("Babel Transpilation", function() {
  it("should support destructuring assignment", function() {
    const originals = [2, 3]
    const [first, second] = originals
    first.should.equal(originals[0])
    second.should.equal(originals[1])
  })

  it("should support the object spread operator", function() {
    const original = {
      a: 1,
      b: 2,
    }
    const combined = {
      ...original,
      c: 3,
    }
    combined.should.have.all.keys({
      a: 1,
      b: 2,
      c: 3,
    })
  })
})
