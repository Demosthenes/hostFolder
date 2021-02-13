### hostFolder

# What is this?
hostFolder is a small javascript plugin to dynamically traverse a server folder and load the contents.  

This data can then be further manipulated, or simply rendered in an html element.  
New folders can simply be added to the server, and will be picked up by the script.    

Please note that since this uses incrementing ids, it is not recommended to be used with sensitive or user data.  
Any usage of this code, by anyone, in perpetuity, is fully on their own risk.   


# How to setup locally

### 1. Get a local server, like apache with [XAMPP](https://www.apachefriends.org/index.html)
### 2. Start the server on localhost
### 3. Clone this repository into your server folder (/htdocs in XAMPP)
### 4. Visit [http://localhost/hostFolder/](http://localhost/hostFolder/)  
  
  
# [Demo](http://mikaelhellsen.com/hostFolder/)  

  
# Dependencies (none really)
- Webserver (otherwise there are cors errors in javascript modules)
- Bootstrap (recommended, not required)


# How to use

Make sure you import the script as a javascript module

```html
 <script type="module" src="js/main.js"></script>
```

Import the code into your javascript file.  
Create a new object from the class and call the .load method.  

Listeners can be applied to the text and image.  
Whenever the data is changed the Renderer function will run.  

```javascript
import hostFolder from './hostFolder/hostFolder.js'

// Wait for jquery to get ready (Jquery not required, but used here)
$(document).ready(function () {

    // Define the location
    let containerId = 'gallery'

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

    let $container = $(`#${containerId}`);

    // What happens once the data is changed?
    folder.cardRenderer = (id, text) => {
        // Create container with text and empty image
        $container.append(`
                <div class="col-md-3" id="hostFolder_${id}">
                    <p class="host-folder-text">${text}</p>
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
        if (folder.noContainer()) return false;
        // Update image source and remove hiding class
        $(`#hostFolder_${id} .host-folder-image`).attr('src', url).removeClass('d-none')
    }

    folder.textCompleted = (results, total) => {
        if (folder.noContainer()) return false;
        // Remove the looking for more text since we reached the end
        $(`#hostFolder_${results[total - 1].id + 1}`).remove();
    }

    // When everything has fully loaded
    folder.imageCompleted = (results, total) => {
        // All images are fully loaded
        console.log(`Fetched all data from ${total} entries`)
        console.log(results)

        // Manual updates of values will trigger the render function
        folder.requestImage( "/hostFolder/img/noImage.jpg", (base64) => {
            folder.results[0].image = base64;
        })
    }

    // load the content and save it into results
    // lazy loaded images will get updated once server responds and can be found in folder.results

    // .load() has two parameters, start and end id. Assuming you know how many images you want, you can target ids.
    // .load(5) will load images in folder 5 and dynamically until nothing more exists
    // .load(1,10) will load images in folder 1 to and with folder 10 (assuming 10 exists, otherwise it exists at the last image)
    // If nothing is supplied, it will assume id 1 is first and load everything after
    // or simply folder.load();
    folder.load(...range);

    // Manual updates of values will trigger the render function
    folder.results[0].text = "updated text";

    return folder;
});
```

The construction options are: 

```javascript

    /**
    * Class Options
    * @param {string} baseUrl This url will be used as a base location when creating paths
    * @param {string} filename.text  The name of your text files
    * @param {string} filename.image  The name of your image files
    * @param {string} filepath.loadingImage  The path to your loading image, relative to baseUrl
    * @param {string} filepath.backupImage  The path to your not found image, relative to baseUrl
    * @param {string} loadingText  What should the text say while loading new results?
    * @param {Object} $container  A reference to a jquery selector for the container you want the content in
    */

```

The listeners available are:

```javascript

  // Render the card that fills with text/image
  cardRenderer = (id, text, containerId, container) => {  }

  // Once the text is found
  textRenderer = (id, text, containerId, container) => {  }
  
  // The image has lazyloaded and is now available
  imageRenderer = (id, url, containerId, container) => {  }

  // We reached the end, nothing found so clean the loadingtext
  textCompleted = (results, total, containerId, container) => { }
  
  // All folders have been searched through and images fully loaded
  imageCompleted = (results, total, containerId, container) =>  { }

```