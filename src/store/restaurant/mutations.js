export function setRestaurant (state, payload) {
    state.id = payload.id
    state.name = payload.name
    state.address = payload.address
}
