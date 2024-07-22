
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