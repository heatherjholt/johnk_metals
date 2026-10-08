(() => {
    const popupKey = 'johnsMetalsMailingListDismissedV2';

    function showMailingListPopup() {
        if (sessionStorage.getItem(popupKey) || document.getElementById('mailing-list-popup')) {
            return;
        }

        const popup = document.createElement('div');
        popup.id = 'mailing-list-popup';
        popup.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4';
        popup.innerHTML = `
            <div role="dialog" aria-modal="true" aria-labelledby="mailing-list-title" class="relative w-full max-w-md rounded-lg border-t-4 border-gold bg-white p-8 text-center shadow-2xl">
                <button type="button" aria-label="Close mailing list signup" class="absolute right-4 top-3 text-2xl leading-none text-gray-500 hover:text-navy" data-mailing-list-close>&times;</button>
                <i class="fa-solid fa-envelope-open-text mb-4 text-4xl text-gold"></i>
                <h2 id="mailing-list-title" class="mb-2 text-2xl font-bold text-navy">Get a discount on your first order</h2>
                <p class="mb-6 text-gray-600">Join our mailing list to receive your exclusive discount, market updates, and new metal deals.</p>
                <form class="space-y-3" data-mailing-list-form>
                    <label for="mailing-list-email" class="sr-only">Email address</label>
                    <input id="mailing-list-email" name="email" type="email" required placeholder="you@example.com" class="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-gold focus:ring-gold">
                    <button type="submit" class="w-full rounded-md bg-navy px-4 py-3 font-bold text-white transition hover:bg-gold hover:text-navy">Get my discount</button>
                </form>
                <p class="mt-4 text-xs text-gray-500">No spam. Unsubscribe anytime.</p>
            </div>
        `;

        document.body.appendChild(popup);

        const dismiss = () => {
            sessionStorage.setItem(popupKey, 'true');
            popup.remove();
        };

        popup.querySelector('[data-mailing-list-close]').addEventListener('click', dismiss);
        popup.addEventListener('click', (event) => {
            if (event.target === popup) {
                dismiss();
            }
        });
        popup.querySelector('[data-mailing-list-form]').addEventListener('submit', (event) => {
            event.preventDefault();
            sessionStorage.setItem(popupKey, 'true');
            popup.querySelector('[data-mailing-list-form]').innerHTML = '<p class="py-3 font-semibold text-green-700">Thanks for signing up! Your discount is on the way.</p>';
        });
    }

    setTimeout(showMailingListPopup, 10000);
})();
