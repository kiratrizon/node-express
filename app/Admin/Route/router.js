const express = require('express');
const router = express.Router();
const routerGuest = express.Router();
const fs = require('fs');
const path = require('path');

const controllersPath = path.join(__dirname, '..', 'Controller');

fs.readdir(controllersPath, (err, files) => {
    if (err) {
        console.error('Error reading controllers directory:', err);
        return;
    }

    files.filter(file => file.endsWith('.js')).forEach((file) => {
        const controllerPath = path.join(controllersPath, file);

        const controller = require(controllerPath);

        const routePath = `/${path.parse(file).name}`;

        router.use(routePath, controller);
    });
});

const controllersPathGuest = path.join(__dirname, '..', 'GuestController');

fs.readdir(controllersPathGuest, (err, files) => {
    if (err) {
        console.error('Error reading controllers directory:', err);
        return;
    }

    files.filter(file => file.endsWith('.js')).forEach((file) => {
        const controllerPath = path.join(controllersPathGuest, file);

        const controller = require(controllerPath);

        const routePath = `/${path.parse(file).name}`;

        routerGuest.use(routePath, controller);
    });
});

module.exports = [router, routerGuest];
