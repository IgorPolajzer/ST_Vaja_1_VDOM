import { makeElement, renderer, diffAndReRender } from "./ogrodje.js";

const ol = makeElement("ol");
const li = makeElement("li");

let style = undefined;

const generateComments = (number) => {
    let comments = [];
    for (let i = 0; i < number; i++) {
        comments.push(li({}, [ `Comment  ${i}` ]));
    }

    return comments;
}

const app = (style) => {
    const numberOfComments = 10000;
    const comments = generateComments(numberOfComments);
    const numberOfChanges = Math.floor(Math.random() * (numberOfComments));

    if (style !== undefined) {
        for (let i = 0; i < numberOfChanges; i++) {
            const index = Math.floor(Math.random() * (numberOfComments))
            comments[index].props.style = style;
        }
    }

    return ol({className: "seznam"}, comments);
}

const root = document.querySelector("#root");
const virtualDomTree = app(style);
root.appendChild(renderer(virtualDomTree));

setInterval(() => {
    style = (style === undefined) ? "color:red" : undefined;
    const newVirtualDomTree = app(style)

    let start = Date.now();
    diffAndReRender(newVirtualDomTree, virtualDomTree);
    console.log(`Execution time: ${Date.now() - start} milliseconds`);

}, 1000)