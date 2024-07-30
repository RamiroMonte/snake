const socket = io({ query: { userId } });
let canvas, ctx, player = {}, foods = [];
let players = {};
let boost = false;

document.addEventListener('DOMContentLoaded', () => {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  resizeCanvas();

  socket.emit('get_balance', userId);

  socket.on('balance', (balance) => {
    score = balance;
    document.getElementById('currentBalance').innerText = `R$ ${balance.toFixed(2)}`;
  });

  document.getElementById('startGame').addEventListener('click', () => {
    const betAmount = parseFloat(document.getElementById('betAmount').value);
    if (betAmount > 0) {
      localStorage.setItem('betAmount', betAmount);
      document.getElementById('gameContainer').style.display = 'none';
      player.x = canvas.width / 2;
      player.y = canvas.height / 2;
      loop();
    } else {
      alert('Por favor, defina um valor de aposta maior que 0.');
    }
  });

  window.addEventListener('resize', resizeCanvas);

  document.onmousemove = (evt) => {
    const rect = canvas.getBoundingClientRect();
    player.x = evt.clientX - rect.left;
    player.y = evt.clientY - rect.top;
  };

  document.onmousedown = () => {
    boost = true;
  };

  document.onmouseup = () => {
    boost = false;
  };

  socket.on('update_foods', (serverFoods) => {
    foods = serverFoods;
  });

  socket.on('update_players', (serverPlayers) => {
    players = serverPlayers;
  });

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawHoneycombBackground(ctx, canvas.width, canvas.height);

  foods.forEach(food => {
    ctx.fillStyle = food.isLarge ? 'gold' : 'green';
    ctx.beginPath();
    ctx.arc(food.x, food.y, food.isLarge ? 10 : 5, 0, Math.PI * 2);
    ctx.fill();
  });

  Object.values(players).forEach(player => {
    player.snake.draw(ctx);
  });

  requestAnimationFrame(loop);
}
