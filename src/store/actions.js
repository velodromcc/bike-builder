export function fetch() {
  return new Promise(( resolve ) => {
    setTimeout(() => resolve(), 3000 );
  })
}
