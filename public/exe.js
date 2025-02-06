function main() {
  const app = document.querySelector(".app");
  const socket = io();
  let uname;
  const joinChat = () => {
    console.log("success");
    console.log(socket);
    let username = app.querySelector(".join-screen #username").value;
    const usernames = ["divyadharshan", "krishnapriya"];
    if (username.length == 0 || !(usernames.includes(username))) {
      alert("Enter valid username!!!");
      return;
    }
    socket.emit("newuser", username);
    uname = username;
    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");
  };

  app.querySelector(".join-screen #join-user").addEventListener("click", joinChat);
  app.querySelector(".join-screen #username").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      joinChat();
    }
  });
  const sendMessage = () => {
    let message = app.querySelector(".chat-screen #message-input").value;
    if (message.length == 0) {
      alert("Type a message to send!!!");
      return;
    }
    const time = getCurrentTime(); 
    renderMessage("my", {
      username: uname,
      text: message,
      time: time
    });
    socket.emit("chat", {
      username: uname,
      text: message,
      time: time
    });
    app.querySelector(".chat-screen #message-input").value = "";
  };

  app.querySelector(".chat-screen #send-message").addEventListener("click", sendMessage);
  app.querySelector(".chat-screen #message-input").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {                                              
      sendMessage();                       
    }
  });                                                                                                                                                                                                                                 

  app.querySelector(".chat-screen #exit-chat").addEventListener("click", function () {
    socket.emit("exituser", uname);
    window.location.href = window.location.href;
  });
  socket.on("update", function (update) {
    renderMessage("update", update);
  });
  socket.on("chat", function (message) {
    renderMessage("other", message);
  });
  function renderMessage(type, message) {
    let messageContainer = app.querySelector(".chat-screen .messages");
    let el = document.createElement("div");

    if (type == "my") {
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
        <div>
          <div class="name">You</div>
          <div class="text">${message.text}</div>
          <div class="time">${message.time}</div>
        </div>
      `;
    } else if (type == "other") {
      el.setAttribute("class", "message other-message");
      el.innerHTML = `
        <div>
          <div class="name">${message.username}</div>
          <div class="text">${message.text}</div>
          <div class="time">${message.time}</div>
        </div>
      `;
    } else if (type == "update") {
      el.setAttribute("class", "update");
      el.innerHTML = `
        <div>
          <div>${message}</div>
        </div>
      `;
    }

    messageContainer.appendChild(el);
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
  }

  function getCurrentTime() {
    const t = new Date();
    let h = t.getHours();
    let m = t.getMinutes();
    if(m<10){
        m="0"+m;
    }
    return h+ ":" + m;
  }
}

main();
