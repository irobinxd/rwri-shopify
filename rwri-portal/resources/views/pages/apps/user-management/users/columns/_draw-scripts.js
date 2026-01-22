// Initialize KTMenu after table is drawn
if (typeof KTMenu !== 'undefined') {
    KTMenu.init();
}

// Wait for Livewire to be available, then set up event listeners
function setupActionButtons() {
    // Remove existing listeners to prevent duplicates
    const deleteButtons = document.querySelectorAll('[data-kt-action="delete_row"]');
    const updateButtons = document.querySelectorAll('[data-kt-action="update_row"]');
    
    // Add click event listener to delete buttons
    deleteButtons.forEach(function (element) {
        // Remove old listeners by cloning
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
        
        newElement.addEventListener('click', function (e) {
            e.preventDefault();
            const userId = this.getAttribute('data-kt-user-id');
            if (userId) {
                Swal.fire({
                    text: 'Are you sure you want to remove?',
                    icon: 'warning',
                    buttonsStyling: false,
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    customClass: {
                        confirmButton: 'btn btn-danger',
                        cancelButton: 'btn btn-secondary',
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Wait for Livewire
                        function dispatchDelete() {
                            if (typeof Livewire !== 'undefined') {
                                Livewire.dispatch('delete_user', [userId]);
                            } else {
                                setTimeout(dispatchDelete, 100);
                            }
                        }
                        dispatchDelete();
                    }
                });
            }
        });
    });

    // Add click event listener to update buttons
    updateButtons.forEach(function (element) {
        // Remove old listeners by cloning
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
        
        newElement.addEventListener('click', function (e) {
            e.preventDefault();
            const userId = this.getAttribute('data-kt-user-id');
            if (userId) {
                // Wait for Livewire
                function dispatchUpdate() {
                    if (typeof Livewire !== 'undefined') {
                        Livewire.dispatch('update_user', [userId]);
                    } else {
                        setTimeout(dispatchUpdate, 100);
                    }
                }
                dispatchUpdate();
            }
        });
    });
}

// Set up action buttons
setupActionButtons();
