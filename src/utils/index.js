const CONSTANTS = {
  framesets: {
    title: 'Frameset',
    zIndex: 5,
    scale: 1
  },
  bars: {
    title: 'Bars/Stem',
    zIndex: 6,
    scale: .3
  },
  groupsets: {
    title: 'Groupset',
    zIndex: 10,
    scale: .25
  },
  wheels: {
    title: 'Wheels',
    zIndex: 3,
    scale: .9
  },
  tyres: {
    title: 'Tyres',
    zIndex: 4,
    scale: .9
  },
  seatposts: {
    title: 'Seatposts',
    zIndex: 2,
    scale: .38
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
