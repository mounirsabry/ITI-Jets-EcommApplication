package jets.projects.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Admin")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Admin 
{
    @Id
    @Column(name = "admin_ID")
    private Long adminId;

    @Column(name = "hash_password", nullable = false, length = 255)
    private String hashPassword;

    @Column(name = "display_name", nullable = false, length = 100)
    private String displayName;
}