var IMG_WIDTH = 965;
var currentImg = 0;
var maxImages = 8;
var speed = 500;
var expanded = false;
var imgs;
var txt_total;
var txt_current;
var swipeOptions = {
    triggerOnTouchEnd: true,
    swipeStatus: swipeStatus,
    allowPageScroll: "vertical",
    threshold: 75
};
$(function () {
    imgs = $(".swiper-images");
    txt_total = $("#swiper-total");
    txt_current = $("#swiper-current");
	txt_total.text(maxImages);
	$('#text_less').hide();
    imgs.swipe(swipeOptions);
});
/**
 * Catch each phase of the swipe.
 * move : we drag the div
 * cancel : we animate back to where we were
 * end : we animate to the next image
 */
function swipeStatus(event, phase, direction, distance) {
	IMG_WIDTH = parseInt($('.swiper-images img').css('width'), 10) + 4;
    //If we are moving before swipe, and we are going L or R in X mode, or U or D in Y mode then drag.
    if (phase == "move" && (direction == "left" || direction == "right")) {
        var duration = 0;
        if (direction == "left") {
            scrollImages((IMG_WIDTH * currentImg) + distance, duration);
        } else if (direction == "right") {
            scrollImages((IMG_WIDTH * currentImg) - distance, duration);
        }
    } else if (phase == "cancel") {
        scrollImages(IMG_WIDTH * currentImg, speed);
    } else if (phase == "end") {
        if (direction == "right") {
            previousImage();
        } else if (direction == "left") {
            nextImage();
        }
    }
}
function previousImage() {
	IMG_WIDTH = parseInt($('.swiper-images img').css('width'), 10) + 4;
	//console.log('img width:   ' + IMG_WIDTH);
    currentImg = Math.max(currentImg - 1, 0);
    scrollImages(IMG_WIDTH * currentImg, speed);
	txt_current.text(currentImg+1);
}
function nextImage() {
	IMG_WIDTH = parseInt($('.swiper-images img').css('width'), 10) + 4;
	//console.log('img width:   ' + IMG_WIDTH);
    currentImg = Math.min(currentImg + 1, maxImages - 1);
    scrollImages(IMG_WIDTH * currentImg, speed);
	txt_current.text(currentImg+1);
}
/**
 * Manually update the position of the imgs on drag
 */
function updateExpandButton()	{

	text_h = $('#swiper_text_' + (currentImg+1)).height();
	//console.log('text height:   ' + text_h);

	if(expanded) {
		$('#text_more').hide();
		$('#text_less').show();
		$('#text_none').hide();
		$('#swiper_fader_' + (currentImg+1)).hide();
	} else if(text_h >= 80) {
		$('#text_more').show();
		$('#text_less').hide();
		$('#text_none').hide();
		$('#swiper_fader_' + (currentImg+1)).show();
	}	else	{
		$('#text_more').hide();
		$('#text_less').hide();
		$('#text_none').show();
		$('#swiper_fader_' + (currentImg+1)).hide();
	}
}

function scrollImages(distance, duration) {
    imgs.css("transition-duration", (duration / 1000).toFixed(1) + "s");
    //inverse the number we set in the css
    var value = (distance < 0 ? "" : "-") + Math.abs(distance).toString();
    imgs.css("transform", "translate(" + value + "px,0)");
	updateExpandButton();
}

function swiper_show_more(more) {
	expanded = more;
	if(more) {
		$('.swiper-fader-cont').css('max-height', 'none');
	} else {
		$('.swiper-fader-cont').css('max-height', '160px');
	}	
	updateExpandButton();
}

