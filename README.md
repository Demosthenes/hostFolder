### hostFolder

# How to setup

### 1. Get a local server, like apache with [XAMPP](https://www.apachefriends.org/index.html)
### 2. Start the server on localhost
### 3. Clone this repository into the /htdocs folder
### 4. Visit [http://localhost/hostFolder/](http://localhost/hostFolder/)




# How to initiate

Make sure you import the script as a javascript module

```html
 <script type="module" src="js/main.js"></script>
```

Import the code into your javascript file.
Create a new object from the class and call the .load method.

Listeners can be applied to the text and image.
Whenever the data is changed the callback function will run

```javascript
import hostFolder from './hostFolder/hostFolder.js'

// Wait for jquery to get ready
$(document).ready(function () {

    // Define the location
    let $container = $('#gallery')

    // Create new hostFolder by setting options
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
    
    // Same thing is possible with the image on change
    folder.imageCallback = (id, url) => {
        console.log("image changed: " + text)
    }

    // load the content and save it into results
    // lazy loaded images will get updated once server responds
    let results = folder.load();

    console.log(folder.results); // same as contents in results
    console.log(results); // same as contents in results
});
```