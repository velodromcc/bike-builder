export function toArray( value ) {
  if ( value == null ) return [];
  if ( typeof value !== 'string' && typeof value.length === 'number' )
    return Array.prototype.slice.call( value );
  return [ value ];
}
