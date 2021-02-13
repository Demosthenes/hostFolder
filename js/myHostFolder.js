/***
* @author  Mikael Hellsen
* @version 0.9
* @since   2021-02-11 
*/

import hostFolder from './hostFolder/hostFolder.js'

export default function myHostFolder (containerId, range) {
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
        container : containerId
    });

    // load the content
    folder.load(...range); 
    
    return folder;
}