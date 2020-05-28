const Framesets = [
  {
    type: 'frameset',
    name: 'OPEN MIN.D',
    image: '114087-open-mind-bike-builder.png',
    accept: [ 'bars', 'groupsets', 'wheels', 'tyres', 'saddles' ],
    colors: [],
    priority: 10,
    base: true,
    anchors: {
      ['bar']:      [{ x: 530,  y:  59 },{ x:  551, y:  51 }],
      ['groupset']: [{ x: 293,  y: 434 },{ x:  278, y: 434 }],
      ['wheel-1']:  [{ x: 681,  y: 387 },{ x:  491, y: 387 }],
      ['wheel-2']:  [{ x:  22,  y: 389 },{ x: -168, y: 389 }],
      ['tyres-1']:  [{ x:  22,  y: 389 },{ x: -179, y: 389 }],
      ['tyres-2']:  [{ x:  22,  y: 389 },{ x: -180, y: 389 }],
      ['saddle']:   [{ x:  157, y:  26 },{ x:  157, y:  16 }],
    }
  },
  {
    type: 'frameset',
    name: 'WILIER CENTO10NDR',
    image: '102293-wiliercento10ndr-render-01d.png',
    accept: [ 'groupsets', 'wheels', 'tyres', 'saddles' ],
    colors: [
      { name: 'BLUE/RED MATT AND GLOSSY',    a: '#2d85ac', b: '#e84131' },
      { name: 'RAMATO/MATT AND GLOSSY',      a: '#db7e00', b: '#726867' },
      { name: 'BLACK/RED MATT AND GLOSSY',   a: '#272624', b: '#9d2727' },
      { name: 'BLACK/BLACK MATT AND GLOSSY', a: '#272624', b: '#4d4d4d' },
      { name: 'BLACK/WHITE MATT AND GLOSSY', a: '#272624', b: '#f4f4f4' }
    ],
    priority: 10,
    base: true,
    anchors: {
      ['bar']:      [{ x: 530,  y:  59 },{ x:  551, y:  51 }],
      ['groupset']: [{ x: 293,  y: 434 },{ x:  278, y: 434 }],
      ['wheel-1']:  [{ x: 681,  y: 387 },{ x:  491, y: 387 }],
      ['wheel-2']:  [{ x:  22,  y: 389 },{ x: -168, y: 389 }],
      ['tyres-1']:  [{ x:  22,  y: 389 },{ x: -179, y: 389 }],
      ['tyres-2']:  [{ x:  22,  y: 389 },{ x: -180, y: 389 }],
      ['saddle']:   [{ x:  157, y:  26 },{ x:  157, y:  16 }],
    }
  },
  {
    type: 'frameset',
    name: 'WILIER CENTO10PRO',
    image: '102315-wilier-cento10pro-red-white-glossy.png',
    accept: [ 'groupsets', 'wheels', 'tyres', 'saddles' ],
    colors: [
      { name: 'RED/WHITE GLOSSY',    a: '#d82222', b: '#fbfbfb' },
      { name: 'RAMATO',              a: '#d46d0c', b: '#d46d0c' },
      { name: 'IRIDE GREY/GLOSSY',   a: '#d8d4d0', b: '#000000' },
      { name: 'PEARL BLUE/GLOSSY',   a: '#184ed0', b: '#ffffff' },
      { name: 'BLACK/RED MATT',      a: '#000000', b: '#d01e1e' }
    ],
    priority: 10,
    base: true,
    anchors: {
      ['bar']:      [{ x: 530,  y:  59 },{ x:  551, y:  51 }],
      ['groupset']: [{ x: 293,  y: 434 },{ x:  278, y: 434 }],
      ['wheel-1']:  [{ x: 681,  y: 387 },{ x:  491, y: 387 }],
      ['wheel-2']:  [{ x:  22,  y: 389 },{ x: -168, y: 389 }],
      ['tyres-1']:  [{ x:  22,  y: 389 },{ x: -179, y: 389 }],
      ['tyres-2']:  [{ x:  22,  y: 389 },{ x: -180, y: 389 }],
      ['saddle']:   [{ x:  157, y:  26 },{ x:  157, y:  16 }],
    }
  },
  {
    type: 'frameset',
    name: 'WILIER 0 SLR',
    image: '102383-wilier-0-slr-velvet-red-matt.png',
    accept: [ 'groupsets', 'wheels', 'tyres', 'saddles' ],
    colors: [
      { name: 'VELVET RED/MATT',     a: '#962222', b: '#ffffff' },
      { name: 'BLACK/WHITE MATT',    a: '#202020', b: '#ffffff' },
      { name: 'ADMIRAL BLUE/GLOSSY', a: '#0835a1', b: '#ffffff' },
    ],
    priority: 10,
    base: true,
    anchors: {
      ['bar']:      [{ x: 530,  y:  59 },{ x:  551, y:  51 }],
      ['groupset']: [{ x: 293,  y: 434 },{ x:  278, y: 434 }],
      ['wheel-1']:  [{ x: 681,  y: 387 },{ x:  491, y: 387 }],
      ['wheel-2']:  [{ x:  22,  y: 389 },{ x: -168, y: 389 }],
      ['tyres-1']:  [{ x:  22,  y: 389 },{ x: -179, y: 389 }],
      ['tyres-2']:  [{ x:  22,  y: 389 },{ x: -180, y: 389 }],
      ['saddle']:   [{ x:  157, y:  26 },{ x:  157, y:  16 }],
    }
  },
  {
    type: 'frameset',
    name: 'WILIER JENA',
    image: '102385-wilier-jena-blue-red-matt-no-bars.png',
    accept: [ 'bars', 'groupsets', 'wheels', 'tyres', 'saddles' ],
    colors: [
      { name: 'BLUE/RED MATT',     a: '#276e9d', b: '#bb2f2f' },
      { name: 'GREY/BLUE GLOSSY',  a: '#92928e', b: '#328ab2' },
      { name: 'BLACK/SILVER MATT', a: '#000000', b: '#eeeeee' },
    ],
    priority: 10,
    base: true,
    anchors: {
      ['bar']:      [{ x: 530,  y:  59 },{ x:  551, y:  51 }],
      ['groupset']: [{ x: 293,  y: 434 },{ x:  278, y: 434 }],
      ['wheel-1']:  [{ x: 681,  y: 387 },{ x:  491, y: 387 }],
      ['wheel-2']:  [{ x:  22,  y: 389 },{ x: -168, y: 389 }],
      ['tyres-1']:  [{ x:  22,  y: 389 },{ x: -179, y: 389 }],
      ['tyres-2']:  [{ x:  22,  y: 389 },{ x: -180, y: 389 }],
      ['saddle']:   [{ x:  157, y:  26 },{ x:  157, y:  16 }],
    }
  },
  {
    type: 'frameset',
    name: 'OPEN U.P.',
    image: '73140-open-up-blue-3.png',
    accept: [ 'bars', 'groupsets', 'wheels', 'tyres', 'seatposts', 'saddles' ],
    colors: [
      { name: 'BLUE',  a: '#44a6e1', b: '#44a6e1' },
      { name: 'GREEN', a: '#71ca4d', b: '#71ca4d' },
    ],
    priority: 10,
    base: true,
    anchors: {
      ['bar']:      [{ x: 530,  y:  59 },{ x:  551, y:  51 }],
      ['groupset']: [{ x: 293,  y: 434 },{ x:  278, y: 434 }],
      ['wheel-1']:  [{ x: 681,  y: 387 },{ x:  491, y: 387 }],
      ['wheel-2']:  [{ x:  22,  y: 389 },{ x: -168, y: 389 }],
      ['tyres-1']:  [{ x:  22,  y: 389 },{ x: -179, y: 389 }],
      ['tyres-2']:  [{ x:  22,  y: 389 },{ x: -180, y: 389 }],
      ['saddle']:   [{ x:  157, y:  26 },{ x:  157, y:  16 }],
    }
  }
];

export default Framesets;
