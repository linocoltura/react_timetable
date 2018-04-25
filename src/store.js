import { connect, createStore } from 'undux'


// Create a store with an initial value.
let store = createStore({
  events: [],
  clicked: -1,
})

export let withStore = connect(store);