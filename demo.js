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
            const index = Math.floor(Math.random() * (numberOfChanges))
            virtualDOM.children[index].props.style = style;
        }
    }
}

// Set up initial VDOM and render it.
const root = document.querySelector("#root");
let virtualDomTree = app();
const testChanges = [10, 20, 50, 100, 300, 500, 1000];

testChanges.forEach(changes =>{
    // Deep copy VDOM and change comment styles.
    root.innerHTML = "";
    root.appendChild(renderer(app()));
    const newVirtualDomTree = JSON.parse(JSON.stringify(virtualDomTree));
    changeRandomCommentsStyle(newVirtualDomTree, changes, "color:red");

    // Measure full render time.
    const startFullRender = performance.now();
    root.replaceWith(renderer(newVirtualDomTree));
    console.log(`Full render time: ${performance.now() - startFullRender} milliseconds`);

    // Reset to initial VDOM and measure diff and re-render time.
    root.innerHTML = "";
    root.appendChild(renderer(app()));
    let startDiffRender = performance.now();
    diffAndReRender(newVirtualDomTree, virtualDomTree);
    console.log(`Diff time: ${performance.now() - startDiffRender} milliseconds`);
});