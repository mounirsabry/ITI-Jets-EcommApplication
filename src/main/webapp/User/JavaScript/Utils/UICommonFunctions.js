// Helper functions
const formatDate = function(isoDateString) {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const formatTime = function(isoDateString) {
    const date = new Date(isoDateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

const addOrderDateTimeAddress = function(orderDetailsElement, order) {
    const dateParagraph = document.createElement('p');
    dateParagraph.innerHTML = `<strong>Date:</strong> ${formatDate(order.date)}`;
    orderDetailsElement.appendChild(dateParagraph);

    const timeParagraph = document.createElement('p');
    timeParagraph.innerHTML = `<strong>Time:</strong> ${formatTime(order.date)}`;
    orderDetailsElement.appendChild(timeParagraph);

    const addressParagraph = document.createElement('p');
    addressParagraph.innerHTML = `<strong>Address:</strong> ${order.address}`;
    orderDetailsElement.appendChild(addressParagraph);
}

export { formatDate, formatTime, addOrderDateTimeAddress };