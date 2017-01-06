$(function() {

  // Find the wrapping element
  var wrap = $("body > .wrapper"),
      all_links = $("a[rel^='gf-']", wrap),
      container = $(".content-underlay", wrap),
      max_x = 750 + $(wrap).offset().left; // 655 is the width of the three blocks of links

  // Bind to any links with rel gf-*
  all_links
    .on("mouseenter", function() {
      var rel = $(this).attr('rel'),
          box, image;

      // Highlight only this link (and others with the same rel attribute)
      $(all_links).removeClass("highlighted").filter("a[rel='" + rel + "']").addClass("highlighted");

      // Draw a box around the links
      box = { x: 0, y: 0, w: 0, h: 0 };
      $(all_links).filter("a[rel='" + rel + "']").each(function(i, e) {
        var offset = $(e).offset(),
            width = $(e).outerWidth(),
            height = $(e).outerHeight(),
            x = offset.left, y = offset.top,
            w = offset.left + width, h = offset.top + height;

        box.x = box.x ? Math.min(box.x, x) : x;
        box.y = box.y ? Math.min(box.y, y) : y;
        box.w = Math.max(box.w, w);
        box.h = Math.max(box.h, h - box.y);
      });

      // Enforce some constraints
      if (box.x + box.w > max_x) {
        box.w += (max_x - (box.x + box.w));
      }

      // If the image is larger than the box, adjust the box to fit
      image = $("<img />")
                .attr("src", $(container).data(rel))
                .appendTo($("body"))
                .hide()
                .load(function() {

                  // Width
                  if ($(this).width() > box.w) {
                    box.x -= ($(this).width() - box.w) / 2;
                    box.w = $(this).width();
                  }

                  // Height
                  if ($(this).height() > box.h) {
                    box.y -= ($(this).height() - box.h) / 2;
                    box.h = $(this).height();
                  }

                  // Set the container image
                  $(container)
                    .css({
                      width: box.w + 'px',
                      height: box.h + 'px',
                      left: box.x + 'px',
                      top: box.y + 'px',
                      backgroundImage: 'url(' + $(container).data(rel) + ')'
                    })
                    .data("active-rel", rel)
                    .fadeIn(200);

                  // Remove the image
                  $(this).remove();
                });
    })
    .on("mouseout", function() {
      $(all_links).removeClass("highlighted");
      if ($(container).data("active-rel") == $(this).attr("rel")) {
        $(container)
          .stop()
          .fadeOut(200);
      }
    });
});
