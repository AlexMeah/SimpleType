// Vars + Cached Els
var winH = $(window).height(),
    notepad = $('#notepad'),
    content = $('#content'),
    hideCon = $('#hide-controls'),
    cons = $('#controls'),
    mute = $('#mute'),
    fullBut = $('[data-fullscreen]'),
    sound = null;


//Toggle Fullscreen using required prefix
function toggleFullScreen() {
    fullBut.find('i').toggleClass('active');
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
$('[data-fullscreen]').on('click', function(e) {
    e.preventDefault();
    if(Modernizr.fullscreen) {
        toggleFullScreen();
    } else {
        alert('Sorry your browser does not support this feature, to enter fullscreen manually please press F11.');
    }
});

//Populate fields on ready
function populate() {
    $('#title').val(localStorage.getItem('title')),
    $('#description').val(localStorage.getItem('description')),
    $('#content').html(localStorage.getItem('content'));
}
populate();

//Set localStorage
$('#title').on('keyup', function () {
    localStorage.setItem('title', $(this).val());
    localStorage.setItem('timestamp', (new Date()).getTime());
});
$('#description').on('keyup', function () {
    localStorage.setItem('description', $(this).val());
    localStorage.setItem('timestamp', (new Date()).getTime());
});
$('#content').on('keyup', function () {
    localStorage.setItem('content', $(this).text());
    localStorage.setItem('timestamp', (new Date()).getTime());
});

//Clear localStorage
$('#clear').on('click', function (e) {
    e.preventDefault();
    localStorage.clear();
    populate();
});

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
        sound.currentTime = 0;
    };
    sound.play();
});

//Hide sidebar on click
hideCon.on('click', toggleSidebar);

//Save function
$('#save').on('click', function(e) {
    e.preventDefault();
    if($('#title').val()) {
        if(Modernizr.blobconstructor) {
            var file = new Blob([content.text()], {type: "text/plain;charset=utf-8"});
            saveAs(file, $('#title').val()+'.txt');
        } else {
            alert('Sorry, for the alert. Your browser does not support this feature.');
        }
    }
});
});