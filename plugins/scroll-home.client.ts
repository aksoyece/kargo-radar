export default defineNuxtPlugin(() => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }

  window.scrollTo(0, 0)

  const { reset } = useTracking()
  reset()
})
