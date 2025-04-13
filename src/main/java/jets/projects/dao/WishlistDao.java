package jets.projects.dao;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jets.projects.entity.Wishlist;
import jets.projects.utils.JpaUtil;

public class WishlistDao 
{
    private final EntityManagerFactory emf;

    public WishlistDao() 
    {
        this.emf = JpaUtil.getEntityManagerFactory();
    }

    // Create or Update Wishlist entry
    public Wishlist save(Wishlist wishlist) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            Wishlist savedWishlist = em.merge(wishlist);
            em.getTransaction().commit();
            return savedWishlist;
        } finally {
            em.close();
        }
    }

    // Find Wishlist entry by ID
    public Optional<Wishlist> findById(Long wishlistId) {
        EntityManager em = emf.createEntityManager();
        try {
            Wishlist wishlist = em.find(Wishlist.class, wishlistId);
            return Optional.ofNullable(wishlist);
        } finally {
            em.close();
        }
    }

    // Find all Wishlist entries for a User
    public List<Wishlist> findByUserId(Long userId) {
        EntityManager em = emf.createEntityManager();
        try {
            return em.createQuery("SELECT w FROM Wishlist w WHERE w.user.userId = :userId", Wishlist.class)
                    .setParameter("userId", userId)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    // Find Wishlist entry by User and Book
    public Optional<Wishlist> findByUserAndBook(Long userId, Long bookId) {
        EntityManager em = emf.createEntityManager();
        try {
            Wishlist wishlist = em.createQuery("SELECT w FROM Wishlist w WHERE w.user.userId = :userId AND w.book.bookId = :bookId", Wishlist.class)
                    .setParameter("userId", userId)
                    .setParameter("bookId", bookId)
                    .getSingleResult();
            return Optional.ofNullable(wishlist);
        } catch (jakarta.persistence.NoResultException e) {
            return Optional.empty();
        } finally {
            em.close();
        }
    }

    // Find all Wishlist entries
    public List<Wishlist> findAll() 
    {
        EntityManager em = emf.createEntityManager();
        try {
            return em.createQuery("SELECT w FROM Wishlist w", Wishlist.class)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    // Delete Wishlist entry
    public void delete(Long wishlistId) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            Wishlist wishlist = em.find(Wishlist.class, wishlistId);
            if (wishlist != null) {
                em.remove(wishlist);
            }
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    // Delete Wishlist entry by User and Book
    public void deleteByUserAndBook(Long userId, Long bookId) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            Wishlist wishlist = em.createQuery("SELECT w FROM Wishlist w WHERE w.user.userId = :userId AND w.book.bookId = :bookId", Wishlist.class)
                    .setParameter("userId", userId)
                    .setParameter("bookId", bookId)
                    .getSingleResult();
            if (wishlist != null) {
                em.remove(wishlist);
            }
            em.getTransaction().commit();
        } catch (jakarta.persistence.NoResultException e) {} finally {
            em.close();
        }
    }
}