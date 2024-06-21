const express = require("express");
const app = express();

app.use(express.json())

const rooms = [];
const room_bookings = [];

// function generateBookingID() {

// }
// function generateBookingId(){
//     return room_bookings.length+1;
//   }

// Route for listing all rooms
app.get("/rooms", (req, res) => {
    res.json(rooms);
});

// Route for creating room
app.post("/create-room", (req, res) => {

    const { roomNumber, seatsAvailable, amenities, pricePerHour } = req.body;
    //validateing input
    if (!roomNumber || !seatsAvailable || !pricePerHour || !amenities) {
        res.status(400).json({ message: "Room Number,Seats Available,Price per Hours,Amenities are required" })
    }

    //checking if the room number already exits
    const isRoomexists = rooms.some((room) => room.roomNumber === roomNumber);

    if (isRoomexists) {
        res.status(400).json({ message: "Room Number is already exists" })
    }
    rooms.push({roomNumber, seatsAvailable, amenities, pricePerHour});
    res.json({ message: "Room is Created" })
})

//Route for book rooms
app.post("/book-room", (req, res) => {

    const { customerName, date, startTime, endTime, roomId } = req.body;
    //validateing input
    if (!customerName || !date || !startTime || !endTime || !roomId) {
        res.status(400).json({ message: "customerName,date,startTime,endTime,roomId are required" })
    }
    const room = rooms.find((room) => room.roomNumber === roomId);
    if (room) {
        res.status(404).json({ message: "Room not found" })
    }
    //checking if the room is available for booking
    const isRoomAvailable = true;

    if (!isRoomAvailable) {
        res.status(405).json({ message: 'Room is not available for specified time and date' });
    }

    const bookingID = room_bookings.length + 1;
    room_bookings.push({
        bookingID,
        roomId, 
        customerName,
        date, 
        startTime, 
        endTime, 
        bookingDate: new Date(),//Timestamp of the booking
        bookingStatus: "Confirmed"
    })
    res.json({ message: "Successfully Room is Booked" })
});

//Route for list all rooms booked
app.get("/roomsBooked", (req,res) => {

    const roomsBooked = rooms.map((room)=>{
        const roomBook = room_bookings.filter((roomBooking)=>roomBooking.roomId === room.roomNumber);
        return {
            roomName:room.roomNumber,
            room_bookings:roomBook.map((roomBooking)=>({
                CustomerName:roomBooking.customerName,
                Date:roomBooking.date,
                StartTime:roomBooking.startTime,
                EndTime:roomBooking.endTime,
                BookingStatus:roomBooking.bookingStatus
            }))
        }
    })
    res.json(roomsBooked);
})

//Route for list all customers bookings
app.get('/customersBookings',(req,res)=>{
    const customersBookings= room_bookings.map((roomBooking)=>({
        CustomerName:roomBooking.customerName,
        RoomId:roomBooking.roomId,
        Date:roomBooking.date,
        StartTime:roomBooking.startTime,
        EndTime:roomBooking.endTime,
        BookingStatus:roomBooking.bookingStatus
    }));
    res.json(customersBookings)
});

//Route for list how many times a customer has booked a room with details
app.get('/customerBookingHistory/:customerName',(req,res)=>{
    const customerName = req.params.customerName;
    const customerBookingHistory = room_bookings.filter((roomBooking)=>roomBooking.customerName === customerName);
    res.json(customerBookingHistory);
})

app.listen(3002);
