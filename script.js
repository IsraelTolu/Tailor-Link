// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Clear filters and search
const clearBtn = document.querySelector('.clear-btn');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    document.querySelectorAll('.filters select').forEach(select => select.selectedIndex = 0);
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) searchInput.value = '';
  });
}

// Chatbox toggle
const chatBtn = document.getElementById('chatBtn');
const chatBox = document.getElementById('chatBox');
const closeChat = document.getElementById('closeChat');
const sendMsg = document.getElementById('sendMsg');
const chatInput = document.getElementById('chatInput');
const chatBody = document.querySelector('.chat-body');

if (chatBtn) {
  chatBtn.addEventListener('click', () => {
    chatBox.style.display = 'flex';
  });
}

if (closeChat) {
  closeChat.addEventListener('click', () => {
    chatBox.style.display = 'none';
  });
}

if (sendMsg) {
  sendMsg.addEventListener('click', () => {
    const msg = chatInput.value.trim();
    if (msg !== '') {
      const msgEl = document.createElement('p');
      msgEl.classList.add('message', 'sent');
      msgEl.textContent = msg;
      chatBody.appendChild(msgEl);
      chatInput.value = '';
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  });
}
