/***
* @author  Mikael Hellsen
* @version 0.9
* @since   2021-02-11 
*/

import myHostFolder from './myHostFolder.js'

let folder1 = myHostFolder('gallery1', [1,4]);
let folder2 = myHostFolder('gallery2', [9,12]);

setTimeout(function(){
    folder1.load(1,8)
}, 5000)