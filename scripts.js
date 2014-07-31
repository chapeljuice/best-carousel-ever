////////////////////////////
// responsive carousel js //
////////////////////////////

/*global $, console, alert, window, document */

var carousel = {

	autoPlayTimer: '',

	// set the direction the slides are going
	direction: '',

	// set states of slides
	allSlides: $( '.carousel-item' ),
	previousSlide: '',
	activeSlide: '',
	nextSlide: '',

	// previous, active, and next slides
	slideSiblings: '',

	// start auto-rotating of carousel items
	autoPlay: function () {

		// set variables
		carousel.setVariables();

		// set direction carousel should move
		carousel.setDirection();

	},

	clearAutoPlay: function () {
		clearInterval( carousel.autoPlayTimer );
	},

	// load next (or previous) image
	loadNextImage: function ( element ) {
		
		// get the src of the img element
		var imgSrc = element.children( '.carousel-img' ).attr( 'src' );

		// check to see if the img's src is blank, and if it is, load the image
		if ( imgSrc !== '' ) {

			// get the data-src of the img element
			var dataSrc = element.children( '.carousel-img' ).attr( 'data-src' );

			// apply that data-src to the img's src attribute
			element
				.children( '.carousel-img' )
				.one( 'load', function () {

					// move the slides back
					carousel.updateSlideClasses();

				})
				.attr( 'src', dataSrc )
				.each( function () {

          // cache fix for browsers that don't trigger .load()
          if( this.complete ) $(this).trigger( 'load' );

        });

		} else {

			// move the slides back
			carousel.updateSlideClasses();

		}

	},

	// move slides back
	moveSlidesBack: function () {
		carousel.allSlides.addClass( 'moving-back' );
	},

	//move slides forward
	moveSlidesForward: function () {
		carousel.allSlides.addClass( 'moving-forward' );	
	},

	// set direction carousel should be moving
	setDirection: function ( directionButton ) {

		// if left button is pressed
		if ( $( directionButton ).hasClass( 'carousel-left' ) ) {

			// setting direction
			carousel.direction = 'back';

			// load the previous image
			carousel.loadNextImage( carousel.previousSlide );

		} else {
			// if right button is pressed		

			// setting direction
			carousel.direction = 'forward';

			// load the next image
			carousel.loadNextImage( carousel.nextSlide );

		}

	},

	// set variables
	setVariables: function () {

		// setting variables
		carousel.slideSiblings = $( '.carousel-item-active, .carousel-item-previous, .carousel-item-next' );
		carousel.previousSlide = $( '.carousel-item-previous' );
		carousel.activeSlide = $( '.carousel-item-active' );
		carousel.nextSlide = $( '.carousel-item-next' );

	},

	// update the slide classes
	updateSlideClasses: function () {

		// check direction slides are going
		if ( carousel.direction === 'back' ) {

			// set what the previous slide will be
			var _newPreviousSlide = carousel.previousSlide.prev( '.carousel-item' );

			// if the current previous slide is the first slide, we'll need to wrap around and select the last slide.
			if ( _newPreviousSlide.length === 0 ) {
				_newPreviousSlide = carousel.allSlides.last();
			}

			_newPreviousSlide
				.addClass( 'carousel-item-previous' );

			carousel.previousSlide
				.removeClass( 'carousel-item-previous' )
				.addClass( 'carousel-item-active' );

			carousel.activeSlide
				.removeClass( 'carousel-item-active' )
				.addClass( 'carousel-item-next' );

			carousel.nextSlide
				.removeClass( 'carousel-item-next' );

		} else {

			// set what the next slide will be
			var _newNextSlide = carousel.nextSlide.next( '.carousel-item' );

			// if the current next slide is the last slide, we'll need to wrap around and select the first slide.
			if ( _newNextSlide.length === 0 ) {
				_newNextSlide = carousel.allSlides.eq( 0 );
			}

			_newNextSlide
				.addClass( 'carousel-item-next' );

			carousel.nextSlide
				.removeClass( 'carousel-item-next' )
				.addClass( 'carousel-item-active' );

			carousel.activeSlide
				.removeClass( 'carousel-item-active' )
				.addClass( 'carousel-item-previous' );

			carousel.previousSlide
				.removeClass( 'carousel-item-previous' );

		}

		carousel.allSlides
			.removeClass( 'moving-back moving-forward' );
	}
};

$( document ).ready( function () {

	// event handlers
	$( '.carousel-navigation button' ).on( 'click', function () {

		// set variables
		carousel.setVariables();

		// set direction carousel should move
		carousel.setDirection( this );

	});

	carousel.autoPlayTimer = window.setInterval( carousel.autoPlay, 5000 );

});