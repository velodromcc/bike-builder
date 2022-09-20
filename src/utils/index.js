const CONSTANTS = {
  //host: 'bikebuilder.inmovens.com',
  //imageBase: 'https://bikebuilder.inmovens.com',
  host: 'velodrom.dreambikebuilder.com',
  imageBase: 'https://velodrom.dreambikebuilder.com',
  framesets: {
    title: 'Frameset',
    zIndex: 5,
    scale: 1.2
  },
  bars: {
    title: 'Bars/Stem',
    zIndex: 6,
    scale: .32
  },
  groupsets: {
    title: 'Groupset',
    zIndex: 10,
    scale: .25
  },
  groupsetsLeft: {
    zIndex: 4,
    scale: .3
  },
  groupsetsMiddle: {
    zIndex: 10,
    scale: .27
  },
  groupsetsBar: {
    zIndex: 7,
    scale: .45
  },
  groupsetsBrakeLeft: {
    zIndex: 2,
    scale: .25
  },
  groupsetsBrakeRight: {
    zIndex: 2,
    scale: .25
  },
  groupsetsCapilierLeft: {
    zIndex: 3,
    scale: .13
  },
  groupsetsCapilierRight: {
    zIndex: 4,
    scale: .13
  },
  groupsetsGear: {
    zIndex: 11,
    scale: .28
  },
  wheels: {
    title: 'Wheels',
    zIndex: 3,
    scale: .95
  },
  tyres: {
    title: 'Tyres',
    zIndex: 4,
    scale: .95
  },
  seatposts: {
    title: 'Seatposts',
    zIndex: 2,
    scale: .36
  },
  saddles: {
    title: 'Saddles',
    zIndex: 7,
    scale: .3
  }
};

export { CONSTANTS };

export function loadImage( url ) {
  return new Promise( resolve => {

    const image = new Image();
    image.src = url;

    if ( image.complete && image.naturalHeight !== 0 ) {
      resolve( image );
    } else {
      image.addEventListener( 'load', () => resolve( image ));
    }
  })
}

export function containImage( image, width, height, container, dim = {} ) {
  if ( image ) {

    container = container || image.parentNode;
    const WIDTH = dim.containerWidth || container.clientWidth;
    const HEIGHT = dim.containerHeight || container.clientHeight;
    const REL = WIDTH / HEIGHT;
    const rel = width / height;

    if ( REL > rel ) {

      var h = Math.min( HEIGHT, height );
      image.style.height = h + 'px';
      image.style.width = ( h * rel ) + 'px';

    } else {

      var w = Math.min( WIDTH, width );
      image.style.width = w + 'px';
      image.style.height = ( w / rel ) + 'px';

    }
  }
}

export function toArray( value ) {
  if ( value == null ) return [];
  if ( typeof value !== 'string' && typeof value.length === 'number' )
    return Array.prototype.slice.call( value );
  return [ value ];
}

export function itemImage( item, index ) {
  index = index || 0;
  const image = { src: '', front: '', thumb: '' };
  if ( item && item.colors[index] ) {

    image.thumb = item.thumbnail;
    image.front = item.colors[index].color.imageFront;
    image.src = item.colors[index].color.image;

    for ( var img in image ) {
      if ( image[img] ) {
        image[img] = CONSTANTS.imageBase + image[img];
      }
    }
  }
  return image;
}

export function capitalize( str ) {
  str = String(str);
  return str.charAt(0).toUpperCase() + str.slice( 1 );
}

const from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
const to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
const map = {};

for ( var i = 0, j = from.length; i < j; i++ )
  map[from.charAt(i)] = to.charAt(i);

export const normalize = str => {
  var ret = [];
  for ( var i = 0, j = str.length; i < j; i++ ) {
    var c = str.charAt(i);
    // eslint-disable-next-line
    if ( map.hasOwnProperty(c)) ret.push( map[c] );
    else ret.push(c);
  }
  return ret.join('').toLowerCase();
}

// COLOR FUNCTIONS

function add( color, amount ) {
  color = parseInt( color, 16 ) + amount;
  color = Math.max( Math.min( color, 255 ), 0 ).toString(16);
  return color.length > 1 ? color : ( '0' + color );
}

function transformColor( color, amount ) {
  color = color.replace( '#', '' );
  amount = parseInt(( 255 * amount ) / 100 );
  return '#' + [
    add( color.substring( 0, 2 ), amount ),
    add( color.substring( 2, 4 ), amount ),
    add( color.substring( 4, 6 ), amount )
  ].join('')
}

export function lighten( color, amount ) {
  return transformColor( color, amount );
}

export function darken( color, amount ) {
  return transformColor( color, -amount );
}
