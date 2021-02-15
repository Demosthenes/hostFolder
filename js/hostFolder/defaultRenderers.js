
export function cardRenderer (id, containerId, container) {
    let card = document.createElement("div");
    card.id = `hostFolder_${id}`
    card.className = `col-md-3`
    card.innerHTML = `<p class="host-folder-text"></p><img style="display:none;" class="host-folder-image img-fluid">`
    container.appendChild(card)
}

export function textRenderer (id, text, containerId, container) {
    document.querySelector(`#${containerId} #hostFolder_${id} .host-folder-text`).innerText = text
}

export function imageRenderer (id, url, containerId, container) {
    let img = document.querySelector(`#${containerId} #hostFolder_${id} .host-folder-image`);
    img.src = url;
    img.style.display = "";
}

export function textCompleted (results, total, containerId, container) {
    let textContainer = document.querySelector(`#${containerId} #hostFolder_${results[total-1].id + 1}`);
    textContainer.parentNode.removeChild(textContainer);
}

export function imageCompleted (results, total, containerId, container) {
}