import nebulw from './index'

let obj = {
    a: 2,
    b: {
      c: 1,
      d: [
        {
          f: [1, [2, 3]],
          g: {
            h: 2
          }
        }
      ]
    }
  }

test('safeGet', () => {
    expect(nebulw.safeGet(obj,"b.d[0]f[1][0]")).toBe(2);
});

test('safeGets', () => {
    expect(nebulw.safeGets(obj,"b.c","b.d[0]f[1][0]","b.d[0].g.h") ).toEqual([1,2,2]);
});

test('compile',() => {
    expect(nebulw.safeGets(obj,nebulw.compile("b.c"),nebulw.compile("b.d[0]f[1][0]"),nebulw.compile("b.d[0].g.h"))).toEqual([1,2,2]);
})