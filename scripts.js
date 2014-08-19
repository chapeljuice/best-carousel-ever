////////////////////////////
// responsive carousel js //
////////////////////////////

/*global $, console, alert, window, document */

var carousel = {

	// set the direction the slides are going
	direction: '',

	// set states of slides
	allSlides: $( '.carousel-item' ),
	previousSlide: '',
	activeSlide: '',
	nextSlide: '',
	previousAdjacentSlide: '',
	nextAdjacentSlide: '',

	// was there a nav thumb clicked?
	clickedThumb: false,

	// previous, active, and next slides
	slideSiblings: '',

	// set timer for slides
	timer: '',

	// all thumbnails
	allThumbs: $( '.carousel-thumb-button' ),

	// set current thumbnail
	activeThumb: '',

	// current active slide's data-thumb-id attribute value
	dataThumbId: '',

	// set the slide of the thumb that was clicked
	thumbClickedSlide: '',

	// setting navigation buttons
	navButtons: $( 'button.carousel-navigation' ),
	leftButton: $( '.carousel-left' ),
	rightButton: $( '.carousel-right' ),

	// advance carousel items
	advanceSlide: function () {

		// set variables
		carousel.setVariables();

		// set direction carousel should move
		carousel.setDirection();

	},

	// check what the next/previous slide should be
	checkAdjacentSlide: function ( direction ) {

		// set variable here for use only in this function
		var _newPrevAdjacentSlide;
		var _newAdjacentSlide;

		// check the direction of the slide movement
		if ( direction === 'previous' ) {

			// set what the next/previous slide will be
			_newAdjacentSlide = carousel.previousSlide.prev( '.carousel-item' );

			// if the current previous slide is the first slide, we'll need to wrap around and select the last slide.
			if ( _newAdjacentSlide.length === 0 ) {
				_newAdjacentSlide = carousel.allSlides.last();
			}

		} else if ( direction === 'next' ){

			// set what the next slide will be
			_newAdjacentSlide = carousel.nextSlide.next( '.carousel-item' );

			// if the current next slide is the last slide, we'll need to wrap around and select the first slide.
			if ( _newAdjacentSlide.length === 0 ) {
				_newAdjacentSlide = carousel.allSlides.eq( 0 );
			}

		} else if ( direction === 'none' ) {

			// set the prev/next slides
			_newPrevAdjacentSlide = carousel.thumbClickedSlide.prev( '.carousel-item' );
			_newAdjacentSlide = carousel.thumbClickedSlide.next( '.carousel-item' );

			// if the current prev/next slides are the first/last slides, we'll need to wrap around and select the last/first slides.
			if ( _newPrevAdjacentSlide.length === 0 ) {
				_newPrevAdjacentSlide = carousel.allSlides.last( '.carousel-item' );
			}
			if ( _newAdjacentSlide.length === 0 ) {
				_newAdjacentSlide = carousel.allSlides.eq( 0 );
			}

		}

		// set variables for use in later functions
		carousel.previousAdjacentSlide = _newPrevAdjacentSlide;
		carousel.nextAdjacentSlide = _newAdjacentSlide;

	},

	// check media queries
	checkMediaQueries: function () {

		// test media queries
		// over 600px wide...
		if ( window.matchMedia( '(min-width: 600px)' ).matches ) {

			// load larger, higher quality images
			$( '.carousel-img' ).each( function () {
				
				if ( $( this ).attr( 'src' ) !== '' ) {

				}
			});

		}

		// over 768px wide...
		if ( window.matchMedia( '(min-width: 768px)' ).matches ) {
	  	
	  	// load the carousel thumbnails
	  	$( '.carousel-thumb-img' ).each( function () {
	  		var dataSrc = $( this ).attr( 'data-src' );
	  		$( this ).attr( 'src', dataSrc );
	  	});

	  	// now show the thumbnails
	  	$( '.carousel-thumbnails' )
	  		.css( 'display', 'inline-block' );

		} else {

			// hide the thumbnails
			$( '.carousel-thumbnails' ).hide();
		}

	},

	// load next (or previous) image
	loadNextImage: function ( element ) {
		
		// get the src of the img element
		var imgSrc = $( element ).children( '.carousel-img' ).attr( 'src' );

		// check to see if the img's src is blank, and if it is, load the image
		if ( imgSrc !== '' ) {

			// get the data-src of the img element
			var dataSrc = $( element ).children( '.carousel-img' ).attr( 'data-src' );

			// apply that data-src to the img's src attribute
			$( element )
				.children( '.carousel-img' )
				.one( 'load', function () {

					// update the slide classes
					carousel.updateSlideClasses();

				})
				.attr( 'src', dataSrc )
				.each( function () {

          // cache fix for browsers that don't trigger .load()
          if( this.complete ) $(this).trigger( 'load' );

        });

		} else {

			// update the slide classes
			carousel.updateSlideClasses();

		}

	},

	// move to specific slide
	moveToSlide: function () {

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

		} else if ( carousel.clickedThumb === true ) {
			// nav thumb was clicked
			carousel.direction = 'none';

			// load the clicked image
			carousel.loadNextImage( carousel.thumbClickedSlide );

		} else {
			// if right button or nothing is pressed		

			// setting direction
			carousel.direction = 'next';

			// load the next image
			carousel.loadNextImage( carousel.nextSlide );

		}

	},

	// set variables
	setVariables: function () {

			carousel.slideSiblings = $( '.carousel-item-active, .carousel-item-previous, .carousel-item-next' );
			carousel.previousSlide = $( '.carousel-item-previous' );
			carousel.activeSlide = $( '.carousel-item-active' );
			carousel.nextSlide = $( '.carousel-item-next' );

	},

	// start auto advancing slides
	startSlideTimer: function () {
		carousel.timer = window.setInterval( carousel.advanceSlide, 5000 );
	},

	// stop auto advancing slides
	stopSlideTimer: function () {
		clearInterval( carousel.timer );

		//set timer to false so we can check it if we need to
		carousel.timer = false;
	},

	// reset the timer
	resetTimer: function () {

		// set clickedThumb to false
		carousel.clickedThumb = false;

		// stop the timer
		carousel.stopSlideTimer();

		// start the timer back up
		carousel.startSlideTimer();

	},

	// update the slide classes
	updateSlideClasses: function () {

		$( '.carousel-button' )
			.attr( 'tabindex', '-1' );

		// check the direction the slides are going
		if ( carousel.direction === 'back' ) {

			// find the next adjacent slide
			carousel.checkAdjacentSlide( 'previous' );

			// add previous class to the appropriate slide
			carousel.nextAdjacentSlide
				.addClass( 'carousel-item-previous' );

			// previous slide becomes active slide
			carousel.previousSlide
				.removeClass( 'carousel-item-previous' )
				.addClass( 'carousel-item-active' );

			// active slide becomes next slide
			carousel.activeSlide
				.removeClass( 'carousel-item-active' )
				.addClass( 'carousel-item-next' );

			// next slide becomes rando no-class slide :)
			carousel.nextSlide
				.removeClass( 'carousel-item-next' );

		} else if ( carousel.direction === 'next' ) {

			// direction must be 'next'
			carousel.checkAdjacentSlide( 'next' );

			// add next class to the appropriate slide
			carousel.nextAdjacentSlide
				.addClass( 'carousel-item-next' );

			// next slide becomes active slide
			carousel.nextSlide
				.removeClass( 'carousel-item-next' )
				.addClass( 'carousel-item-active' );

			// active slide becomes previous slide
			carousel.activeSlide
				.removeClass( 'carousel-item-active' )
				.addClass( 'carousel-item-previous' );

			// previous slide becomes rando no-class slide :)
			carousel.previousSlide
				.removeClass( 'carousel-item-previous' );

		} else {

			// reset slide classes
			carousel.allSlides
				.attr( 'class', 'carousel-item' );

			// direction is 'none'
			carousel.checkAdjacentSlide( 'none' );

			// add next class to the appropriate slide
			carousel.nextAdjacentSlide
				.addClass( 'carousel-item-next' );

			// make the clicked nav slide the active slide
			carousel.thumbClickedSlide
				.addClass( 'carousel-item-active' );

			// set the previous slide
			carousel.previousAdjacentSlide
				.addClass( 'carousel-item-previous' );


		}

		// make the CTA button on the active slide focusable
		$( '.carousel-item-active .carousel-button' )
			.attr( 'tabindex', '0' );

		// slide are finished moving, so remove those classes
		carousel.allSlides
			.removeClass( 'moving-back moving-forward' );

		// set / update the variables once more
		carousel.setVariables();

		// set which thumbnail is active
		carousel.dataThumbId = carousel.activeSlide.attr( 'data-thumb-id' );
		carousel.activeThumb = $( '#' + carousel.dataThumbId );

		// remove active class from thumbs
		carousel.allThumbs
			.removeClass( 'active' );

		// add active class to appropriate thumb
		carousel.activeThumb
			.addClass( 'active' );
	}
};

