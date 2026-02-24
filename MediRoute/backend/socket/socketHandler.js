module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Hospital joins their room
    socket.on('join-hospital', (hospitalId) => {
      socket.join(`hospital-${hospitalId}`);
      console.log(`Hospital ${hospitalId} joined`);
    });
    
    // Hospital updates features
    socket.on('update-features', (data) => {
      console.log('Features updated:', data.hospitalId);
      // Broadcast to all ambulances
      io.emit('hospital-updated', data);
    });
    
    // New booking created
    socket.on('new-booking', (data) => {
      console.log('New booking:', data.hospitalId);
      // Notify specific hospital
      io.to(`hospital-${data.hospitalId}`).emit('incoming-booking', data);
    });
    
    // Booking status updated
    socket.on('booking-status-changed', (data) => {
      console.log('Booking status changed:', data);
      // Notify all ambulances
      io.emit('booking-update', data);
    });
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};