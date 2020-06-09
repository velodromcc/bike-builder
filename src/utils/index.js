const CONSTANTS = {
  framesets: {
    title: 'Frameset',
    zIndex: 5,
    scale: 1
  },
  bars: {
    title: 'Bars/Stem',
    zIndex: 6,
    scale: 1
  },
  groupsets: {
    title: 'Groupset',
    zIndex: 10,
    scale: 1
  },
  wheels: {
    title: 'Wheels',
    zIndex: 5,
    scale: 1
  },
  tyres: {
    title: 'Tyres',
    zIndex: 5,
    scale: 1
  },
  seatposts: {
    title: 'Seatposts',
    zIndex: 5,
    scale: 1
  },
  saddles: {
    title: 'Saddles',
    zIndex: 5,
    scale: 1
  }
};

export { CONSTANTS };

export function toArray( value ) {
  if ( value == null ) return [];
  if ( typeof value !== 'string' && typeof value.length === 'number' )
    return Array.prototype.slice.call( value );
  return [ value ];
}

export function itemImage( item, index, composition ) {
  index = index || 0;
  if ( item && item.colors[index] ) {
    return 'http://bikebuilder.inmovens.com' + (
      index === 0 && !composition
        ? item.colors[index].url || item.colors[index].color.image
        : item.colors[index].color.image
      );
  }
  return '';
}
