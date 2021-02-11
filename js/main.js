import hostFolder from './hostFolder/hostFolder.js'

$(document).ready(function () {

    let $container = $('#gallery')

    // create new loader
    let folder = new hostFolder({
        baseUrl: "/hostFolder/content",
        filename: {
            text: "text.txt",
            image: "image.jpg",
        },
        filepath: {
            loadingImage: "/hostFolder/img/loadingImage.jpg",
            backupImage: "/hostFolder/img/noImage.jpg",
        },
        loadingText: "Checking for more posts...",
        $container
    });

    // What happens once the data is changed?
    folder.textCallback = (id, text) => {
        console.log("text changed: " + text)

        // Default code to handle results
        if ($container === null || !$container.length) return false;
        if ($(`#contentFolder_${id}`).length) {
            $(`#contentFolder_${id} .content-folder-text`).text(text).removeClass('d-none')
        } else {
            $container.append(`<div class="col-md-3" id="contentFolder_${id}"><p class="content-folder-text">${text}</p><img class="content-folder-image d-none img-fluid"></div>`)
        }
    }

    folder.completedCallback = (results, total) => {
        console.log(`Fetched ${total} entries`)
        console.log(results)
    }

    // load the content and save it into results
    // lazy loaded images will get updated once server responds and can be found in folder.results
    let results = folder.load();
});