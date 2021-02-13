/***
* @author  Mikael Hellsen
* @version 0.9
* @since   2021-02-11 
*/

import myHostFolder from './myHostFolder.js'

$(document).ready(function () {
    // Initiate custom hostFolder
    let folder1 = myHostFolder($('#gallery1'), [1,8]);
    let folder2 = myHostFolder($('#gallery2'), [9,12]);
});