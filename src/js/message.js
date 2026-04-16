// Message form handler
document.addEventListener('submit', async (e) => {
    const form = e.target;
    if (form.id !== 'contact-form') return;

    e.preventDefault();

    // Get form data
    const formData = new FormData(messageForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };

    try {
        // Show loading state
        const submitButton = messageForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        // Send message using API endpoint
        const response = await fetch('/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        // Show success message
        submitButton.textContent = 'Message Sent!';
        messageForm.reset();

        // Reset button after 2 seconds
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }, 2000);

    } catch (error) {
        console.error('Error sending message:', error);
        
        // Show error message
        const submitButton = messageForm.querySelector('button[type="submit"]');
        submitButton.textContent = 'Error Sending Message';
        // submitButton.classList.add('bg-red-500');

        // Reset button after 2 seconds
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
            submitButton.classList.remove('bg-red-500');
        }, 2000);
    }
});
