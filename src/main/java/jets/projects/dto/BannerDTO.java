
package jets.projects.dto;

public class BannerDTO {
    private Long id;
    private String title;
    private String text;
    private String image;

    // Constructors
    public BannerDTO() {}

    public BannerDTO(Long id, String title, String text, String image) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.image = image;
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

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}