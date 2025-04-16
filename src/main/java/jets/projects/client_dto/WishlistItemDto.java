package jets.projects.client_dto;

public class WishlistItemDto {

    private Long userId;
    private Long bookID;

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getBookId() {
        return bookID;
    }

    public void setBookId(Long bookId) {
        this.bookID = bookId;
    }
}
