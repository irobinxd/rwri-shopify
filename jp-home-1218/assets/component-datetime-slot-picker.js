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
			
			// Lead days: read from data attribute, default to 3 for platter, 0 for others
			this.leadDays = this.dataset.leadDays ? parseInt(this.dataset.leadDays) : (this.isPlatter ? 3 : 0);
			
			// Available days: how many days from first available date (default 2 for non-platter, 10 for platter)
			this.availableDays = this.dataset.availableDays ? parseInt(this.dataset.availableDays) : (this.isPlatter ? 10 : 2);
			
			// Max date: optional hard limit (e.g., "2025-01-07")
			this.maxDate = this.dataset.maxDate || null;
			
			// Cutoff time: 6:30 PM (18:30)
			this.cutoffHour = 18;
			this.cutoffMinute = 30;
			
			// Parse timeslot configuration from data attribute
			this.timeslotConfig = this.parseTimeslotConfig();
			
			// Time slot configuration (defaults, can be overridden by config)
			this.startHour = this.timeslotConfig.startHour ?? 10; // 10:00 AM
			this.endHour = this.timeslotConfig.endHour ?? 20;     // 8:00 PM
			this.slotDuration = this.timeslotConfig.slotDuration ?? 30; // 30 minutes
			
			// Closed dates (no pickup available)
			this.closedDates = this.timeslotConfig.closedDates || [];
			
			// Date-specific overrides (different hours for specific dates)
			this.dateOverrides = this.timeslotConfig.dateOverrides || {};
			
			// Buffer time in minutes (45 minutes from current time)
			this.bufferMinutes = 45;
			
			this.setupDateConstraints();
			this.populateTimeOptions();
			this.setupDateDisplay();
			
			// Setup arrow icons - use requestAnimationFrame for better timing
			requestAnimationFrame(() => {
				this.ensureArrowIcons();
			});
			
			if (this.dateInput) {
				this.dateInput.addEventListener('change', () => {
					this.onDateChange();
					this.updateDateDisplay();
				});
				
				// Update display on input (for calendar picker)
				this.dateInput.addEventListener('input', () => {
					this.updateDateDisplay();
				});
				
				// Prevent manual keyboard entry - only allow calendar picker
				this.dateInput.addEventListener('keydown', (e) => {
					// Allow Tab for accessibility
					if (e.key !== 'Tab') {
						e.preventDefault();
					}
				});
				
				// Prevent clearing - if value is empty, reset to first available date
				this.dateInput.addEventListener('change', () => {
					if (!this.dateInput.value) {
						const firstDate = this.getFirstAvailableDate();
						const lastDate = this.getLastAvailableDate();
						if (firstDate > lastDate) {
							this.dateInput.value = this.formatDateValue(lastDate);
						} else {
							this.dateInput.value = this.formatDateValue(firstDate);
						}
						this.updateDateDisplay();
					}
				});
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
		 * Get the last available date
		 * Uses availableDays from first date, or maxDate if specified
		 */
		getLastAvailableDate() {
			const firstDate = this.getFirstAvailableDate();
			let lastDate = new Date(firstDate);
			// availableDays - 1 because first date counts as day 1
			lastDate.setDate(firstDate.getDate() + this.availableDays - 1);
			
			// If a max date is specified, use the earlier of the two
			if (this.maxDate) {
				const parts = this.maxDate.split('-');
				const maxDateObj = new Date(
					parseInt(parts[0]), 
					parseInt(parts[1]) - 1, 
					parseInt(parts[2]),
					0, 0, 0, 0
				);
				if (maxDateObj < lastDate) {
					lastDate = maxDateObj;
				}
			}
			
			return lastDate;
		}

		/**
		 * Parse timeslot configuration from data attribute
		 */
		parseTimeslotConfig() {
			const configStr = this.dataset.timeslotConfig;
			if (!configStr) {
				return {};
			}
			try {
				return JSON.parse(configStr);
			} catch (e) {
				console.warn('Invalid timeslot config:', e);
				return {};
			}
		}

		/**
		 * Get timeslot hours for a specific date (checks for overrides)
		 */
		getHoursForDate(dateValue) {
			// Check if there's an override for this specific date
			if (this.dateOverrides && this.dateOverrides[dateValue]) {
				const override = this.dateOverrides[dateValue];
				return {
					startHour: override.startHour ?? this.startHour,
					endHour: override.endHour ?? this.endHour
				};
			}
			// Return default hours
			return {
				startHour: this.startHour,
				endHour: this.endHour
			};
		}

		/**
		 * Check if a date is closed (no pickup available)
		 */
		isDateClosed(dateValue) {
			return this.closedDates && this.closedDates.includes(dateValue);
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
		 * Format date for display (mmm dd format, e.g., "Dec 02")
		 */
		formatDateDisplay(dateValue) {
			if (!dateValue) return '';
			
			const parts = dateValue.split('-');
			if (parts.length !== 3) return dateValue;
			
			const month = parseInt(parts[1]) - 1; // JavaScript months are 0-indexed
			const day = parseInt(parts[2]);
			
			const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			const monthAbbr = monthNames[month];
			const dayFormatted = String(day).padStart(2, '0');
			
			return `${monthAbbr} ${dayFormatted}`;
		}

		/**
		 * Setup date input constraints (min/max dates)
		 */
		setupDateConstraints() {
			if (!this.dateInput) return;
			
			let firstDate = this.getFirstAvailableDate();
			const lastDate = this.getLastAvailableDate();
			
			// If firstDate (D+leadDays) is after maxDate, cap it to maxDate
			if (firstDate > lastDate) {
				firstDate = new Date(lastDate);
			}
			
			// Set min and max dates
			this.dateInput.setAttribute('min', this.formatDateValue(firstDate));
			this.dateInput.setAttribute('max', this.formatDateValue(lastDate));
			
			// Set default value to first available date
			this.dateInput.value = this.formatDateValue(firstDate);
			
			// Update display format after setting value
			// Use setTimeout to ensure display element is created first
			setTimeout(() => {
				this.updateDateDisplay();
			}, 0);
		}

		/**
		 * Generate all time slots based on selected date
		 * Uses date-specific overrides if available
		 * Format: "10:00 AM - 10:30 AM"
		 */
		generateTimeSlots(forDate) {
			const slots = [];
			const dateValue = forDate || this.dateInput?.value;
			
			// Get hours for this specific date (may have overrides)
			const { startHour, endHour } = this.getHoursForDate(dateValue);
			
			// Generate slots based on the hours for this date
			for (let hour = startHour; hour < endHour; hour++) {
				for (let minute = 0; minute < 60; minute += this.slotDuration) {
					// Calculate end time
					const endHourCalc = minute + this.slotDuration >= 60 ? hour + 1 : hour;
					const endMinute = (minute + this.slotDuration) % 60;
					
					// Don't create slots that end after end hour
					if (endHourCalc > endHour || (endHourCalc === endHour && endMinute > 0)) {
						continue;
					}
					
					const startTime = this.formatTime12Hour(hour, minute);
					const endTime = this.formatTime12Hour(endHourCalc, endMinute);
					
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
		 * Setup date display formatting
		 */
		setupDateDisplay() {
			if (!this.dateInput) return;
			
			const field = this.dateInput.closest('.datetime-slot-picker__field');
			if (field) {
				// Create a display element for the formatted date
				let displayElement = field.querySelector('.date-display-overlay');
				if (!displayElement) {
					displayElement = document.createElement('span');
					displayElement.className = 'date-display-overlay';
					displayElement.setAttribute('aria-hidden', 'true');
					field.style.position = 'relative';
					this.dateInput.parentNode.insertBefore(displayElement, this.dateInput);
				}
				this.displayElement = displayElement;
				
				// Make the input text transparent so our formatted text shows
				this.dateInput.style.color = 'transparent';
				
				// Create arrow icon for date input
				this.setupArrowIcon(this.dateInput);
				
				// Set initial display
				this.updateDateDisplay();
			}
		}

		/**
		 * Ensure arrow icons are created for all inputs
		 */
		ensureArrowIcons() {
			if (this.dateInput) {
				this.setupArrowIcon(this.dateInput);
			}
			if (this.timeSelect) {
				this.setupArrowIcon(this.timeSelect);
			}
		}

		/**
		 * Setup arrow icon for input/select elements
		 */
		setupArrowIcon(inputElement) {
			if (!inputElement) return;
			
			const field = inputElement.closest('.datetime-slot-picker__field');
			if (!field) return;
			
			// Ensure field has relative positioning
			if (getComputedStyle(field).position === 'static') {
				field.style.position = 'relative';
			}
			
			// Check if arrow already exists for this specific input
			const inputId = inputElement.id || inputElement.getAttribute('name') || '';
			const arrowSelector = inputId ? `.dropdown-arrow-icon[data-for="${inputId}"]` : '.dropdown-arrow-icon';
			let arrowElement = field.querySelector(arrowSelector);
			
			if (!arrowElement) {
				arrowElement = document.createElement('span');
				arrowElement.className = 'dropdown-arrow-icon';
				arrowElement.setAttribute('aria-hidden', 'true');
				if (inputId) {
					arrowElement.setAttribute('data-for', inputId);
				}
				// Append to field wrapper (not after input) to ensure proper absolute positioning
				field.appendChild(arrowElement);
			}
		}

		/**
		 * Update the date display format
		 */
		updateDateDisplay() {
			if (!this.dateInput) return;
			
			const dateValue = this.dateInput.value;
			if (dateValue && this.displayElement) {
				const formattedDate = this.formatDateDisplay(dateValue);
				this.displayElement.textContent = formattedDate;
				// Also set as title for accessibility
				this.dateInput.setAttribute('title', formattedDate);
			} else if (this.displayElement) {
				this.displayElement.textContent = '';
			}
		}

		/**
		 * Handle date selection change - update time options
		 */
		onDateChange() {
			this.populateTimeOptions();
			this.updateDateDisplay();
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

