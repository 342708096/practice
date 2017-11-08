function setStyle($ele, style) {
  Object.assign($ele.style, style)
}

function getChildren($ele) {
  let list = Array.prototype.slice.call($ele.childNodes, 0, $ele.childNodes.length)

  return list.filter((item) => item.nodeType === 1)
}

export default class Swiper {
  _index = 0
  _start = {x:0, y:0}
  _move = {x:0, y:0}
  _end = {x:0, y:0}
  constructor($container, config) {
    this._default = {
      direction: 'row', // column
      threshold: 50,
      duration: '200',
      itemNum: 0,
      canTouch: true
    }
    Object.assign(this._default, config)
    if (!$container) {
      throw new Error('未设置 container')
    }
    this.$container = $container
    this.$wrapper = getChildren($container)[0]
    if (!this.$wrapper) {
      throw new Error('未找到 wrapper')
    }
    if (!this._default.itemNum) {
      this._default.itemNum = getChildren(this.$wrapper).length
    }
    this._init()
    if (this._default.canTouch) {
      this._bindEvent()
    }
  }

  _init() {
    setStyle(this.$wrapper, {
      'flex-direction': this._default.direction
    })
  }

  get _offset() {
    return `${this._index * 100}%`
  }

  get _moveDistance() {
    if (this._default.direction === 'column') {
      return this._move.y - this._start.y
    }
    return this._move.x - this._start.x
  }

  get _moveTransform() {
    if (this._default.direction === 'column') {
      return `translate3d(0, calc(${this._moveDistance}px - ${this._offset}), 0)`
    }
    return `translate3d(calc(${this._moveDistance}px - ${this._offset}), 0, 0)`
  }

  get _endDistance() {
    if (this._default.direction === 'column') {
      return this._end.y - this._start.y
    }
    return this._end.x - this._start.x
  }

  get _endTransform() {
    if (this._default.direction === 'column') {
      return `translate3d(0, -${this._offset}, 0)`
    }
    return `translate3d(-${this._offset}, 0, 0)`
  }

  get index() {
    return this._index
  }

  set index(i) {
    let prevIndex = this._index

    if (i < 0) {
      i = 0
    } else if (i > this._default.itemNum - 1) {
      i = this._default.itemNum - 1
    }
    this._index = i

    let duration = Math.abs(prevIndex - i) * this._default.duration
    let transform = this._endTransform

    this.$wrapper.style['-webkit-transition'] = duration + 'ms'
    this.$wrapper.style.transition = duration + 'ms'

    this.$wrapper.style['-webkit-transform'] = transform
    this.$wrapper.style.transform = transform
  }

  _bindEvent() {
    this.$container.addEventListener('touchstart', (e) => {
      this._start.x = e.changedTouches[0].pageX
      this._start.y = e.changedTouches[0].pageY

      this.$wrapper.style['-webkit-transition'] = 'none'
      this.$wrapper.style.transition = 'none'

      e.preventDefault()
      e.stopPropagation()
    }, false)

    this.$container.addEventListener('touchmove', (e) => {
      this._move.x = e.changedTouches[0].pageX
      this._move.y = e.changedTouches[0].pageY

      this.$wrapper.style['-webkit-transform'] = this._moveTransform
      this.$wrapper.style.transform = this._moveTransform

      e.preventDefault()
      e.stopPropagation()
    }, false)

    this.$container.addEventListener('touchend', (e) => {
      this._end.x = e.changedTouches[0].pageX
      this._end.y = e.changedTouches[0].pageY

      let distance = this._endDistance

      if (distance > this._default.threshold) {
        this.prev()
      } else if (distance < -this._default.threshold) {
        this.next()
      } else {
        this.index = this.index
      }

      e.preventDefault()
      e.stopPropagation()
    }, false)
  }

  next() {
    this.index ++
  }
  prev() {
    this.index --
  }
}
