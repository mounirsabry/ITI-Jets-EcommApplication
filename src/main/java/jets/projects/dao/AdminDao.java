package jets.projects.dao;

import java.util.Optional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jets.projects.entity.Admin;
import jets.projects.utils.JpaUtil;

public class AdminDao 
{
    private final EntityManagerFactory emf;

    public AdminDao() {
        this.emf = JpaUtil.getEntityManagerFactory();
    }


    public Optional<Admin> findById(Long adminId) 
    {
        EntityManager em = emf.createEntityManager();
        try {
            Admin admin = em.find(Admin.class, adminId);
            return Optional.ofNullable(admin);
        } finally {
            em.close();
        }
    }


}