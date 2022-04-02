const usersList = document.getElementById("users-list");
const textInput = document.getElementById("text-input");
const chatForm = document.getElementById("chat-form");

const redirectToLogin = () => {
  window.location = "/";
};

const renderMessage = (socketId, data) => {
  const div = document.createElement("div");
  let className;
  let html;
  if (data.id) {
    if (socketId === data.id) {
      className = "my-messages-container";
      html = `<div class="my-messages">
        <span><b>Yo</b> ${data.time}</span><br />
        <span>${data.text}</spam>
      </div>`;
    } else {
      className = "other-messages-container";
      html = `<div class="other-messages">
        <span><b>${data.username}</b> ${data.time}</span><br />
        <span>${data.text}</spam>
      </div>`;
    }
  } else {
    className = "bot-messages";
    html = `<b>${data.username} dice: </b><i>${data.text}</i>`;
  }

  div.classList.add(className);
  div.innerHTML = html;
  document.getElementById("messages").appendChild(div);
};

const socket = io("http://localhost:8080");

// Join chat
const { username } = Qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});
socket.emit("join.chat", { username });

socket.on("chat-message", (data) => {
  renderMessage(socket.id, data);
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = textInput.value;
  socket.emit("new-message", msg);
  textInput.value = "";
});
