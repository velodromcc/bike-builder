const CONSTANTS = {
  framesets: {
    title: 'Frameset',
    zIndex: 5,
    scale: 1
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

export function toArray( value ) {
  if ( value == null ) return [];
  if ( typeof value !== 'string' && typeof value.length === 'number' )
    return Array.prototype.slice.call( value );
  return [ value ];
}

export function itemImage( item, index ) {
  index = index || 0;
  if ( item && item.colors[index] ) {
    return 'http://bikebuilder.inmovens.com' + (
      item.colors[index].color.imageFront || item.colors[index].color.image );
  }
  return '';
}

export function capitalize( str ) {
  str = String(str);
  return str.charAt(0).toUpperCase() + str.slice( 1 );
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
