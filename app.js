const backlogContainer = document.getElementById('backlog');
const backlogItems = document.getElementById('backlog-items')
const todoItems = document.getElementById('todo-items');
const inProgressItems = document.getElementById('inprogress-items');
const FinishedItems = document.getElementById('finished-items');
// const storedBacklog = JSON.parse(localStorage.getItem('backlogs'))


function saveToLocalStorage(itemKey, item) {
    // Retrieve existing items from localStorage or create a new array if none exists
    let existingItems = JSON.parse(localStorage.getItem(itemKey)) || [];

    // Add the new item to the array
    existingItems.push(item.outerHTML); // Save the HTML content of the item

    // Save the updated array back to localStorage
    localStorage.setItem(itemKey, JSON.stringify(existingItems));
}

function saveItems(itemKey, listOfClass) {
    listOfClass.forEach(item => {
        saveToLocalStorage(itemKey, item)
    })
}

function formatDate(date) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()]; // getMonth() returns a zero-based index
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
}


document.getElementById('form').onsubmit = (e) => {
    e.preventDefault();
    let input = document.getElementById('backlog-value')
    let backlogItem = document.createElement('div')
    let date = new Date()
    let formattedDate = formatDate(date)
    backlogItem.innerHTML = `${input.value} -- ${formattedDate}`
    backlogItem.setAttribute('draggable', true)
    backlogItem.className = 'backlog-item'
    document.getElementById('backlog-items').appendChild(backlogItem)
    input.value = '';
}

function dragger(prevName, parentNode, newClass) {
    function applyDragger(items) {
        items.forEach(item => {
            item.setAttribute('draggable', 'true'); // Ensure items are draggable

            item.addEventListener('dragstart', (e) => {
                let selected = e.target;

                const handleDragOver = (e) => {
                    e.preventDefault();
                };

                const handleDrop = (e) => {
                    e.preventDefault();
                    // Check if the item is being moved to a different parent
                    if (selected.parentNode !== parentNode) {
                        // Remove item from localStorage
                        removeItemFromLocalStorage(prevName, selected.outerHTML);

                        // Append the item to the new parent node
                        parentNode.appendChild(selected);

                        // Reset the class of the dropped item to newClass
                        selected.className = newClass;

                        // Save updated state to localStorage
                        saveItems(prevName, document.querySelectorAll(prevName));
                    }

                }
                parentNode.addEventListener('dragover', handleDragOver);
                parentNode.addEventListener('drop', handleDrop);

                // Cleanup event listeners after drop
                item.addEventListener('dragend', () => {
                    parentNode.removeEventListener('dragover', handleDragOver);
                    parentNode.removeEventListener('drop', handleDrop);
                });
            });
        });
    }

    // Apply dragger to existing items
    let items = document.querySelectorAll(prevName);
    applyDragger(items);

    // Save initial items to localStorage
    // saveItems(prevName, items);

    // Observe for new items being added to the DOM
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.matches(prevName)) {
                    applyDragger([node]);
                    saveItems(prevName, document.querySelectorAll(prevName));
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Function to remove an item from localStorage
function removeItemFromLocalStorage(itemKey, itemHTML) {
    let existingItems = JSON.parse(localStorage.getItem(itemKey)) || [];
    const index = existingItems.indexOf(itemHTML);
    if (index > -1) {
        existingItems.splice(index, 1); // Remove the item from the array
    }
    localStorage.setItem(itemKey, JSON.stringify(existingItems)); // Save the updated array back to localStorage
}

// Function to restore items from localStorage
function restoreItems(itemKey, parentNode) {
    let storedItems = JSON.parse(localStorage.getItem(itemKey)) || [];
    storedItems.forEach(itemHTML => {
        let div = document.createElement('div');
        div.innerHTML = itemHTML;
       document.getElementById(parentNode).appendChild(div.firstElementChild);
    });
}

// Todo Recieve Backlog
document.addEventListener('DOMContentLoaded', () => {
    dragger('.backlog-item', todoItems, 'todo-item');
    dragger('.todo-item', inProgressItems, 'inprogress-item');
    dragger('.inprogress-item', FinishedItems, 'final-item ');

    restoreItems('.backlog-item', 'backlog-items');
    restoreItems('.todo-item', 'todo-items');
    restoreItems('.inprogress-item', 'inprogress-items');
});



// Restore items on page load
// document.addEventListener('DOMContentLoaded', () => {
//     restoreItems('.backlog-item', backlogItems);
// });

