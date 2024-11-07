function simulateDateChange() {
    console.log("simulating date change to New Year's");

    // save the original Date constructor
    const OriginalDate = Date;

    // create fake Date constructor
    const FakeDate = class extends OriginalDate {
        constructor(...args) {
            // check if to simulate New Year
            if (args.length === 0) {
                // simulate January 1, 2025, 00:00:00
                return new OriginalDate(2025, 0, 1, 0, 0, 0, 0);
            }
            return new OriginalDate(...args);
        }
    };

    // override the global Date object
    window.Date = FakeDate;

    // call your countdown function to update display
    updateCountdownDisplay();

    // restore the original Date object after a delay
    setTimeout(() => {
        window.Date = OriginalDate; // restore original Date
        console.log("restored original Date object.");
    }, 5000);
}

// trigger simulation testing
simulateDateChange();