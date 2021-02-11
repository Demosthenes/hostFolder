import hostFolder from './hostFolder/hostFolder.js'

export default function myHostFolder ($container) {
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
        if (folder.noContainer()) return false;
        if ($(`#hostFolder_${id}`).length) {
            $(`#hostFolder_${id} .host-folder-text`).text(text).removeClass('d-none')
        } else {
            $container.append(`
                <div class="col-md-3" id="hostFolder_${id}">
                    <p class="host-folder-text">${text}</p>
                    <img class="host-folder-image d-none img-fluid">
                </div>`)
        }
    }

    folder.imageCallback = (id, url) => {
        if (folder.noContainer()) return false;
        $(`#hostFolder_${id} .host-folder-image`).attr('src', url).removeClass('d-none')
      }

    folder.textCompleted  = (results, total) => {
        if (folder.noContainer()) return false;
        $(`#hostFolder_${results[total-1].id + 1}`).remove();
    }

    folder.imageCompleted = (results, total) => {
        console.log(`Fetched all data from ${total} entries`)
        console.log(results)
    }

    // load the content and save it into results
    // lazy loaded images will get updated once server responds and can be found in folder.results
    let results = folder.load(); 
    
    return folder;
}