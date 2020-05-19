export function loadInfo() {
  return new Promise(( resolve ) => {
    setTimeout(() => resolve(), 1000 );
  })
}

export function loadData() {
  return new Promise(( resolve ) => {
    setTimeout(() => resolve(), 3000 );
  })
}
