/***
* @author  Mikael Hellsen
* @version 0.9
* @since   2021-02-11 
*/

import hostFolder from './hostFolder/hostFolder.js'

export default function myHostFolder(containerId, range) {
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
        container: containerId
    });

    /**
    let $container = $(`#${containerId}`);

    // What happens once the data is changed?
    folder.cardRenderer = (id, text) => {
        // Create container with text and empty image
        $container.append(`
                <div class="col-md-3" id="hostFolder_${id}">
                    <p class="host-folder-text"></p>
                    <img class="host-folder-image d-none img-fluid">
                </div>`)
    }

    // What happens once the data is changed?
    folder.textRenderer = (id, text) => {
        // Update text field
        $(`#hostFolder_${id} .host-folder-text`).text(text)
    }

    // Same thing is possible with the image on change
    folder.imageRenderer = (id, url) => {
        // Update image source and remove hiding class
        $(`#hostFolder_${id} .host-folder-image`).attr('src', url).removeClass('d-none')
    }

    folder.textCompleted = (results, total) => {
        // Remove the looking for more text since we reached the end
        $(`#hostFolder_${results[total - 1].id + 1}`).remove();
    }

    // When everything has fully loaded
    folder.imageCompleted = (results, total) => {
        // All images are fully loaded
        console.log(`Fetched all data from ${total} entries`)
        console.log(results)
        
        // Update contents after 5 seconds
        setTimeout(function(){
            folder.load(...range);
        }, 5000)
        
        // Manual updates of values will trigger the render function, urls still work
        results[0].image =  "/hostFolder/img/noImage.jpg";

        // it can also be loaded specifically
        folder.results[1].image =  folder.loadingImage; // set loading image from cached base64
        folder.requestImage( "/hostFolder/img/loadingImage.jpg", (base64) => {
            folder.results[1].image = base64; // update with new image result
        })
    }
    */
 
    // load the content and save it into results
    // lazy loaded images will get updated once server responds and can be found in folder.results

    // .load() has two parameters, start and end id. Assuming you know how many images you want, you can target ids.
    // .load(5) will load images in folder 5 and dynamically until nothing more exists
    // .load(1,10) will load images in folder 1 to and with folder 10 (assuming 10 exists, otherwise it exists at the last image)
    // If nothing is supplied, it will assume id 1 is first and load everything after
    // or simply folder.load();
    folder.load(...range);

    return folder;
}