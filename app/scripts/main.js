// Vars + Cached Els
var winH = $(window).height(),
    winW = $(window).width(),
    notepad = $('#notepad'),
    content = $('#content'),
    hideCon = $('#hide-controls'),
    cons = $('#controls'),
    mute = $('#mute'),
    fullBut = $('[data-fullscreen]'),
    sound = null,
    title =  localStorage.getItem('title') || $('#title').val(),
    description,
    contentbody = "Why you saving blank files fool.";


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

function shout(html) {
    var overlay = '<div id="modal-bg"></div>';

    //Add Background
    $('body').append(overlay),
    $('#modal-bg').after('<div id="alert">' + html + '<a href="#" class="btn btn-primary" data-dismiss-modal>Ok</a></div>');

    var el = $('#alert'),
        elW = el.width();
            //Animate visibility from top
            el.css('margin-left', '-'+elW/2+'px').stop().animate({ top: 300}, 300);

    $('[data-dismiss-modal]').on('click', function(event) {
        event.preventDefault();
        $('#alert').stop().animate({top: '100%'}, 300, function() {
            $('#modal-bg').remove(),
            $('#alert').remove();
        });
    });
}

function isPlaying(audelem) { return !audelem.paused; }

$(document).ready( function() {

//Enable fullscreen support in supported browsers
fullBut.on('click', function(e) {
    e.preventDefault();
    if(Modernizr.fullscreen) {
        toggleFullScreen();
    } else {
        shout('Sorry, your browser does not support this feature, to enter fullscreen manually please press F11.');
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
    title = $(this).val();
    localStorage.setItem('title', title);
    localStorage.setItem('timestamp', (new Date()).getTime());
});
$('#description').on('keyup', function () {
    description = $(this).val();
    localStorage.setItem('description', description);
    localStorage.setItem('timestamp', (new Date()).getTime());
});
$('#content').on('keyup', function () {
    contentbody = $(this).text();
    localStorage.setItem('content', contentbody);
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
$('#mute').on('click', function (e) {
    e = e || window.event;
    sound.muted = !sound.muted;
    e.preventDefault();
    $(this).find('i').toggleClass('active');
});

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
    if(title.length) {
        if(Modernizr.blobconstructor) {
            var file = new Blob([contentbody], {type: "text/plain;charset=utf-8"});
            saveAs(file, title+'.txt');
        } else {
            shout('Sorry, your browser does not support this feature.');
        }
    } else {
        shout('Please enter a title.')
    }
});
});