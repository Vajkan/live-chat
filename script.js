const drone = new ScaleDrone('s2Pq19QZSj2eorLc');
const roomName = 'observable-room';
const userColor = '#ffffff';

let currentUser;

function onOpen() {
  console.log('Connected to Scaledrone');
  const room = drone.subscribe(roomName);
  let nickname = '';
  while (!nickname.trim()) {
    nickname = prompt('Please enter your nickname:');
  }
  currentUser = nickname;
  room.on('open', onRoomOpen);
  room.on('data', onRoomData);
}

function onRoomOpen(error) {
  if (error) {
    console.error(error);
    return;
  }
  console.log('Joined room');
}

function onRoomData(message, client) {
  console.log(message);

  const chatMessages = document.querySelector('.chat-messages');
  const messageElement = document.createElement('div');

  messageElement.classList.add('message');

  const authorElement = document.createElement('p');

  authorElement.classList.add('author');

  if (client.id === drone.clientId) {
    messageElement.classList.add('me');
    authorElement.textContent = currentUser;
    authorElement.style.color = userColor;
  } 
  else {
    messageElement.classList.add('other');
    if (message.clientData) {
      authorElement.textContent = message.clientData.username;
      authorElement.style.color = message.clientData.color;
    } 
  }

  const messageContentElement = document.createElement('p');

  messageContentElement.textContent = message.data;

  messageElement.appendChild(authorElement);
  messageElement.appendChild(messageContentElement);
  chatMessages.appendChild(messageElement);
  
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

const chatForm = document.querySelector('.chat-form');
const chatInput = chatForm.querySelector('input[type="text"]');

function sendMessage() {
  const message = chatInput.value;

  if (message.trim() === '') {
    return;
  }
  drone.publish({
    room: roomName,
    message: {
      data: message,
      clientData: {
        username: currentUser,
        color: userColor,
      },
    },
  });

  chatInput.value = '';
}

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  sendMessage();
});

drone.on('open', onOpen);