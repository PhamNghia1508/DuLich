export interface GuideAvailability {
  date: string;
  bookedSlots: string[];
  pendingSlots: string[];
}

export function getGuideAvailability(guideId: string, dateStr: string): GuideAvailability {
  // Simple deterministic hash function based on guide ID and selected date
  let hash = 0;
  const key = `${guideId}-${dateStr}`;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  const allSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];
  
  const bookedSlots: string[] = [];
  const pendingSlots: string[] = [];
  
  allSlots.forEach((slot, index) => {
    // Generate deterministic status using bits of the hash
    const val = Math.abs((hash >> (index % 16)) & 7);
    if (val === 1 || val === 2) {
      bookedSlots.push(slot);
    } else if (val === 3) {
      pendingSlots.push(slot);
    }
  });
  
  // Make sure not ALL slots are booked, leave at least some free slots
  if (bookedSlots.length + pendingSlots.length === allSlots.length) {
    bookedSlots.pop();
    pendingSlots.pop();
  }
  
  return {
    date: dateStr,
    bookedSlots,
    pendingSlots
  };
}
