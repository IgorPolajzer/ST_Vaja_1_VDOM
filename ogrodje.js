
// HTML element factory function.
const makeElement = (type) => (props = {}, children = []) => {
    return {
        type,
        props,
        children
    };
}

// Sets props on a given HTML element.
const setProps = (element, props) => {
    return Object.keys(props).forEach((key) => {
            const value = props[key];

            if (key === "className") {
                element.setAttribute("class", props[key]);
                return;
            }

            if (key === 'style' && typeof value === 'object') {
              Object.assign(element.style, value);
              return;
            }

            if (key.startsWith('on') && typeof value === 'function') {
              const eventName = key.slice(2).toLowerCase();
              element.addEventListener(eventName, value);
              return;
            }

            if (typeof value === 'boolean') {
              if (value) element.setAttribute(key, '');
              else element.removeAttribute(key);
              return;
            }

            element.setAttribute(key, props[key])
        }
    )
}

// Renders a component object into an actual HTML element.
const renderer = ({type, children = [], props = {}}) => {
    const element = document.createElement(type);
    if (element.id === null || element.id === "") {
        element.id = `id-${crypto.randomUUID()}`;
    }
    props.id = element.id;
    setProps(element, props);

    // If children is a string, it to innerHtml of the current HTML element.
    if (Array.isArray(children)) {
        children.forEach(child => {
            if (child == null) return;

            if (typeof child === "string" || typeof child === "number") {
                element.appendChild(document.createTextNode(String(child)));
            } else {
                element.appendChild(renderer(child));
            }
        });
    } else {
        element.innerHTML = children;
    }

    return element;
}


const areObjectsDifferent = (obj1, obj2) => {
   const allKeys = Array.from(new Set([...Object.keys(obj1), ...Object.keys(obj2)]));
   return allKeys.some(key => obj1[key] !== obj2[key]);
}

const areaNodesDiff = (oldNode, newNode) => {
    if (!oldNode || !newNode || (oldNode.type !== newNode.type)) return true;

    const newChildrenType = typeof newNode.children;
    const oldChildrenType = typeof oldNode.children;

    return newChildrenType !== oldChildrenType
        || areObjectsDifferent(oldNode, newNode)
        || ((newChildrenType === 'string' || newChildrenType === 'number')
            && oldNode.children !== newNode.children)
}

const diffAndReRender = (currentNode, previousNode) => {
    if (areaNodesDiff(currentNode, previousNode)) {
        const nodeId = previousNode.props.id;

        const newElement = renderer(currentNode)
        newElement.id = nodeId;
        currentNode.props.id = nodeId

        return document.querySelector(`#${nodeId}`)
            .replaceWith(newElement);

    } else {
        currentNode.children.forEach((child, index) => {
            diffAndReRender(child, previousNode.children[index]);
        })
    }
}

export { makeElement, renderer, diffAndReRender }