// when the document is loaded...
$( document ).ready( function () {

	// event handlers
	// when clicking on a right / left arrow button...
	carousel.navButtons.on( 'click', function () {

		// set variables
		carousel.setVariables();

		// set direction carousel should move
		carousel.setDirection( this );

		// reset the timer if someone manually navigates
		carousel.resetTimer();

	});

	// when clicking on a thumbnail ...
	carousel.allThumbs.on( 'click', function () {

		// set clickedThumb to true
		carousel.clickedThumb = true;

		// get the id of the thumb that was clicked
		var thumbClickedId = $( this ).attr( 'id' );

		// set the slide that corresponds with that thumb
		carousel.thumbClickedSlide = $( '.carousel-item[data-thumb-id="' + thumbClickedId + '"]' );

		// advance the carousel slides
		carousel.advanceSlide();

		// reset the timer if someone manually navigates
		carousel.resetTimer();

	});

	// keyboard navitation for carousel
	$( window ).on( 'keyup', function ( e ) {

		// get the key code
		var key = e.which;

		// if the user presses 'left arrow'
		if ( key === 37 ) {

			// set variables
			carousel.setVariables();

			// set direction carousel should move
			carousel.setDirection( carousel.leftButton ); 

			// set focus to the left navigation button
			carousel.leftButton.focus();

			// reset the timer if someone manually navigates
			carousel.resetTimer();


		} else if ( key === 39 ) {
			// if the user presses 'right arrow'

			// set variables
			carousel.setVariables();

			// set direction carousel should move
			carousel.setDirection( carousel.rightButton );

			// set focus to the right navigation button
			carousel.rightButton.focus();

			// reset the timer if someone manually navigates
			carousel.resetTimer();

		} else if ( key === 32) {
			// if the user presses 'spacebar'

			// blur focus from nav buttons
			carousel.navButtons.blur();

			// stop the auto-advancement if it's auto-advancing
			if ( carousel.timer !== false ) {

				// stop auto-playing slides
				carousel.stopSlideTimer();

			} else {

				// start up auto-playing slides again
				carousel.startSlideTimer();
			}
		}

	});

	// start carousel auto-play
	carousel.startSlideTimer();

	// check media queries...
	carousel.checkMediaQueries();

	// when the window resizes...
	$( window ).resize( function () {

		// check the media queries
		carousel.checkMediaQueries();

	});

});