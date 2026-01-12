if (typeof DateTimeSlotPicker !== 'function') {

	class DateTimeSlotPicker extends HTMLElement {

		constructor() {
			super();
			this.init();
		}

		init() {
			// Create custom calendar picker
			this.dateInput = this.querySelector('input[type="date"]');
			this.timeSelect = this.querySelector('select[id$="-time"]');
			this.isPlatter = this.dataset.isPlatter === 'true';
			this.calendarOpen = false;
			
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
			this.setupCalendarPicker();
			
			// Setup arrow icons - use requestAnimationFrame for better timing
			requestAnimationFrame(() => {
				this.ensureArrowIcons();
			});
			
			// Handle date selection change
			if (this.dateInput) {
				this.dateInput.addEventListener('change', () => {
					this.onDateChange();
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
		 * Setup custom calendar picker
		 */
		setupCalendarPicker() {
			if (!this.dateInput) return;
			
			const field = this.dateInput.closest('.datetime-slot-picker__field');
			if (!field) return;
			
			// Completely disable native calendar on ALL platforms (iOS, Android, Windows, macOS, Linux, etc.)
			this.dateInput.setAttribute('readonly', 'readonly');
			this.dateInput.setAttribute('tabindex', '-1'); // Prevent keyboard focus
			this.dateInput.style.cursor = 'pointer';
			this.dateInput.style.color = 'transparent'; // Hide native text
			this.dateInput.style.caretColor = 'transparent'; // Hide caret
			
			// Prevent all native calendar interactions - ALL PLATFORMS
			const preventNativeCalendar = (e) => {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				this.dateInput.blur(); // Remove focus to prevent native calendar
				// Use setTimeout to ensure calendar opens after event propagation completes
				setTimeout(() => {
					this.toggleCalendar();
				}, 0);
				return false;
			};
			
			// Block all events that could trigger native calendar on ANY platform
			this.dateInput.addEventListener('click', (e) => {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				this.dateInput.blur();
				// Toggle calendar - if closed, open it; if open, keep it open
				if (!this.calendarOpen) {
					this.openCalendar();
				}
				// Mark that we're handling this click to prevent outside handler from closing
				e.calendarHandled = true;
			}, { passive: false, capture: false });
			
			this.dateInput.addEventListener('mousedown', preventNativeCalendar, { passive: false, capture: true });
			this.dateInput.addEventListener('mouseup', (e) => {
				e.preventDefault();
				e.stopPropagation();
			}, { passive: false, capture: true });
			this.dateInput.addEventListener('touchstart', preventNativeCalendar, { passive: false, capture: true });
			this.dateInput.addEventListener('touchend', (e) => {
				e.preventDefault();
				e.stopPropagation();
			}, { passive: false, capture: true });
			this.dateInput.addEventListener('focus', preventNativeCalendar, { passive: false, capture: true });
			this.dateInput.addEventListener('focusin', preventNativeCalendar, { passive: false, capture: true });
			this.dateInput.addEventListener('keydown', (e) => {
				// Prevent Enter, Space, or any key from opening native calendar
				if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
					e.preventDefault();
					e.stopPropagation();
					this.toggleCalendar();
				}
			}, { passive: false, capture: true });
			
			// Prevent input event (some browsers trigger native calendar on input)
			this.dateInput.addEventListener('input', (e) => {
				e.preventDefault();
				e.stopPropagation();
			}, { passive: false, capture: true });
			
			// Prevent change event from native calendar
			this.dateInput.addEventListener('change', (e) => {
				// Only allow change if it came from our custom calendar
				if (!this.calendarOpen) {
					e.preventDefault();
					e.stopPropagation();
				}
			}, { passive: false, capture: true });
			
			// Create calendar container
			this.calendarContainer = document.createElement('div');
			this.calendarContainer.className = 'custom-calendar-picker';
			this.calendarContainer.style.display = 'none';
			// Ensure field has relative positioning for absolute calendar
			if (getComputedStyle(field).position === 'static') {
				field.style.position = 'relative';
			}
			// Append to field for absolute positioning on desktop (follows input on scroll)
			// On mobile, we'll move it to body for fixed centering
			field.appendChild(this.calendarContainer);
			this.calendarField = field; // Store reference for positioning
			
			// Open calendar on input click
			this.dateInput.addEventListener('click', (e) => {
				e.preventDefault();
				this.toggleCalendar();
			});
			
			// Close calendar when clicking outside
			this.outsideClickHandler = (e) => {
				if (this.calendarOpen) {
					const clickedElement = e.target;
					// Don't close if clicking on the date input, field, or calendar
					const isDateInput = clickedElement === this.dateInput || (this.dateInput && this.dateInput.contains(clickedElement));
					const isCalendar = this.calendarContainer && (clickedElement === this.calendarContainer || this.calendarContainer.contains(clickedElement));
					const isField = field && (clickedElement === field || field.contains(clickedElement));
					
					// Only close if clicking completely outside
					if (!isDateInput && !isCalendar && !isField) {
						this.closeCalendar();
					}
				}
			};
			// Add event listener immediately but use capture: false so input click handler runs first
			document.addEventListener('click', this.outsideClickHandler, false);
			
			// Update calendar position on scroll/resize for desktop fixed positioning
			this.updateCalendarPosition = () => {
				if (this.calendarOpen) {
					if (window.innerWidth > 767) {
						// Desktop: update fixed position to follow input
						if (this.updateDesktopPosition) {
							this.updateDesktopPosition();
						}
					}
					// Mobile uses fixed centering, no update needed
				}
			};
			window.addEventListener('scroll', this.updateCalendarPosition, true);
			window.addEventListener('resize', this.updateCalendarPosition);
			
			// Build calendar
			this.buildCalendar();
		}

		/**
		 * Build calendar HTML
		 */
		buildCalendar() {
			if (!this.calendarContainer) return;
			
			let firstDate = this.getFirstAvailableDate();
			const lastDate = this.getLastAvailableDate();
			
			// If firstDate (D+leadDays) is after maxDate, cap it to maxDate
			if (firstDate > lastDate) {
				firstDate = new Date(lastDate);
			}
			
			// Get current selected date or default to first available
			const currentValue = this.dateInput.value || this.formatDateValue(firstDate);
			const selectedDate = currentValue ? new Date(currentValue + 'T00:00:00') : new Date(firstDate);
			
			// Start from first available date
			const startDate = new Date(firstDate);
			const endDate = new Date(lastDate);
			
			// Calendar header
			const header = document.createElement('div');
			header.className = 'calendar-header';
			header.innerHTML = `
				<button type="button" class="calendar-nav calendar-prev" aria-label="Previous">‹</button>
				<span class="calendar-month-year"></span>
				<button type="button" class="calendar-nav calendar-next" aria-label="Next">›</button>
			`;
			
			// Calendar grid
			const grid = document.createElement('div');
			grid.className = 'calendar-grid';
			
			this.calendarContainer.innerHTML = '';
			this.calendarContainer.appendChild(header);
			this.calendarContainer.appendChild(grid);
			
			// Set initial month
			this.currentMonth = new Date(selectedDate);
			this.renderCalendar();
			
			// Navigation handlers
			header.querySelector('.calendar-prev').addEventListener('click', () => {
				this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
				this.renderCalendar();
			});
			
			header.querySelector('.calendar-next').addEventListener('click', () => {
				this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
				this.renderCalendar();
			});
		}

		/**
		 * Render calendar for current month
		 */
		renderCalendar() {
			if (!this.calendarContainer) return;
			
			const grid = this.calendarContainer.querySelector('.calendar-grid');
			const monthYear = this.calendarContainer.querySelector('.calendar-month-year');
			
			// Update month/year display
			const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
				'July', 'August', 'September', 'October', 'November', 'December'];
			monthYear.textContent = `${monthNames[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
			
			// Clear grid
			grid.innerHTML = '';
			
			// Add day headers
			const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
			dayHeaders.forEach(day => {
				const dayHeader = document.createElement('div');
				dayHeader.className = 'calendar-day-header';
				dayHeader.textContent = day;
				grid.appendChild(dayHeader);
			});
			
			// Get first day of month and number of days
			const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
			const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
			const daysInMonth = lastDay.getDate();
			const startingDayOfWeek = firstDay.getDay();
			
			// Get valid date range
			let firstDate = this.getFirstAvailableDate();
			const lastDate = this.getLastAvailableDate();
			if (firstDate > lastDate) {
				firstDate = new Date(lastDate);
			}
			
			// Add empty cells for days before month starts
			for (let i = 0; i < startingDayOfWeek; i++) {
				const emptyCell = document.createElement('div');
				emptyCell.className = 'calendar-day calendar-day-empty';
				grid.appendChild(emptyCell);
			}
			
			// Add day cells
			const currentValue = this.dateInput.value;
			for (let day = 1; day <= daysInMonth; day++) {
				const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
				const dateValue = this.formatDateValue(date);
				const isAvailable = date >= firstDate && date <= lastDate && !this.isDateClosed(dateValue);
				const isSelected = currentValue === dateValue;
				
				const dayCell = document.createElement('button');
				dayCell.type = 'button';
				dayCell.className = 'calendar-day';
				dayCell.textContent = day;
				
				if (!isAvailable) {
					dayCell.classList.add('calendar-day-disabled');
					dayCell.disabled = true;
				} else {
					dayCell.classList.add('calendar-day-available');
					if (isSelected) {
						dayCell.classList.add('calendar-day-selected');
					}
					
					dayCell.addEventListener('click', () => {
						this.dateInput.value = dateValue;
						this.updateDateDisplay();
						this.onDateChange();
						this.closeCalendar();
					});
				}
				
				grid.appendChild(dayCell);
			}
			
			// Disable navigation if month is out of range
			const prevBtn = this.calendarContainer.querySelector('.calendar-prev');
			const nextBtn = this.calendarContainer.querySelector('.calendar-next');
			
			const minMonth = new Date(firstDate.getFullYear(), firstDate.getMonth());
			const maxMonth = new Date(lastDate.getFullYear(), lastDate.getMonth());
			const currentMonthStart = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth());
			
			prevBtn.disabled = currentMonthStart <= minMonth;
			nextBtn.disabled = currentMonthStart >= maxMonth;
		}

		/**
		 * Toggle calendar visibility
		 */
		toggleCalendar() {
			if (this.calendarOpen) {
				this.closeCalendar();
			} else {
				this.openCalendar();
			}
		}

		/**
		 * Open calendar
		 */
		openCalendar() {
			if (!this.calendarContainer || !this.calendarField) return;
			this.calendarOpen = true;
			
			// Add class to field for z-index control
			this.calendarField.classList.add('calendar-open');
			
			// Position calendar relative to input field
			const inputRect = this.dateInput.getBoundingClientRect();
			const isMobile = window.innerWidth <= 767;
			
			if (isMobile) {
				// Center on mobile - move to body for fixed positioning
				if (this.calendarContainer.parentNode !== document.body) {
					document.body.appendChild(this.calendarContainer);
				}
				this.calendarContainer.style.position = 'fixed';
				this.calendarContainer.style.top = '50%';
				this.calendarContainer.style.left = '50%';
				this.calendarContainer.style.transform = 'translate(-50%, -50%)';
				this.calendarContainer.style.right = 'auto';
				this.calendarContainer.style.width = 'calc(100vw - 2rem)';
				this.calendarContainer.style.maxWidth = '320px';
			} else {
				// Desktop - use absolute positioning appended to body, positioned below input
				// Move to body for absolute positioning relative to document
				if (this.calendarContainer.parentNode !== document.body) {
					document.body.appendChild(this.calendarContainer);
				}
				// Calculate position based on input's document position (absolute is relative to body/document)
				const updateDesktopPosition = () => {
					const inputRect = this.dateInput.getBoundingClientRect();
					// Calculate absolute position relative to document
					const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
					const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
					
					this.calendarContainer.style.position = 'absolute';
					this.calendarContainer.style.top = `${inputRect.bottom + scrollTop + 8}px`;
					this.calendarContainer.style.left = `${inputRect.left + scrollLeft}px`;
					this.calendarContainer.style.right = 'auto';
					this.calendarContainer.style.transform = 'none';
					this.calendarContainer.style.width = 'auto';
					this.calendarContainer.style.minWidth = '280px';
					this.calendarContainer.style.maxWidth = '320px';
					this.calendarContainer.style.bottom = 'auto';
				};
				updateDesktopPosition();
				// Store update function for scroll/resize handlers
				this.updateDesktopPosition = updateDesktopPosition;
			}
			
			this.calendarContainer.style.display = 'block';
			// Set z-index based on screen size
			if (isMobile) {
				this.calendarContainer.style.zIndex = '998'; // Mobile: below header (999)
			} else {
				this.calendarContainer.style.zIndex = '99'; // Desktop: z-index 99
			}
			this.calendarContainer.style.background = 'var(--color-background-main, #ffffff)';
			this.calendarContainer.style.backgroundColor = 'var(--color-background-main, #ffffff)';
			
			// Re-render to ensure current selection is visible
			if (this.dateInput.value) {
				const selectedDate = new Date(this.dateInput.value + 'T00:00:00');
				this.currentMonth = new Date(selectedDate);
			}
			this.renderCalendar();
		}

		/**
		 * Close calendar
		 */
		closeCalendar() {
			if (!this.calendarContainer) return;
			this.calendarOpen = false;
			this.calendarContainer.style.display = 'none';
			// Remove class from field
			if (this.calendarField) {
				this.calendarField.classList.remove('calendar-open');
			}
			// Remove event listeners
			if (this.updateCalendarPosition) {
				window.removeEventListener('scroll', this.updateCalendarPosition, true);
				window.removeEventListener('resize', this.updateCalendarPosition);
			}
			// Clear desktop position update function
			this.updateDesktopPosition = null;
		}

		/**
		 * Validate if a date string is within the allowed range
		 */
		isDateValid(dateStr) {
			if (!dateStr) return false;
			return dateStr >= this.minDateStr && dateStr <= this.maxDateStr;
		}

		/**
		 * Enforce date constraints - reset to valid date if invalid
		 */
		enforceDateConstraints() {
			if (!this.dateInput) return;
			
			const selectedValue = this.dateInput.value;
			
			// Re-apply min/max attributes (some browsers remove them)
			this.dateInput.setAttribute('min', this.minDateStr);
			this.dateInput.setAttribute('max', this.maxDateStr);
			
			if (!this.isDateValid(selectedValue)) {
				// Reset to first available date if out of range or empty
				this.dateInput.value = this.minDateStr;
				this.updateDateDisplay();
				this.populateTimeOptions();
			}
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
			const minDateStr = this.formatDateValue(firstDate);
			const maxDateStr = this.formatDateValue(lastDate);
			
			// Store min/max for validation
			this.minDateStr = minDateStr;
			this.maxDateStr = maxDateStr;
			
			// Set attributes before setting value to ensure constraints are applied
			this.dateInput.setAttribute('min', minDateStr);
			this.dateInput.setAttribute('max', maxDateStr);
			this.dateInput.setAttribute('step', '1');
			
			// Set default value to first available date
			this.dateInput.value = minDateStr;
			
			// Use setCustomValidity to mark invalid dates
			this.dateInput.setCustomValidity('');
			
			// Validate and enforce constraints on change
			this.dateInput.addEventListener('change', () => {
				this.enforceDateConstraints();
				if (this.isDateValid(this.dateInput.value)) {
					this.updateDateDisplay();
					this.populateTimeOptions();
				}
			});
			
			// Also validate on input event (for browsers that support it)
			this.dateInput.addEventListener('input', () => {
				this.enforceDateConstraints();
			});
			
			// Validate before form submission
			this.dateInput.addEventListener('invalid', () => {
				this.enforceDateConstraints();
			});
			
			// Re-apply constraints periodically (some browsers ignore min/max)
			this.constraintInterval = setInterval(() => {
				this.enforceDateConstraints();
			}, 1000);
			
			// Re-apply constraints when input gains focus (before calendar opens)
			this.dateInput.addEventListener('focus', () => {
				this.enforceDateConstraints();
			});
			
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
			const dateValue = forDate || (this.dateInput ? this.dateInput.value : '');
			
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
			
			// Get date value from input
			const selectedDateValue = this.dateInput ? this.dateInput.value : '';
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
			// Get date value from input
			const dateValue = this.dateInput ? this.dateInput.value : '';
			
			if (dateValue && this.displayElement) {
				const formattedDate = this.formatDateDisplay(dateValue);
				this.displayElement.textContent = formattedDate;
				// Also set as title for accessibility
				if (this.dateInput) {
					this.dateInput.setAttribute('title', formattedDate);
				}
				if (this.dateSelect) {
					this.dateSelect.setAttribute('title', formattedDate);
				}
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
			const date = this.dateInput ? this.dateInput.value : '';
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
			const dateValue = this.dateInput ? this.dateInput.value : '';
			if (!dateValue) {
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
			const selectedDateValue = dateValue;
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

		/**
		 * Cleanup when component is removed
		 */
		disconnectedCallback() {
			if (this.constraintInterval) {
				clearInterval(this.constraintInterval);
				this.constraintInterval = null;
			}
			if (this.outsideClickHandler) {
				document.removeEventListener('click', this.outsideClickHandler);
			}
			if (this.calendarContainer && this.calendarContainer.parentNode) {
				this.calendarContainer.parentNode.removeChild(this.calendarContainer);
			}
		}

	}

	if (typeof customElements.get('datetime-slot-picker') == 'undefined') {
		customElements.define('datetime-slot-picker', DateTimeSlotPicker);
	}

}

