import { makeElement, renderer, diffAndReRender } from "./ogrodje.js";

const ol = makeElement("ol");
const li = makeElement("li");

let style = undefined;
const app = (style) => (
    ol({ className: "seznam"}, [
        li({ style: style}, [ 1 ]),
        li({}, [ 2 ]),
        li({}, [ 3 ])
    ])
)

const root = document.querySelector("#root");
const virtualDomTree = app();
root.appendChild(renderer(virtualDomTree));

setInterval(() => {
    style = (style === undefined) ? "color:red" : undefined;
    const newDOM = app(style)

    let start = Date.now();
    diffAndReRender(newDOM, virtualDomTree);
    console.log(`Execution time: ${Date.now() - start} milliseconds`);

}, 1000)