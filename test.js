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
    // expect(nebulw.safeGet([1,2],"[0]")).toBe(1);
});

test('safeGets', () => {
    expect(nebulw.safeGets(obj,"b.c","b.d[0]f[1][0]","b.d[0].g.h") ).toEqual([1,2,2]);
});

test('compile',() => {
    expect(nebulw.safeGets(obj,nebulw.compile("b.c"),nebulw.compile("b.d[0]f[1][0]"),nebulw.compile("b.d[0].g.h"))).toEqual([1,2,2]);
})

test('safeSet', () => {
  expect(nebulw.safeSet(obj,"b.c",4)).toEqual( {
    a: 2,
    b: {
      c: 4,
      d: [
        {
          f: [1, [2, 3]],
          g: {
            h: 2
          }
        }
      ]
    }
  });
  expect(nebulw.safeSet({},"b.c",4)).toEqual({b:{c:4}});
  expect(nebulw.safeSet({},"b.c[0]",4)).toEqual({b:{c:[4]}});
  expect(nebulw.safeSet({b:{c:4}},"b.c[0]",4)).toEqual({b:{c:[4]}});
  expect(nebulw.safeSet({},"b.c[0][1]",4)).toEqual({b:{c:[[undefined,4]]}});
});

test('safeSets', () => {
  expect(nebulw.safeSets({},["b.c",1],["b.d[1]",2],["b.d[0][0]",3])).toEqual(
    {b:{c:1,d:[[3],2]}}
  );
  expect(nebulw.safeSets({},["b.c",1],["b.c[0]",2],["b.c[0][0]",3])).toEqual(
    {b:{c:[[3]]}}
  );
});

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

function compareGet(exp){
  let times = 100000;
  let prefix = 'Get ' + exp
  console.time(prefix + ': nebulw')
  for(let i = 0; i<times;i++){
    nebulw.safeGet(obj,exp)
  }
  console.timeEnd(prefix + ': nebulw')

  console.time(prefix + ': nebulw with precompile')
  let parser = nebulw.compile(exp)
  for(let i = 0; i<times;i++){
    nebulw.safeGet(obj,parser)
  }
  console.timeEnd(prefix + ': nebulw with precompile')


  console.time(prefix + ': shvl')
  for(let i = 0; i<times;i++){
    shvl.get(obj,exp)
  }
  console.timeEnd(prefix + ': shvl')

  console.time(prefix + ': l-safeget')
  for(let i = 0; i<times;i++){
    l_safeGet(obj,exp)
  }
  console.timeEnd(prefix + ': l-safeget')
};

function compareSet(exp,value){
  let times = 100000;
  let prefix = 'Set ' + exp
  console.time(prefix + ': nebulw')
  for(let i = 0; i<times;i++){
    nebulw.safeSet({},exp)
  }
  console.timeEnd(prefix + ': nebulw')

  console.time(prefix + ': nebulw with precompile')
  let parser = nebulw.compile(exp)
  for(let i = 0; i<times;i++){
    nebulw.safeSet({},parser)
  }
  console.timeEnd(prefix + ': nebulw with precompile')


  console.time(prefix + ': shvl')
  for(let i = 0; i<times;i++){
    shvl.set({},exp)
  }
  console.timeEnd(prefix + ': shvl')
};

test('compare get',()=>{
  compareGet('b.c')
  compareGet('b.d[0]f[1][0]')
  compareGet('b.d[0].g.h')
})

test('compare set',()=>{
  compareSet('b.c',4)
  compareSet('b.d[0]f[1][0]',4)
  compareSet('b.d[0].g.h',4)
})