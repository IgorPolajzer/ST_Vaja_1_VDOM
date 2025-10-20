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

const app = () => {
    const numberOfComments = 10000;
    const comments = generateComments(numberOfComments);

    return ol({className: "seznam"}, comments);
}

const changeRandomCommentsStyle = (virtualDOM, numberOfChanges, style) => {
    console.log("Number of changes:", numberOfChanges);

    if (style !== undefined) {
        for (let i = 0; i < numberOfChanges; i++) {
            const len = Array.isArray(virtualDOM.children) ? virtualDOM.children.length : 0;
            const index = Math.floor(Math.random() * len)
            virtualDOM.children[index].props.style = style;
        }
    }
}

// Set up initial VDOM and render it.
const root = document.querySelector("#root");
let virtualDomTree = app();
root.innerHTML = "";
root.appendChild(renderer(virtualDomTree)); // renderer mutates `virtualDomTree.props.id`

const testChanges = [10, 20, 50, 100, 300, 500, 1000];

testChanges.forEach(changes => {
    // create a deep copy of the baseline VDOM and apply random style changes
    const newVirtualDomTree = JSON.parse(JSON.stringify(virtualDomTree));
    changeRandomCommentsStyle(newVirtualDomTree, changes, "color:red");

    // Measure full render time (replace root's children, not the root element)
    root.innerHTML = "";
    root.appendChild(renderer(virtualDomTree)); // restore baseline DOM
    const startFullRender = performance.now();
    root.replaceChildren(renderer(newVirtualDomTree)); // keep root element stable
    console.log(`Full render time: ${performance.now() - startFullRender} milliseconds`);

    // Reset to baseline DOM and measure diff+re-render
    root.innerHTML = "";
    root.appendChild(renderer(virtualDomTree)); // baseline DOM again
    const startDiffRender = performance.now();
    diffAndReRender(newVirtualDomTree, virtualDomTree);
    console.log(`Diff time: ${performance.now() - startDiffRender} milliseconds`);
});