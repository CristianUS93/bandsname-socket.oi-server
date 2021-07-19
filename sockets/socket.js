const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Metalica'));
bands.addBand(new Band('Queen'));
bands.addBand(new Band('Mana'));
bands.addBand(new Band('BonJovi'));


// Mensajes de sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBand());

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje',( payload ) => {
        console.log('Mensaje:', payload);
        io.emit('mensaje', {admin: 'Nuevo mensaje'});
    });

    client.on('emitir-mensaje', (payload) => {
        console.log('Mensaje', payload);
        client.broadcast.emit('emitir-mensaje', payload);
    });

    client.on('vote-band', (payload) => {
        bands.voteBands(payload.id);
        io.emit('active-bands', bands.getBand());
    });

    client.on('add-band', (payload) => {
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBand());
    });

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBand());
    });

});