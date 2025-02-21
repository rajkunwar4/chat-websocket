const socket = io();

const totalClients = document.getElementById("clients-total");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("message-form");
const nameInput = document.getElementById("name-input");
const messageInput = document.getElementById("message-input");
const feedback = document.getElementById("feedback");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

messageInput.addEventListener("keypress", (e) => {
  onType();
});

socket.on("clients-total", (data) => {
  //settings the total people on the group chat no
  totalClients.innerText = `Clients total ${data}`;
});

//receive message logic
socket.on("receive-message", (data) => {
  // new list item for message thread
  const newMessage = document.createElement("li");
  newMessage.classList.add("message-left");

  // text goes in p tag
  const newText = document.createElement("p");
  // timestamp and credentials
  const newTimestamp = document.createElement("span");
  newText.innerText = data.message;
  newText.classList.add("message");
  newTimestamp.innerText = `${data.name} ${data.dateTime.split("GMT")[0]}`;
  newTimestamp.classList.add("time-stamp");
  newMessage.appendChild(newText);
  newMessage.appendChild(newTimestamp);
  messageContainer.appendChild(newMessage);
  scrollToBottom()
});

//handle message sent
function sendMessage() {
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date().toString(),
  };

  //parent message
  const newMessage = document.createElement("li");
  newMessage.classList.add("message-right");
  //text value
  const newText = document.createElement("p");
  newText.innerText = data.message;
  newText.classList.add("message");
  //timestamp span
  const newTimestamp = document.createElement("span");
  newTimestamp.innerText = `${data.name} ${data.dateTime.split("GMT")[0]}`;
  newTimestamp.classList.add("time-stamp");

  newMessage.appendChild(newText);
  newMessage.appendChild(newTimestamp);

  messageContainer.appendChild(newMessage);

  scrollToBottom()

  socket.emit("send-message", data);
}

socket.on("typing", (data) => {
  clearFeedback();

  const element = `
        <li class="message-feedback">
          <p class="feedback" id="feedback">${data.name}</p>
        </li>
  `;
  messageContainer.innerHTML += element;
});

function onType() {
  const data = {
    name: nameInput.value,
  };

  socket.emit("typing", data);
}

function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
  }
