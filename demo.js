import { makeElement, renderer, diffAndReRender } from "./ogrodje.js";

const ol = makeElement("ol");
const li = makeElement("li");

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
root.appendChild(renderer(virtualDomTree));

const testChanges = [10, 20, 50, 100, 300, 500, 1000];
const numberOfIterations = 5;

testChanges.forEach(changes => {
    let resultDiff = 0;
    let resultFull = 0;
    for (let i = 0; i < numberOfIterations; i++) {
        // create a deep copy of the baseline VDOM and apply style changes
        const newVirtualDomTree = JSON.parse(JSON.stringify(virtualDomTree));
        changeRandomCommentsStyle(newVirtualDomTree, changes, "color:red");

        // Measure full render time
        root.innerHTML = "";
        root.appendChild(renderer(virtualDomTree));
        const startFullRender = performance.now();
        root.replaceChildren(renderer(newVirtualDomTree));
        resultFull += performance.now() - startFullRender;

        // Reset to baseline DOM and measure diff rerender
        root.innerHTML = "";
        root.appendChild(renderer(virtualDomTree));
        const startDiffRender = performance.now();
        diffAndReRender(newVirtualDomTree, virtualDomTree);
        resultDiff += performance.now() - startDiffRender;
    }
    console.log(`Average full render time for ${changes} changes: ${resultFull / numberOfIterations} milliseconds`);
    console.log(`Average diff+re-render time for ${changes} changes: ${resultDiff / numberOfIterations} milliseconds`);
});