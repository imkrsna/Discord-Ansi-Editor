const submitBtn = document.querySelector(".submitbtn");
const inputText = document.querySelector(".inputText");
const preview = document.querySelector(".preview");

// [[ Add Text to Preview ]]

submitBtn.addEventListener("click", () => {
    let text = inputText.value;
    for(char of text) {
        if(char != '\n') {
            let span = document.createElement("span");
            span.setAttribute("data-newline", "0");
            span.setAttribute("data-color", "0");
            span.setAttribute("data-background", "0");
            span.setAttribute("data-bold", "0");
            span.setAttribute("data-underline", "0");
            span.textContent = char;
            preview.appendChild(span);
        } else {
            let span = document.createElement("br");
            span.setAttribute("data-newline", "1");
            preview.appendChild(span);
        }
    }
    inputText.value = "";
})

// [[ Get Selection ]]
function previewSelection() {
    let selection = document.getSelection();
    if(selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        let start = range.startContainer.parentElement;
        let end = range.endContainer.parentElement;
        let flag = false;
        let results = []

        for(span of preview.querySelectorAll("span")) {
            if(span === start) flag = true;
            if(flag) results.push(span);
            if(span === end) flag = false;
        }
        return results;
    }
    return null;
}

// [[ Editor Options ]]
const cleanBtn = document.getElementById("clean");
const boldBtn = document.getElementById("bold");
const underlineBtn = document.getElementById("underline");
const clearBtn = document.getElementById("clear");

cleanBtn.addEventListener("click", () => {
    let selection = previewSelection();
    if(selection) {
        for(span of selection) {
            span.style.color = "#b9bbbe";
            span.setAttribute("data-color", "0");
            span.style.fontWeight = "normal";
            span.setAttribute("data-bold", "0");
            span.style.textDecoration = "none";
            span.setAttribute("data-underline", "0");
            span.style.backgroundColor = "";
            span.setAttribute("data-background", "0");
        }
    }
});

boldBtn.addEventListener("click", () => {
    let selection = previewSelection();
    if(selection) {
        for(span of selection) {
            span.style.fontWeight = "bold";
            span.setAttribute("data-bold", "1");
        }
    }
});

underlineBtn.addEventListener("click", () => {
    let selection = previewSelection();
    if(selection) {
        for(span of selection) {
            span.style.textDecoration = "underline";
            span.setAttribute("data-underline", "1");
        }
    }
});

clearBtn.addEventListener("click", () => {
    preview.innerHTML = "";
});

// [[ Color Select ]]
const selectColor = document.getElementById("selectColor");
const selectBgColor = document.getElementById("selectBgColor");
const fgDropDown = document.getElementById("fgDropDown");
const bgDropDown = document.getElementById("bgDropDown");

selectColor.addEventListener("click", () => {
    fgDropDown.querySelector(".dropdown-items").classList.toggle("deactive");
});

selectBgColor.addEventListener("click", () => {
    bgDropDown.querySelector(".dropdown-items").classList.toggle("deactive");
});

fgDropDown.querySelector(".dropdown-items").querySelectorAll(".dropdown-item").forEach((child) => {
    child.addEventListener("click", () => {
        let color = getComputedStyle(child, null).getPropertyValue("background-color");
        let code = child.getAttribute("data-color");
        selectColor.style.color = color;
        selectColor.setAttribute("data-color", code.toString());
        fgDropDown.querySelector(".dropdown-items").classList.toggle("deactive");
    });
});

bgDropDown.querySelector(".dropdown-items").querySelectorAll(".dropdown-item").forEach((child) => {
    child.addEventListener("click", () => {
        let color = getComputedStyle(child, null).getPropertyValue("background-color");
        let code = child.getAttribute("data-background");
        selectBgColor.style.color = color;
        selectBgColor.setAttribute("data-background", code.toString());
        bgDropDown.querySelector(".dropdown-items").classList.toggle("deactive");
    });
});

// [[ Color Change ]]
const fgColorBtn = document.getElementById("fg-color");
const bgColorBtn = document.getElementById("bg-color");

fgColorBtn.addEventListener("click", () => {
    let selection = previewSelection();
    if(selection) {
        for(span of selection) {
            let color = getComputedStyle(selectColor, null).getPropertyValue("color");
            span.style.color = color;
            span.setAttribute("data-color", selectColor.getAttribute("data-color"));
        }
    }
});

bgColorBtn.addEventListener("click", () => {
    let selection = previewSelection();
    if(selection) {
        for(span of selection) {
            let color = getComputedStyle(selectBgColor, null).getPropertyValue("color");
            span.style.backgroundColor = color;
            span.setAttribute("data-color", selectBgColor.getAttribute("data-background"));
        }
    }
});

// [[ Copy Ansi Text ]]
const copyBtn = document.querySelector(".copy");

copyBtn.addEventListener("click", () => {
    let output = "```ansi\n[0m"
    let prevColor = "0";
    let prevBold = "0";
    let prevUnderline = "0";
    let prevBackground = "0";

    for(span of preview.querySelectorAll("*")) {
        if(span.getAttribute("data-newline") === "0") {
            if(span.getAttribute("data-bold") != prevBold) {
                if(span.getAttribute("data-bold") === "1") output += `[1m`
                else output += `[0m`
                prevBold = span.getAttribute("data-bold");
            }
            if(span.getAttribute("data-underline") != prevUnderline) {
                if(span.getAttribute("data-underline") === "1") output += `[4m`
                else output += `[0m`
                prevUnderline = span.getAttribute("data-underline");
            }
            if(span.getAttribute("data-background") != prevBackground) {
                output += `[${span.getAttribute("data-background")}m`;
                prevBackground = span.getAttribute("data-background");
            }
            if(span.getAttribute("data-color") != prevColor) {
                output += `[${span.getAttribute("data-color")}m`;
                prevColor = span.getAttribute("data-color");
            }
            output += span.textContent;
        } else {
            output += '\n';
        }
    }
    output += '\n```';
    navigator.clipboard.writeText(output);
});