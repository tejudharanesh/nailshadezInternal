import React, { useEffect, useState } from "react";
import axios from "axios";

type BookingStatus = "pending" | "completed";

type Booking = {
  _id: string;
  name: string;
  mobile: string;
  email: string;
  service: string;
  date: string;
  time: string;
  createdAt: string;
  status: BookingStatus;
};

const Hero: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterStatus, setFilterStatus] = useState<BookingStatus | "all">(
    "pending"
  );

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/bookings");
        setBookings(res.data.bookings);
      } catch (error) {
        console.error("Error fetching bookings", error);
      }
    };

    fetchBookings();
  }, []);

  const updateStatus = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${bookingId}`, {
        status: newStatus,
      });
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const renderStatusButton = (booking: Booking) => {
    const isPending = booking.status === "pending";
    return (
      <button
        onClick={() =>
          updateStatus(booking._id, isPending ? "completed" : "pending")
        }
        className={`px-3 py-1 rounded ${
          isPending
            ? "bg-yellow-500 text-white hover:bg-yellow-600"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        {isPending ? "Mark Completed" : "Mark Pending"}
      </button>
    );
  };

  // Filter bookings based on selected status
  const filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === filterStatus);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Bookings Dashboard</h2>

      {/* Filter Buttons */}
      <div className="mb-4 flex gap-3">
        <button
          onClick={() => setFilterStatus("pending")}
          className={`px-4 py-2 rounded ${
            filterStatus === "pending"
              ? "bg-yellow-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilterStatus("completed")}
          className={`px-4 py-2 rounded ${
            filterStatus === "completed"
              ? "bg-green-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-4 py-2 rounded ${
            filterStatus === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          All
        </button>
      </div>

      {/* Desktop/Table View */}
      <div className="hidden md:block">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-2 border">Name</th>
              <th className="py-3 px-2 border">Mobile</th>
              <th className="py-3 px-2 border">Email</th>
              <th className="py-3 px-2 border">Service</th>
              <th className="py-3 px-2 border">Date</th>
              <th className="py-3 px-2 border">Time</th>
              <th className="py-3 px-2 border">Booked At</th>
              <th className="py-3 px-2 border">Status</th>
              <th className="py-3 px-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking._id} className="text-center border-t">
                <td className="py-2 px-2 border">{booking.name}</td>
                <td className="py-2 px-2 border">{booking.mobile}</td>
                <td className="py-2 px-2 border">{booking.email}</td>
                <td className="py-2 px-2 border">{booking.service}</td>
                <td className="py-2 px-2 border">
                  {new Date(booking.date).toLocaleDateString("en-GB")}
                </td>
                <td className="py-2 px-2 border">
                  {new Date(`1970-01-01T${booking.time}`).toLocaleTimeString(
                    "en-US",
                    { hour: "2-digit", minute: "2-digit", hour12: true }
                  )}
                </td>
                <td className="py-2 px-2 border">
                  {new Date(booking.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </td>
                <td className="py-2 px-2 border capitalize">
                  {booking.status}
                </td>
                <td className="py-2 px-2 border">
                  {renderStatusButton(booking)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Card View */}
      <div className="block md:hidden space-y-4">
        {filteredBookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white rounded shadow p-4 border flex flex-col space-y-1"
          >
            <div>
              <span className="font-bold">Name: </span>
              {booking.name}
            </div>
            <div>
              <span className="font-bold">Mobile: </span>
              {booking.mobile}
            </div>
            <div>
              <span className="font-bold">Email: </span>
              {booking.email}
            </div>
            <div>
              <span className="font-bold">Service: </span>
              {booking.service}
            </div>
            <div>
              <span className="font-bold">Date: </span>
              {new Date(booking.date).toLocaleDateString("en-GB")}
            </div>
            <div>
              <span className="font-bold">Time: </span>
              {new Date(`1970-01-01T${booking.time}`).toLocaleTimeString(
                "en-US",
                { hour: "2-digit", minute: "2-digit", hour12: true }
              )}
            </div>
            <div>
              <span className="font-bold">Booked At: </span>
              {new Date(booking.createdAt).toLocaleString("en-GB")}
            </div>
            <div>
              <span className="font-bold">Status: </span>
              <span className="capitalize">{booking.status}</span>
            </div>
            <div>{renderStatusButton(booking)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
