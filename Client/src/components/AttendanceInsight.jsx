import React, { useEffect, useState, useContext, useRef } from "react";
import { EventContext } from "../App";
import { BrowserMultiFormatReader } from "@zxing/browser";
import api from "./Api";
function AttendanceInsight() {
  const { token, user } = useContext(EventContext);
  const [eventsData, setEventsData] = useState([]);
  const [expandedEvents, setExpandedEvents] = useState({});
  const [toast, setToast] = useState("");
  const [scanning, setScanning] = useState(false);

  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  
  useEffect(() => {
    api
      .get(`/admin/my-events-tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEventsData(res.data.data))
      .catch((e) => console.log(e));
  }, [token]);

  
  const toggleEvent = (eventId) => {
    setExpandedEvents((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  
  const handleCheckIn = async (ticketId) => {
    const ticket = eventsData
      .flatMap((ev) => ev.tickets)
      .find((t) => t._id === ticketId);

    if (ticket?.checkedIn) {
      setToast("Ticket already checked in");
      setTimeout(() => setToast(""), 3000);
      return;
    }

    try {
      await api.patch(
        `/admin/ticket/checkin/${ticketId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEventsData((prev) =>
        prev.map((ev) => ({
          ...ev,
          tickets: ev.tickets.map((t) =>
            t._id === ticketId
              ? { ...t, checkedIn: true, checkedInTime: new Date() }
              : t
          ),
        }))
      );

      setToast("Checked in successfully!");
      setTimeout(() => setToast(""), 3000);
    } catch (e) {
      console.error(e);
      setToast(e.response?.data?.message || "Check-in failed");
      setTimeout(() => setToast(""), 3000);
    }
  };

  
  const startScanning = async () => {
    setScanning(true);
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    try {
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      const deviceId = devices[0]?.deviceId;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: deviceId ? { exact: deviceId } : undefined },
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      
      codeReader
        .decodeOnceFromVideoDevice(deviceId, videoRef.current)
        .then((result) => {
          const ticketId = result.getText();
          handleCheckIn(ticketId);
          stopScanning();
        })
        .catch((err) => {
          if (err.name !== "NotFoundException") console.error(err);
          stopScanning();
        });
    } catch (err) {
      console.error(err);
      setToast("Cannot access camera");
      setTimeout(() => setToast(""), 3000);
      setScanning(false);
    }
  };

  
  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    codeReaderRef.current = null;
    setScanning(false);
  };

  return (
    <>
      <header className="bg-[#111111] rounded-xl h-25 m-5 gap-3 flex sm:justify-between px-4 flex-wrap sm:flex-row flex-col items-center justify-center">
        <div>
          <p className="text-white font-semibold md:text-lg sm:text-base sm:text-start text-sm w-90 leading-4 text-center">
            Welcome {user.fname} {user.lname}
            <span className="font-normal block text-sm">{user.username}</span>
          </p>
        </div>
        <h1 className="text-white mr-20 sm:text-base md:text-lg lg:text-xl text-sm text-center">
          Attendee Insights
        </h1>
      </header>

      {toast && (
        <div className="fixed top-5 right-5 bg-green-500 text-white p-3 rounded shadow-lg z-50">
          {toast}
        </div>
      )}

      
      <div className="p-5 flex justify-center flex-col">
        <button
          onClick={() => (scanning ? stopScanning() : startScanning())}
          className="bg-blue-500 text-white px-4 py-2  rounded mb-5 "
        >
          {scanning ? "Stop Scanning" : "Scan QR Code"}
        </button>

        {scanning && (
          <div className="w-full max-w-md mx-auto mb-5">
            <video ref={videoRef} style={{ width: "100%" }} muted playsInline />
          </div>
        )}
      </div>

      <div className="p-5 space-y-10">
        {eventsData.map(({ event, tickets }) => (
          <div key={event._id} className="border p-4 rounded-lg">
            <h2
              className="text-xl font-bold mb-3 cursor-pointer select-none"
              onClick={() => toggleEvent(event._id)}
            >
              {event.title} {expandedEvents[event._id] ? "▲" : "▼"}
            </h2>

            {expandedEvents[event._id] && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border min-w-[600px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-3 py-2">User</th>
                      <th className="border px-3 py-2">Seat</th>
                      <th className="border px-3 py-2">QR Code & Check-in</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket._id}>
                        <td className="border px-3 py-2 text-center">
                          {ticket.user.fname} {ticket.user.lname}
                        </td>
                        <td className="border px-3 py-2 text-center">
                          {ticket.seatNumber}
                        </td>
                        <td className="border px-3 py-2 text-center">
                          <img
                            src={ticket.ticketQR}
                            alt="QR Code"
                            className="w-20 h-20 m-auto mb-2"
                          />
                          {!ticket.checkedIn && (
                            <button
                              onClick={() => handleCheckIn(ticket._id)}
                              className="bg-green-500 text-white px-3 py-1 rounded block mx-auto mb-1"
                            >
                              Check In
                            </button>
                          )}
                          <span className="block text-sm">
                            {ticket.checkedIn ? "Checked In" : "Not Checked In"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default AttendanceInsight;
