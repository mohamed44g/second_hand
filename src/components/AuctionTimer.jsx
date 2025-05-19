import React from "react";
import {
  format,
  differenceInHours,
  differenceInMinutes,
  parseISO,
} from "date-fns";
import { ar } from "date-fns/locale"; // Arabic locale

const AuctionTimer = ({ auctionEndTime }) => {
  // Parse auction_end_time as UTC
  const endTime = parseISO(auctionEndTime); // e.g., "2025-05-13T21:00:00.000Z"
  const now = new Date();

  // Calculate time difference
  const hoursLeft = differenceInHours(endTime, now);
  const minutesLeft = differenceInMinutes(endTime, now) % 60;

  // Format the end time in local timezone (EEST) with Arabic locale
  const formattedEndTime = format(endTime, "d MMMM yyyy, h:mm a", {
    locale: ar,
  });

  return (
    <div>
      <p>
        ينتهي في: {hoursLeft} ساعة و {minutesLeft} دقيقة
      </p>
      <p>ينتهي يوم: {formattedEndTime}</p>
    </div>
  );
};

export default AuctionTimer;
