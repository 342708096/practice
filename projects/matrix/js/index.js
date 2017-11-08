import $ from 'zepto'

$(function() {
  $(document).on('click', '[data-matrix]', function(e) {
    let $this = $(e.currentTarget)
    let $div = $this.parent().find('div').eq(0)

    $div.css({transform: $this.attr('data-matrix')})
  })
})
