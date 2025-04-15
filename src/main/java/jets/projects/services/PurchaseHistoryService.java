package jets.projects.services;

import jets.projects.dao.PurchaseHistoryDao;
import jets.projects.dao.UserDao;
import jets.projects.client_dto.PurchaseHistoryDto;
import jets.projects.entity.PurchaseHistory;
import jets.projects.exceptions.InvalidInputException;
import jets.projects.exceptions.NotFoundException;

import java.util.List;
import java.util.stream.Collectors;

public class PurchaseHistoryService {
    private final PurchaseHistoryDao purchaseHistoryDao;
    private final UserDao userDao;

    public PurchaseHistoryService() {
        this.purchaseHistoryDao = new PurchaseHistoryDao();
        this.userDao = new UserDao();
    }

    // Convert PurchaseHistory to PurchaseHistoryDto
    private PurchaseHistoryDto convertToDto(PurchaseHistory purchase) {
        PurchaseHistoryDto dto = new PurchaseHistoryDto();
        dto.setItemId(purchase.getReceiptId());
        dto.setUserId(purchase.getUser().getUserId());
        dto.setDate(purchase.getPurchaseDatetime());
        dto.setTotalPaid(purchase.getTotalPaid());
        dto.setReceiptFileUrl(purchase.getReceiptFileUrl());
        return dto;
    }

    // 1. Get all purchase history for a user
    public List<PurchaseHistoryDto> getPurchaseHistory(Long userId) throws InvalidInputException, NotFoundException {
        if (userId == null || userId <= 0) {
            throw new InvalidInputException("Invalid user ID");
        }
        userDao.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with ID: " + userId));
        List<PurchaseHistory> purchaseHistory = purchaseHistoryDao.findByUserId(userId);
        return purchaseHistory.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // 2. Get specific purchase history item
    public PurchaseHistoryDto getPurchaseItem(Long userId, Long itemId) throws InvalidInputException, NotFoundException {
        if (userId == null || userId <= 0) {
            throw new InvalidInputException("Invalid user ID");
        }
        if (itemId == null || itemId <= 0) {
            throw new InvalidInputException("Invalid item ID");
        }
        userDao.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with ID: " + userId));
        PurchaseHistory purchase = purchaseHistoryDao.findByUserIdAndItemId(userId, itemId)
                .orElseThrow(() -> new NotFoundException("Purchase history item not found with ID: " + itemId + " for user ID: " + userId));
        return convertToDto(purchase);
    }
}