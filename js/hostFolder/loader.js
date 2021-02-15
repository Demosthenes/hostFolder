
export function requestText(url, success = (data) => { }, error = () => { }, always = () => { }) {
    let request = new XMLHttpRequest();
    request.open("GET", url, false) // Request the text file, sync to keep with the while loop
    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            if (request.status === 200) { success(request.responseText) }
            else if (request.status !== 200) { error(); }
            always();
        }
    };
    request.send();
    return request;
}

export function requestImage(url, success = (data) => { }, error = () => { }, always = () => { }) {
    let request = new XMLHttpRequest();
    request.responseType = 'arraybuffer';
    request.open("GET", url) // Request the text file, sync to keep with the while loop
    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            if (request.status === 200) { success(binaryToBase64(request.response, getType(url))) }
            else if (request.status !== 200) { error(); }
            always();
        }
    };
    request.send();
    return request;
}

function getType(url) {
    return url.substring(url.lastIndexOf(".") + 1)
}

function binaryToBase64(bin, type = 'jpg') {
    let uInt8Array = new Uint8Array(bin), i = uInt8Array.length, biStr = new Array(i);
    while (i--) { biStr[i] = String.fromCharCode(uInt8Array[i]); }
    return `data:image/${type};base64,${btoa(biStr.join(''))}`;
} 