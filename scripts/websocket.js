const express = require('express');
const { createServer } = require('node:http');
const { faker } = require('@faker-js/faker');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected`);
});

const scheduleCb = (cb) => {
  const ms = faker.number.int({ min: 1, max: 60 });

  console.log(`Next occurrence in ${ms}s`);
  setTimeout(cb, ms * 1000);
};

const occurence = () => {
  const monster = {
    monsterName: faker.person.fullName(),
    dangerLevel: faker.helpers.arrayElement(['God', 'Dragon', 'Tiger', 'Wolf']),
    location: {
      lat: faker.location.latitude(),
      lng: faker.location.longitude(),
    },
  };
  io.emit('occurrence', monster);
  console.log('occurrence', monster);

  scheduleCb(occurence);
};

server.listen(3000, () => {
  scheduleCb(occurence);
});
