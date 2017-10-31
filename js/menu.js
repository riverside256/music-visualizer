var menu, opened;

function init() {
    menu = document.querySelector(".audio-settings");
    opened = false;

    menu.querySelector(".audio-settings__opener").addEventListener("click", function(e) {
        opened = !opened;

        if(opened) {
            menu.querySelector(".audio-settings__content").classList.add("audio-settings__content--opened");
        }
        else {
            menu.querySelector(".audio-settings__content").classList.remove("audio-settings__content--opened");
        }

    }, false);

    document.body.addMultiEventListener("click keyup", function(e) {
        var k = e.keyCode || e.which;

        if(k == 27 || !isTarget(e, "audio-settings")) {
            opened = false;
            menu.querySelector(".audio-settings__content").classList.remove("audio-settings__content--opened");
        }

    });
}



(function() {
    init();
})();