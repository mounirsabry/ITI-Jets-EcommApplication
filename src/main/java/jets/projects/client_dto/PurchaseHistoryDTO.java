package jets.projects.client_dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PurchaseHistoryDTO
{
    private Long receiptId;
    private Long userId;
    private LocalDateTime purchaseDatetime;
    private BigDecimal totalPaid;
    private String receiptFileUrl;

    public PurchaseHistoryDTO()
    {
    }

    public PurchaseHistoryDTO(Long receiptId, Long userId, LocalDateTime purchaseDatetime, BigDecimal totalPaid, String receiptFileUrl)
    {
        this.receiptId = receiptId;
        this.userId = userId;
        this.purchaseDatetime = purchaseDatetime;
        this.totalPaid = totalPaid;
        this.receiptFileUrl = receiptFileUrl;
    }

    public Long getReceiptId()
    {
        return receiptId;
    }

    public void setReceiptId(Long receiptId)
    {
        this.receiptId = receiptId;
    }

    public Long getUserId()
    {
        return userId;
    }

    public void setUserId(Long userId)
    {
        this.userId = userId;
    }

    public LocalDateTime getPurchaseDatetime()
    {
        return purchaseDatetime;
    }

    public void setPurchaseDatetime(LocalDateTime purchaseDatetime)
    {
        this.purchaseDatetime = purchaseDatetime;
    }

    public BigDecimal getTotalPaid()
    {
        return totalPaid;
    }

    public void setTotalPaid(BigDecimal totalPaid)
    {
        this.totalPaid = totalPaid;
    }

    public String getReceiptFileUrl()
    {
        return receiptFileUrl;
    }

    public void setReceiptFileUrl(String receiptFileUrl)
    {
        this.receiptFileUrl = receiptFileUrl;
    }
}