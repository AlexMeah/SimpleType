// Vars + Cached Els
var winH = $(window).height(),
    notepad = $('#notepad'),
    content = $('#content'),
    hideCon = $('#hide-controls'),
    cons = $('#controls'),
    mute = $('#mute'),
    fullBut = null,
    sound = null;


//Toggle Fullscreen using required prefix
function toggleFullScreen(e) {
  e.preventDefault();
  $('.fullscreen-but').find('i').toggleClass('active');
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}

//Animate sidebar using best available method
function toggleSidebar(e) {
  e.preventDefault();
  $('.icon-toggle').toggleClass('active');
  if(Modernizr.csstransitions) {
    cons.toggleClass('hide-controls'),
    notepad.toggleClass('controls-hidden'),
    hideCon.toggleClass('conhid-buttons');
  } else {
    if(cons.is(":visible")) {
        cons.animate({width: '-=300'}, 700, function() {
            $(this).hide();
        }),
        notepad.animate({'padding-right': 0}, 700);
        hideCon.animate({'right': 10}, 700);
    } else {
        cons.show().animate({width: '+=300'}, 700);
        notepad.animate({'padding-right': 330}, 700);
        hideCon.animate({'right': 340}, 700);
    }
  }
}

function isPlaying(audelem) { return !audelem.paused; }

$(document).ready( function() {

    //Enable fullscreen support in supported browsers
    if(Modernizr.fullscreen) {
        cons.append('<a href="#" class="icon-btn fullscreen-but" data-fullscreen title="Enter fullscreen"><i class="icon-fullscreen"></i></a>');
        $('[data-fullscreen]').on('click', toggleFullScreen);
        fullBut = $('.fullscreen-but');
    }

    //Show hide button
    content.on('mouseenter', function() {
        hideCon.stop().animate({'opacity': 1}, 300);
    });
    content.on('mouseleave', function() {
        hideCon.stop().animate({'opacity': 0}, 300);
    });

    //Mute Button
    document.getElementById('mute').addEventListener('click', function (e)
    {
        e = e || window.event;
        sound.muted = !sound.muted;
        e.preventDefault();
        $(this).find('i').toggleClass('active');
    }, false);

    //Play on keypress
    sound = document.getElementsByTagName('audio')[0];
    content.on('keypress', function() {
      if (isPlaying(sound)) {
        sound.pause();
        sound.sound.currentTime = 0;
      };
      sound.play();
    });

    //Hide sidebar on click
    hideCon.on('click', toggleSidebar);
});