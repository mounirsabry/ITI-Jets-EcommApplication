package jets.projects.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "BookImage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookImage 
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_ID")
    private Long imageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_ID", nullable = false)
    private Book book;

    @Column(name = "url", nullable = false, length = 255)
    private String url;

    @Column(name = "is_main", nullable = false)
    private Boolean isMain = false;
}