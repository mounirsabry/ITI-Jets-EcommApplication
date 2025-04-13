document.addEventListener("DOMContentLoaded", () => {
    initializeDateFilters();
    loadPurchaseHistory();

    document.getElementById("applyDateFilter").addEventListener("click", () => {
        applyFilters();
    });

    document.getElementById("resetFilters").addEventListener("click", () => {
        resetAllFilters();
    });

    document.getElementById("searchBtn").addEventListener("click", () => {
        applyFilters();
    });

    document.getElementById("purchaseSearch").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            applyFilters();
        }
    });

    document.getElementById("prevPage").addEventListener("click", () => {
        navigatePage(-1);
    });

    document.getElementById("nextPage").addEventListener("click", () => {
        navigatePage(1);
    });

    window.viewReceipt = viewReceipt;
});

let currentPage = 1;
let totalPages = 1;
const itemsPerPage = 10;

function initializeDateFilters() {
    document.getElementById("dateFrom").value = null;
    document.getElementById("dateTo").value = null;
}

function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

function loadPurchaseHistory() {
    fetchPurchaseHistory(currentPage);
}

function fetchPurchaseHistory(page) {
    const dateFrom = document.getElementById("dateFrom").value;
    const dateTo = document.getElementById("dateTo").value;
    const searchTerm = document.getElementById("purchaseSearch").value.toLowerCase();

    const params = new URLSearchParams({
        page: page,
        size: itemsPerPage,
        dateFrom: dateFrom,
        dateTo: dateTo,
        search: searchTerm
    });

    fetch(`${contextPath}/Admin/PurchaseHistory/api?${params.toString()}`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch purchase history');
            return response.json();
        })
        .then(data => {
            totalPages = data.totalPages;
            processPurchaseHistory(data);
        })
        .catch(error => {
            console.error('Error loading purchase history:', error);
            processPurchaseHistory({ purchases: [], totalPages: 1, totalPurchases: 0, totalRevenue: 0, uniqueCustomers: 0 });
        });
}

function processPurchaseHistory(data) {
    updatePurchaseStats(data);
    displayPurchaseHistory(data.purchases);
}

function updatePurchaseStats(data) {
    document.getElementById("totalPurchases").textContent = data.totalPurchases;
    document.getElementById("totalRevenue").textContent = formatCurrency(data.totalRevenue);
    document.getElementById("uniqueCustomers").textContent = data.uniqueCustomers;
}

function displayPurchaseHistory(purchases) {
    const purchaseHistoryTable = document.getElementById("purchaseHistoryTable");
    purchaseHistoryTable.innerHTML = "";

    document.getElementById("currentPage").textContent = `Page ${currentPage} of ${totalPages || 1}`;
    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage === totalPages || totalPages === 0;

    if (purchases.length === 0) {
        purchaseHistoryTable.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No purchase history found.</td>
            </tr>
        `;
        return;
    }

    purchases.forEach(purchase => {
        purchaseHistoryTable.innerHTML += `
            <tr>
                <td>${purchase.id}</td>
                <td>${purchase.userName}</td>
                <td>${formatDate(purchase.date)}</td>
                <td>${formatCurrency(purchase.totalPaid)}</td>
                <td>
                    <a href="#" class="view-receipt-btn" onclick="viewReceipt(${purchase.id}); return false;">View Receipt</a>
                </td>
            </tr>
        `;
    });
}

function applyFilters() {
    currentPage = 1;
    fetchPurchaseHistory(currentPage);
}

function resetAllFilters() {
    initializeDateFilters();
    document.getElementById("purchaseSearch").value = '';
    currentPage = 1;
    fetchPurchaseHistory(currentPage);
}

function navigatePage(direction) {
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        fetchPurchaseHistory(currentPage);
    }
}

function viewReceipt(id) {
    console.log(`Fetching receipt for ID: ${id}`);
    fetch(`${contextPath}/Admin/PurchaseHistory/api/${id}`, {
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            console.log(`Response status: ${response.status}, headers: ${[...response.headers.entries()]}`);
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Failed to fetch receipt ${id}: ${response.statusText}, body: ${text}`);
                });
            }
            return response.text();
        })
        .then(text => {
            console.log(`Raw response: ${text}`);
            try {
                return text ? JSON.parse(text) : {};
            } catch (e) {
                console.error('JSON parse error:', e);
                return { id: id }; // Fallback with ID
            }
        })
        .then(receipt => {
            console.log('Received receipt:', receipt);
            if (!receipt) {
                console.warn('Empty receipt received, using fallback');
                receipt = { id: id };
            }
            displayReceiptDetails(receipt);
        })
        .catch(error => {
            console.error('Error fetching receipt:', error);
            alert('Failed to load receipt details. Please try again.');
            displayReceiptDetails({ id: id });
        });
}

function displayReceiptDetails(receipt) {
    console.log('Displaying receipt details:', receipt);
    document.getElementById("modalReceiptId").textContent = String(receipt.id || 'N/A');
    document.getElementById("modalReceiptDate").textContent = receipt.date ? formatDate(receipt.date) : 'N/A';
    document.getElementById("modalUserName").textContent = receipt.userName || 'Unknown';
    document.getElementById("modalUserEmail").textContent = receipt.userEmail || 'N/A';
    document.getElementById("modalTotalPaid").textContent = receipt.totalPaid != null ? formatCurrency(receipt.totalPaid) : '$0.00';

    const downloadBtn = document.getElementById("downloadReceiptBtn");
    const downloadUrl = receipt.id ? `${contextPath}/Admin/PurchaseHistory/api/${receipt.id}/download` : '#';
    downloadBtn.href = downloadUrl;
    console.log('Set download URL:', downloadUrl);

    openModal("receiptModal");
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options) || 'N/A';
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeModal(modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

document.addEventListener("DOMContentLoaded", () => {
    const closeButtons = document.querySelectorAll(".close");
    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = button.closest(".modal");
            closeModal(modal);
        });
    });

    const modals = document.querySelectorAll(".modal");
    modals.forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
});