document.addEventListener("DOMContentLoaded", () => {
    initializeDateFilters();
    loadPurchaseHistory();
    setupStatsSSE();

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
    document.getElementById("dateFrom").value = '';
    document.getElementById("dateTo").value = '';
}

function setupStatsSSE() {
    const eventSource = new EventSource(`${contextPath}/Admin/StatsServlet`);
    eventSource.onmessage = (event) => {
        try {
            const stats = JSON.parse(event.data);
            updatePurchaseStats(stats);
        } catch (e) {
            console.error("Error parsing SSE stats:", e);
        }
    };
    eventSource.onerror = () => {
        console.warn("SSE connection lost. Retrying...");
        eventSource.close();
        setTimeout(setupStatsSSE, 5000);
    };
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

    fetch(`${contextPath}/Admin/PurchaseHistoryServlet?${params.toString()}`, {
        headers: { "Accept": "application/json" }
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            totalPages = data.totalPages || 1;
            displayPurchaseHistory(data.purchases || []);
            updatePagination();
        })
        .catch(error => {
            console.error('Error loading purchase history:', error);
            displayPurchaseHistory([]);
            updatePagination();
        });
}

function updatePurchaseStats(stats) {
    document.getElementById("totalPurchases").textContent = stats.totalPurchases || 0;
    document.getElementById("totalRevenue").textContent = formatCurrency(stats.totalRevenue || 0);
    document.getElementById("uniqueCustomers").textContent = stats.uniqueCustomers || 0;
}

function displayPurchaseHistory(purchases) {
    const purchaseHistoryTable = document.getElementById("purchaseHistoryTable");
    purchaseHistoryTable.innerHTML = "";

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
                <td>${purchase.userName || 'Unknown'}</td>
                <td>${formatDate(purchase.date)}</td>
                <td>${formatCurrency(purchase.totalPaid)}</td>
                <td>
                    <a href="#" class="view-receipt-btn" onclick="viewReceipt(${purchase.id}); return false;">View Receipt</a>
                </td>
            </tr>
        `;
    });
}

function updatePagination() {
    document.getElementById("currentPage").textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage >= totalPages;
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
    fetch(`${contextPath}/Admin/PurchaseHistoryServlet/receipt/${id}`, {
        headers: { "Accept": "application/json" }
    })
        .then(response => {
            if (!response.ok) throw new Error(`Failed to fetch receipt ${id}`);
            return response.json();
        })
        .then(receipt => {
            displayReceiptDetails(receipt);
        })
        .catch(error => {
            console.error('Error fetching receipt:', error);
            alert('Failed to load receipt details. Please try again.');
            displayReceiptDetails({ id });
        });
}

function displayReceiptDetails(receipt) {
    document.getElementById("modalReceiptId").textContent = receipt.id || 'N/A';
    document.getElementById("modalReceiptDate").textContent = receipt.date ? formatDate(receipt.date) : 'N/A';
    document.getElementById("modalUserName").textContent = receipt.userName || 'Unknown';
    document.getElementById("modalUserEmail").textContent = receipt.userEmail || 'N/A';
    document.getElementById("modalTotalPaid").textContent = receipt.totalPaid != null ? formatCurrency(receipt.totalPaid) : '$0.00';

    const downloadBtn = document.getElementById("downloadReceiptBtn");
    downloadBtn.href = receipt.id ? `${contextPath}/Admin/PurchaseHistoryServlet/receipt/${receipt.id}/download` : '#';

    openModal("receiptModal");
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
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