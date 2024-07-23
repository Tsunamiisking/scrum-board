const backlogContainer = document.getElementById('backlog');
const todoItems = document.getElementById('todo-items');
const inProgressItems = document.getElementById('inprogress-items');
const FinishedItems = document.getElementById('finished-items');



function debugStuff() {
    let items = document.querySelectorAll('.backlog-item');
    console.log(items)
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
    debugStuff()
}

function dragger(className, parentNode) {
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
                    parentNode.appendChild(selected);
                    selected = null;
                };

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
    let items = document.querySelectorAll(className);
    applyDragger(items);

    // Observe for new items being added to the DOM
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.matches(className)) {
                    applyDragger([node]);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Recieve Backlog
document.addEventListener('DOMContentLoaded', () => {
    dragger('.backlog-item', todoItems)
    dragger('.backlog-item', inProgressItems)
    dragger('.backlog-item', FinishedItems)
})
