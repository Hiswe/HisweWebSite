export default function({ store, req }) {
  if (process.server && !req) return
  store.commit(`validation/RESET`)
  store.commit(`notification/REMOVE_ALL`)
}