import {
  reactExtension,
  BlockStack,
  Text,
  Select,
  DatePicker,
  useApplyAttributeChange,
  useExtensionCapability,
  useBuyerJourneyIntercept,
} from "@shopify/ui-extensions-react/checkout";
import { useState, useCallback } from "react";

// Extension target - appears in the delivery section
export default reactExtension("purchase.checkout.delivery-address.render-after", () => (
  <PickupDateTime />
));

function PickupDateTime() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [error, setError] = useState("");
  
  const applyAttributeChange = useApplyAttributeChange();
  const canBlockProgress = useExtensionCapability("block_progress");

  // Generate time slots (10:00 AM - 8:00 PM, 30-minute intervals)
  const timeSlots = [];
  for (let hour = 10; hour < 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const startHour = hour > 12 ? hour - 12 : hour;
      const endHour = (minute + 30 >= 60 ? hour + 1 : hour) > 12 
        ? (minute + 30 >= 60 ? hour + 1 : hour) - 12 
        : (minute + 30 >= 60 ? hour + 1 : hour);
      const startPeriod = hour >= 12 ? "PM" : "AM";
      const endPeriod = (minute + 30 >= 60 ? hour + 1 : hour) >= 12 ? "PM" : "AM";
      const startMin = minute.toString().padStart(2, "0");
      const endMin = ((minute + 30) % 60).toString().padStart(2, "0");
      
      const label = `${startHour}:${startMin} ${startPeriod} - ${endHour}:${endMin} ${endPeriod}`;
      const value = `${hour.toString().padStart(2, "0")}:${startMin}`;
      
      timeSlots.push({ label, value });
    }
  }

  // Get available dates (next 7 days, excluding today if past cutoff)
  const getAvailableDates = () => {
    const dates = [];
    const now = new Date();
    const cutoffHour = 18; // 6:30 PM cutoff
    const cutoffMinute = 30;
    
    let startOffset = 1; // Start from tomorrow by default
    if (now.getHours() < cutoffHour || 
        (now.getHours() === cutoffHour && now.getMinutes() < cutoffMinute)) {
      startOffset = 0; // Can order for today if before cutoff
    }
    
    for (let i = startOffset; i < startOffset + 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }
    
    return dates;
  };

  const handleDateChange = useCallback(async (value) => {
    setSelectedDate(value);
    setError("");
    
    await applyAttributeChange({
      type: "updateAttribute",
      key: "Pickup Date",
      value: value,
    });
  }, [applyAttributeChange]);

  const handleTimeChange = useCallback(async (value) => {
    setSelectedTime(value);
    setError("");
    
    const selectedSlot = timeSlots.find(slot => slot.value === value);
    await applyAttributeChange({
      type: "updateAttribute",
      key: "Pickup Time",
      value: selectedSlot?.label || value,
    });
  }, [applyAttributeChange, timeSlots]);

  // Block checkout if date/time not selected
  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    if (canBlockProgress && (!selectedDate || !selectedTime)) {
      return {
        behavior: "block",
        reason: "Please select a pickup date and time",
        errors: [
          {
            message: "Please select a pickup date and time to continue",
          },
        ],
      };
    }
    return { behavior: "allow" };
  });

  return (
    <BlockStack spacing="base">
      <Text size="large" emphasis="bold">
        Pickup Date & Time
      </Text>
      
      <Select
        label="Select Pickup Date"
        value={selectedDate}
        onChange={handleDateChange}
        options={[
          { label: "Select a date...", value: "" },
          ...getAvailableDates().map(date => {
            const dateObj = new Date(date + "T00:00:00");
            const label = dateObj.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            });
            return { label, value: date };
          }),
        ]}
      />
      
      <Select
        label="Select Pickup Time"
        value={selectedTime}
        onChange={handleTimeChange}
        options={[
          { label: "Select a time...", value: "" },
          ...timeSlots,
        ]}
      />
      
      {error && (
        <Text appearance="critical">{error}</Text>
      )}
    </BlockStack>
  );
}



