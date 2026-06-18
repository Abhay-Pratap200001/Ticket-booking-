// picks a banner image, icon color and icon type for an event card based on its name
// this is purely visual since the backend does not store images or categories
export const getEventTheme = (eventName, eventId) => {
  const lowerName = eventName.toLowerCase();

  if (lowerName.includes("comedy") || lowerName.includes("stand-up")) {
    return {
      icon: "mic",
      colorClass: "bg-purple-500",
      image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400&h=200&fit=crop",
    };
  }

  if (lowerName.includes("concert") || lowerName.includes("live")) {
    return {
      icon: "music",
      colorClass: "bg-blue-500",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=200&fit=crop",
    };
  }

  if (lowerName.includes("conference") || lowerName.includes("tech")) {
    return {
      icon: "mic",
      colorClass: "bg-teal-500",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
    };
  }

  // fallback theme for any other event name
  return {
    icon: "calendar",
    colorClass: "bg-indigo-500",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=200&fit=crop",
  };
};
