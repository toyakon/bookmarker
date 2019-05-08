
function createBookMarkPanel () {
    let panel = document.querySelector('#bookmarkpanel')
    if (panel)
        return

    panel = document.createElement('div')
    panel.id = "bookmarkpanel"
    panel.style.display = "none"

    let body = document.querySelector("body")
    body.appendChild(panel)
}

async function showList () {

    let bookmark = await getStorage()
    let panel = document.querySelector("#bookmarkpanel")

    panel.textContent = Object.keys(bookmark).length ? "" : "no bookmark"

    for (let b in bookmark) {
        let mark = document.createElement("div")
        mark.className = "mark"
        mark.innerHTML = `<div class="key">${b}</div><div class="title">${bookmark[b].title}<div class="url">${bookmark[b].url}</div>`
        panel.appendChild(mark)
    }

    panel.style.display =  panel.style.display === "none" ? "block" : "none"
}

var old_key = {}
const form_element = ["INPUT", "TEXTAREA"]
const predefined_key = ["r", "d", "m"]
async function keyDown (e) {
    if (form_element.includes(e.srcElement.tagName))
        return

    let bookmark = await getStorage()
    let now = new Date()
    let diff = now - old_key.time

    if (old_key.key === "m" && diff < 500) {      
        if (e.key === "m") {
            showList()
            return
        }
        if (predefined_key.includes(e.key)) {
            return
        }
        bookmark[e.key] = {url:window.location.href, title:document.title}
      chrome.storage.local.set(bookmark)
    } else if (old_key.key === "d" && diff < 500) {
        chrome.storage.local.remove(e.key)
    } else if(bookmark[e.key]){
        window.location.href = bookmark[e.key].url
    }
    old_key.key = e.key
    old_key.time = now
}

function getStorage() {
  return new Promise(resolve =>{
    chrome.storage.local.get(null, item=>{
      resolve(item)
    })
  })
}
function createBookMark () {
   chrome.storage.local.get('bookmark', (item)=>{
     if(!item)
      chrome.storage.local.set('bookmark', {})
   })
}
window.onload = () => {
    //createBookMark()
    createBookMarkPanel()
    document.addEventListener("keydown", (e)=>{
        keyDown(e)
    })
}
