package jets.projects.services;

import jets.projects.dao.PurchaseHistoryDao;
import jets.projects.dto.PurchaseDTO;
import jets.projects.entity.PurchaseHistory;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;
import java.util.stream.Collectors;

public class PurchaseHistoryService {
    private static final Logger LOGGER = Logger.getLogger(PurchaseHistoryService.class.getName());
    private final PurchaseHistoryDao purchaseDao;

    public PurchaseHistoryService() {
        this.purchaseDao = new PurchaseHistoryDao();
    }

    public List<PurchaseDTO> findAll(int page, int size, String search, LocalDate dateFrom, LocalDate dateTo) {
        try {
            return purchaseDao.findAll(page, size, search, dateFrom, dateTo).stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            LOGGER.severe("Error in findAll: " + e.getMessage());
            throw new RuntimeException("Failed to fetch purchases", e);
        }
    }

    public Optional<PurchaseDTO> findById(Long id) {
        try {
            return purchaseDao.findById(id).map(this::convertToDTO);
        } catch (Exception e) {
            LOGGER.severe("Error finding purchase by ID " + id + ": " + e.getMessage());
            throw new RuntimeException("Failed to fetch purchase", e);
        }
    }

    public long countFiltered(String search, LocalDate dateFrom, LocalDate dateTo) {
        try {
            return purchaseDao.countFiltered(search, dateFrom, dateTo);
        } catch (Exception e) {
            LOGGER.severe("Error in countFiltered: " + e.getMessage());
            throw new RuntimeException("Failed to count purchases", e);
        }
    }

    private PurchaseDTO convertToDTO(PurchaseHistory purchase) {
        PurchaseDTO dto = new PurchaseDTO();
        dto.setId(purchase.getReceiptId());
        dto.setUserName(purchase.getUser() != null ? purchase.getUser().getUsername() : "Unknown");
        dto.setUserEmail(purchase.getUser() != null ? purchase.getUser().getEmail() : "N/A");
        dto.setDate(purchase.getPurchaseDatetime().toString());
        dto.setTotalPaid(purchase.getTotalPaid());
        return dto;
    }
}