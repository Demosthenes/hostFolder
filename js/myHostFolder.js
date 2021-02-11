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

    // load the content
    folder.load(); 
    
    return folder;
}