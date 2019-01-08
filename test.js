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

// Performance comparison with other libraries

// l-safeget
function l_safeGet(obj, path) {
  if (Array.isArray(path)) {
      return path.reduce((ob, k) => {
          return ob && ob[k] !== undefined ? ob[k] : undefined;
      }, obj);
  } else if (typeof path == "string") {
      var arrKeys = path.split("."),
          pathKeys = [],
          m;
      arrKeys.forEach(k => {
          if ((m = k.match(/([^\[\]]+)|(\[\d+\])/g))) { // arr[3][2] =>  ['arr',[3],[2]]
              m = m.map(v => v.replace(/\[(\d+)\]/, "$1")); // ['arr',[3],[2]] => ['arr','3','2']
              [].push.apply(pathKeys, m);
          }
      });
      return l_safeGet(obj, pathKeys);
  }
}

let shvl = {
  get (object, path, def) {
    return (object = (path.split ? path.split('.') : path).reduce(function (obj, p) {
      return obj && obj[p]
    }, object)) === undefined ? def : object;
  },
  set  (object, path, val, obj) {
    return ((path = path.split ? path.split('.') : path).slice(0, -1).reduce(function (obj, p) {
      return obj[p] = obj[p] || {};
    }, obj = object)[path.pop()] = val), object;
  }
}

function compare(exp){
  let times = 100000;
  console.time(exp + ': nebulw')
  for(let i = 0; i<times;i++){
    nebulw.safeGet(obj,exp)
  }
  console.timeEnd(exp + ': nebulw')

  console.time(exp + ': nebulw with precompile')
  let parser = nebulw.compile(exp)
  for(let i = 0; i<times;i++){
    nebulw.safeGet(obj,parser)
  }
  console.timeEnd(exp + ': nebulw with precompile')


  console.time(exp + ': shvl')
  for(let i = 0; i<times;i++){
    shvl.get(obj,exp)
  }
  console.timeEnd(exp + ': shvl')

  console.time(exp + ': l-safeget')
  for(let i = 0; i<times;i++){
    l_safeGet(obj,exp)
  }
  console.timeEnd(exp + ': l-safeget')
};

test('compare',()=>{
  compare('b.c')
  compare('b.d[0]f[1][0]')
  compare('b.d[0].g.h')
})