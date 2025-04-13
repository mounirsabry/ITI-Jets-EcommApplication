package jets.projects.dto;

public class BookDTO {
    private Long id;
    private String title;
    private String coverImage;
    private double price;
    private double discount;

    // Constructors
    public BookDTO() {}

    public BookDTO(Long id, String title, String coverImage, double price, double discount) {
        this.id = id;
        this.title = title;
        this.coverImage = coverImage;
        this.price = price;
        this.discount = discount;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getDiscount() {
        return discount;
    }

    public void setDiscount(double discount) {
        this.discount = discount;
    }
}