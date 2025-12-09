if (typeof DateTimeSlotPicker !== 'function') {

	class DateTimeSlotPicker extends HTMLElement {

		constructor() {
			super();
			this.init();
		}

		init() {
			this.dateInput = this.querySelector('input[type="date"]');
			this.timeSelect = this.querySelector('select[id$="-time"]');
			this.isPlatter = this.dataset.isPlatter === 'true';
			
			// Lead days: platter = 3 days ahead, other items = 0 (same day + tomorrow)
			this.leadDays = this.isPlatter ? 3 : 0;
			
			// Cutoff time: 6:30 PM (18:30)
			this.cutoffHour = 18;
			this.cutoffMinute = 30;
			
			// Time slot configuration
			this.startHour = 10; // 10:00 AM
			this.endHour = 20;   // 8:00 PM (last slot ends at 8:00 PM)
			this.slotDuration = 30; // 30 minutes
			
			// Buffer time in minutes (45 minutes from current time)
			this.bufferMinutes = 45;
			
			this.setupDateConstraints();
			this.populateTimeOptions();
			
			if (this.dateInput) {
				this.dateInput.addEventListener('change', () => this.onDateChange());
				// Prevent manual entry of invalid dates
				this.dateInput.addEventListener('input', () => this.validateDateInput());
				this.dateInput.addEventListener('blur', () => this.validateDateInput());
			}
		}

		/**
		 * Check if current time is past the cutoff (6:30 PM)
		 */
		isPastCutoff() {
			const now = new Date();
			const currentHour = now.getHours();
			const currentMinute = now.getMinutes();
			
			return (currentHour > this.cutoffHour) || 
				   (currentHour === this.cutoffHour && currentMinute >= this.cutoffMinute);
		}

		/**
		 * Get the base date considering the cutoff time
		 * If past 6:30 PM, the base date shifts to tomorrow
		 */
		getBaseDate() {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			
			if (this.isPastCutoff()) {
				today.setDate(today.getDate() + 1);
			}
			
			return today;
		}

		/**
		 * Get today's date at midnight (ignoring cutoff)
		 */
		getTodayMidnight() {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			return today;
		}

		/**
		 * Get the first available date
		 * Platter: base + 3
		 * Other items: base + 0 (same day if before cutoff, tomorrow if after cutoff)
		 */
		getFirstAvailableDate() {
			const baseDate = this.getBaseDate();
			const firstDate = new Date(baseDate);
			firstDate.setDate(baseDate.getDate() + this.leadDays);
			return firstDate;
		}

		/**
		 * Get the last available date (first date + 1 day, only 2 days allowed)
		 */
		getLastAvailableDate() {
			const firstDate = this.getFirstAvailableDate();
			const lastDate = new Date(firstDate);
			lastDate.setDate(firstDate.getDate() + 1);
			return lastDate;
		}

		/**
		 * Format date for value (YYYY-MM-DD)
		 */
		formatDateValue(date) {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		}

		/**
		 * Setup date input constraints (min/max dates)
		 */
		setupDateConstraints() {
			if (!this.dateInput) return;
			
			const firstDate = this.getFirstAvailableDate();
			const lastDate = this.getLastAvailableDate();
			
			// Set min and max to allow only 2 days
			this.dateInput.setAttribute('min', this.formatDateValue(firstDate));
			this.dateInput.setAttribute('max', this.formatDateValue(lastDate));
			
			// Set default value to first available date
			this.dateInput.value = this.formatDateValue(firstDate);
		}

		/**
		 * Generate all time slots from 10:00 AM to 7:30 PM - 8:00 PM
		 * Format: "10:00 AM - 10:30 AM"
		 */
		generateTimeSlots() {
			const slots = [];
			
			// Start at 10:00 AM (10:00) and end at 7:30 PM (19:30)
			// Each slot is 30 minutes
			for (let hour = this.startHour; hour < this.endHour; hour++) {
				for (let minute = 0; minute < 60; minute += this.slotDuration) {
					// Calculate end time
					const endHour = minute + this.slotDuration >= 60 ? hour + 1 : hour;
					const endMinute = (minute + this.slotDuration) % 60;
					
					// Don't create slots that end after 8:00 PM
					if (endHour > this.endHour || (endHour === this.endHour && endMinute > 0)) {
						continue;
					}
					
					const startTime = this.formatTime12Hour(hour, minute);
					const endTime = this.formatTime12Hour(endHour, endMinute);
					
					slots.push({
						display: `${startTime} - ${endTime}`,
						value: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
						hour: hour,
						minute: minute
					});
				}
			}
			
			return slots;
		}

		/**
		 * Format time in 12-hour format (e.g., "10:00 AM")
		 */
		formatTime12Hour(hour, minute) {
			const period = hour >= 12 ? 'PM' : 'AM';
			const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
			const displayMinute = String(minute).padStart(2, '0');
			return `${displayHour}:${displayMinute} ${period}`;
		}

		/**
		 * Check if a time slot should be disabled
		 * Only disable past time slots (+45 min buffer) if selected date is TODAY
		 */
		shouldDisableSlot(slot, selectedDateValue) {
			if (!selectedDateValue) return false;
			
			const now = new Date();
			const todayMidnight = this.getTodayMidnight();
			
			// Parse selected date
			const selectedParts = selectedDateValue.split('-');
			const selectedDate = new Date(
				parseInt(selectedParts[0]), 
				parseInt(selectedParts[1]) - 1, 
				parseInt(selectedParts[2]),
				0, 0, 0, 0
			);
			
			// Only apply time restrictions if selected date is TODAY
			if (selectedDate.getTime() !== todayMidnight.getTime()) {
				return false; // Future date - all times available
			}
			
			// For today, disable slots that are in the past or within 45 minutes
			const currentHour = now.getHours();
			const currentMinute = now.getMinutes();
			
			// Calculate the minimum allowed time (current time + 45 minutes)
			const minAllowedMinutes = (currentHour * 60) + currentMinute + this.bufferMinutes;
			const slotMinutes = (slot.hour * 60) + slot.minute;
			
			// Disable if slot start time is before minimum allowed time
			return slotMinutes < minAllowedMinutes;
		}

		/**
		 * Populate time dropdown based on selected date
		 */
		populateTimeOptions() {
			if (!this.timeSelect) return;
			
			// Remember current selection if any (but only if it's a real value)
			const currentValue = this.timeSelect.value && this.timeSelect.value !== '' ? this.timeSelect.value : null;
			
			// Clear all existing options
			this.timeSelect.innerHTML = '';
			
			const selectedDateValue = this.dateInput?.value;
			const allSlots = this.generateTimeSlots();
			
			let currentValueStillAvailable = false;
			let defaultTimeAvailable = false;
			
			allSlots.forEach((slot) => {
				// Check if this slot should be hidden (past times)
				const isDisabled = this.shouldDisableSlot(slot, selectedDateValue);
				
				// Skip/hide disabled slots instead of showing them
				if (isDisabled) {
					return;
				}
				
				const option = document.createElement('option');
				option.value = slot.value;
				option.textContent = slot.display;
				
				// Check if this is the default time (10:00)
				if (slot.value === '10:00') {
					defaultTimeAvailable = true;
				}
				
				// Check if current value is still available
				if (currentValue && slot.value === currentValue) {
					currentValueStillAvailable = true;
				}
				
				this.timeSelect.appendChild(option);
			});
			
			// Set selection: prefer current value if available, otherwise default to 10:00, otherwise first option
			if (currentValue && currentValueStillAvailable) {
				this.timeSelect.value = currentValue;
			} else if (defaultTimeAvailable && this.timeSelect.options.length > 0) {
				// Set default to "10:00 AM - 10:30 AM" if available
				this.timeSelect.value = '10:00';
			} else if (this.timeSelect.options.length > 0) {
				// Otherwise select first available option
				this.timeSelect.selectedIndex = 0;
			}
		}

		/**
		 * Validate date input to prevent manual entry of invalid dates
		 */
		validateDateInput() {
			if (!this.dateInput || !this.dateInput.value) return;
			
			const selectedDateValue = this.dateInput.value;
			const minDate = this.dateInput.getAttribute('min');
			const maxDate = this.dateInput.getAttribute('max');
			
			// Check if date is outside allowed range
			if (selectedDateValue < minDate || selectedDateValue > maxDate) {
				// Reset to first available date
				const firstDate = this.getFirstAvailableDate();
				this.dateInput.value = this.formatDateValue(firstDate);
				this.populateTimeOptions();
			} else {
				// Date is valid, just update time options
				this.populateTimeOptions();
			}
		}

		/**
		 * Handle date selection change - update time options
		 */
		onDateChange() {
			this.populateTimeOptions();
		}

		/**
		 * Get the selected date and time values
		 */
		getValue() {
			const date = this.dateInput?.value || '';
			const time = this.timeSelect?.value || '';
			const timeDisplay = this.timeSelect?.selectedOptions[0]?.text || '';
			
			if (date && time) {
				return {
					date: date,
					time: time,
					timeDisplay: timeDisplay,
					combined: `${date} ${time}`
				};
			}
			return null;
		}

		/**
		 * Validate the selection
		 */
		validate() {
			if (!this.dateInput?.value) {
				return { valid: false, message: 'Please select a date' };
			}
			if (!this.timeSelect?.value) {
				return { valid: false, message: 'Please select a time slot' };
			}
			
			// Check if selected time is disabled
			const selectedOption = this.timeSelect.selectedOptions[0];
			if (selectedOption?.disabled) {
				return { valid: false, message: 'Please select an available time slot' };
			}
			
			// Validate date is within allowed range
			const selectedDateValue = this.dateInput.value;
			const selectedParts = selectedDateValue.split('-');
			const selectedDate = new Date(
				parseInt(selectedParts[0]), 
				parseInt(selectedParts[1]) - 1, 
				parseInt(selectedParts[2]),
				0, 0, 0, 0
			);
			
			const firstDate = this.getFirstAvailableDate();
			const lastDate = this.getLastAvailableDate();
			
			firstDate.setHours(0, 0, 0, 0);
			lastDate.setHours(0, 0, 0, 0);
			
			if (selectedDate < firstDate || selectedDate > lastDate) {
				return { valid: false, message: 'Please select a valid date within the allowed range' };
			}
			
			return { valid: true };
		}

	}

	if (typeof customElements.get('datetime-slot-picker') == 'undefined') {
		customElements.define('datetime-slot-picker', DateTimeSlotPicker);
	}

}
