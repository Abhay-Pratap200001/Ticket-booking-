import { useEffect, useState } from "react";

// counts down from the reservation expiry time and calls onExpire once it hits zero
const CountdownTimer = ({ expiresAt, onExpire }) => {
  const [secondsLeft, setSecondsLeft] = useState(getSecondsRemaining(expiresAt));

  // calculates how many seconds are left until the given expiry time
  function getSecondsRemaining(expiryTime) {
    const remaining = Math.floor((new Date(expiryTime).getTime() - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      const remaining = getSecondsRemaining(expiresAt);
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        clearInterval(intervalId);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [expiresAt]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <p className="text-sm font-medium text-red-600">
      Time left to confirm: {minutes}:{seconds.toString().padStart(2, "0")}
    </p>
  );
};

export default CountdownTimer;
