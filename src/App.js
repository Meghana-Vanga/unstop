import React, { useState, useEffect } from 'react';

const TOTAL_SEATS = 80;
const SEATS_PER_ROW = 8;

const TrainSeatReservation = () => {
  const [seats, setSeats] = useState([]);
  const [numSeats, setNumSeats] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState('');
  const [availableSeats, setAvailableSeats] = useState(TOTAL_SEATS);

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = () => {
    setIsLoading(true);
    setResult('');
    setTimeout(() => {
      const mockSeats = Array.from({ length: TOTAL_SEATS }, (_, index) => ({
        seatNumber: index + 1,
        isBooked: Math.random() < 0.3,
        isSelected: false,
      }));
      setSeats(mockSeats);
      setAvailableSeats(mockSeats.filter(seat => !seat.isBooked).length);
      setIsLoading(false);
    }, 1000);
  };

  const toggleSeatSelection = (seatNumber) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.seatNumber === seatNumber
          ? { ...seat, isSelected: !seat.isSelected }
          : seat
      )
    );

    setSelectedSeats((prevSelectedSeats) => {
      const seatIndex = prevSelectedSeats.indexOf(seatNumber);
      return seatIndex === -1
        ? [...prevSelectedSeats, seatNumber]
        : prevSelectedSeats.filter((_, index) => index !== seatIndex);
    });
  };

  const bookSeats = () => {
    if (isNaN(numSeats) || numSeats < 1 || numSeats > SEATS_PER_ROW) {
      setResult('Please enter a valid number of seats (1-7)');
      return;
    }

    const availableSeatsCount = seats.filter(seat => !seat.isBooked && !seat.isSelected).length;
    if (availableSeatsCount < numSeats) {
      setResult('Not enough available seats.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const availableSeats = seats
        .filter((seat) => !seat.isBooked && !seat.isSelected)
        .slice(0, numSeats);
      const bookedSeats = availableSeats.map((seat) => seat.seatNumber);

      setSeats((prevSeats) =>
        prevSeats.map((seat) =>
          bookedSeats.includes(seat.seatNumber)
            ? { ...seat, isBooked: true, isSelected: false }
            : seat
        )
      );

      setSelectedSeats([]);
      setAvailableSeats(prev => prev - numSeats);
      setResult(`Successfully booked seats: ${bookedSeats.join(', ')}`);
      setIsLoading(false);
    }, 1000);
  };

  const resetSeats = () => {
    fetchSeats();
    setResult('');
    setSelectedSeats([]);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Train Seat Reservation</h1>
      <p style={styles.availableText}>Available Seats: {availableSeats}</p>
      <div style={styles.inputGroup}>
        <input
          type="number"
          min="1"
          max="7"
          value={numSeats}
          onChange={(e) => setNumSeats(parseInt(e.target.value))}
          style={styles.input}
        />
        <button
          onClick={bookSeats}
          disabled={isLoading || availableSeats < numSeats}
          style={{
            ...styles.button,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading || availableSeats < numSeats ? 0.7 : 1,
          }}
        >
          {isLoading ? 'Processing...' : `Book ${numSeats} Seat(s)`}
        </button>
        <button onClick={resetSeats} style={styles.resetButton}>
          Reset
        </button>
      </div>
      {result && <div style={styles.result}>{result}</div>}
      {isLoading ? (
        <div style={styles.loading}>Loading seats...</div>
      ) : (
        <div style={styles.seatGrid(SEATS_PER_ROW)}>
          {seats.map((seat) => (
            <div
              key={seat.seatNumber}
              onClick={() => !seat.isBooked && toggleSeatSelection(seat.seatNumber)}
              style={{
                ...styles.seat,
                backgroundColor: seat.isBooked
                  ? '#FF6B6B'
                  : seat.isSelected
                  ? '#3490dc'
                  : '#4CAF50',
                cursor: seat.isBooked ? 'not-allowed' : 'pointer',
              }}
            >
              {seat.seatNumber}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
  },
  heading: {
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#444',
    marginBottom: '16px',
  },
  availableText: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '16px',
  },
  inputGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '60px',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1E90FF',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#FFA07A',
    color: '#fff',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  result: {
    backgroundColor: '#d1f7c4',
    border: '1px solid #8bc34a',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '16px',
    textAlign: 'center',
    color: '#4CAF50',
  },
  seatGrid: (columns) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: '10px',
  }),
  seat: {
    width: '45px',
    height: '45px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    color: '#888',
  },
};

export default TrainSeatReservation;
