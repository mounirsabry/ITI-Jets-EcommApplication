package jets.projects.dto;
import java.util.List;

public class DiscountDTO
{
    private String discountType;
    private double discountValue;
    private String discountOperation;
    private String applyTo;
    private Long categoryId;
    private List<Long> bookIds;

    // Constructors
    public DiscountDTO() {}

    // Getters and setters
    public String getDiscountType() {
        return discountType;
    }

    public void setDiscountType(String discountType) {
        this.discountType = discountType;
    }

    public double getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(double discountValue) {
        this.discountValue = discountValue;
    }

    public String getDiscountOperation() {
        return discountOperation;
    }

    public void setDiscountOperation(String discountOperation) {
        this.discountOperation = discountOperation;
    }

    public String getApplyTo() {
        return applyTo;
    }

    public void setApplyTo(String applyTo) {
        this.applyTo = applyTo;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public List<Long> getBookIds() {
        return bookIds;
    }

    public void setBookIds(List<Long> bookIds) {
        this.bookIds = bookIds;
    }
}