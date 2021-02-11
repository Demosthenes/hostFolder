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

  
# Dependencies
- Webserver (otherwise there are cors errors in javascript modules)
- Jquery
- Bootstrap (recommended, not required)


# How to use

Make sure you import the script as a javascript module

```html
 <script type="module" src="js/main.js"></script>
```

Import the code into your javascript file.  
Create a new object from the class and call the .load method.  

Listeners can be applied to the text and image.  
Whenever the data is changed the callback function will run.  

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
        if (folder.noContainer()) return false;
        if ($(`#hostFolder_${id}`).length) {
            $(`#hostFolder_${id} .host-folder-text`).text(text)
        } else {
            $container.append(`
                <div class="col-md-3" id="hostFolder_${id}">
                    <p class="host-folder-text">${text}</p>
                    <img class="host-folder-image d-none img-fluid">
                </div>`)
        }
    }
    
    // Same thing is possible with the image on change
    folder.imageCallback = (id, url) => {
        if (folder.noContainer()) return false;
        $(`#hostFolder_${id} .host-folder-image`).attr('src', url).removeClass('d-none')
      }

    folder.textCompleted  = (results, total) => {
        if (folder.noContainer()) return false;
        $(`#hostFolder_${results[total-1].id + 1}`).remove();
    }

    // When everything has fully loaded
    folder.imageCompleted = (results, total) => {
        console.log(`Fetched all data from ${total} entries`)
        console.log(results)
    }

    // load the content and save it into results
    // lazy loaded images will get updated once server responds and can be found in folder.results
    let results = folder.load();
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
  // Once the text is found
  textCallback = (id, text) => {  }
  
  // The image has lazyloaded and is now available
  imageCallback = (id, url) => {  }

  // We reached the end, nothing found so clean the loadingtext
  textCompleted = (results, total) => { }
  
  // All folders have been searched through
  imageCompleted = (results, total) =>  { }

```