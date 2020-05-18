export function set( state, payload ) {
  Object.keys( payload )
    .forEach( key => state[key] = payload[key] );
}
