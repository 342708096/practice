var io = new IntersectionObserver(
  entries => {
    entries.forEach(i => {
      console.log('Time: ' + i.time)
      console.log('Target: ' + i.target.id)
      console.log('IntersectionRatio: ' + i.intersectionRatio)
      console.log('rootBounds: ' + JSON.stringify(i.rootBounds, null, 2))
      console.log(i.boundingClientRect)
      console.log(i.intersectionRect)
      console.log('\n\n')
    })
  },
  {
    /* Using default options. Details below */
    threshold: [1],
    root: document,
    /* 视口向外扩张了500px */
    rootMargin: '-200px 500px 0px 500px'
  }
)
// Start observing an element

io.observe(document.querySelector('#a'))
io.observe(document.querySelector('#c'))
