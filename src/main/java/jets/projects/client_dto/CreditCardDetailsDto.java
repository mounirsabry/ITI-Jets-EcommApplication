package jets.projects.client_dto;

import java.time.LocalDate;

public class CreditCardDetailsDto {

    private String nameOnCard;
    private String cardNumber;
    private LocalDate expiryDate;
    private String cvc;

    public CreditCardDetailsDto(String cardNumber, String cvc, String nameOnCard) {
        this.cardNumber = cardNumber;
        this.cvc = cvc;
        this.nameOnCard = nameOnCard;
    }

// Getters and Setters
    public String getNameOnCard() {
        return nameOnCard;
    }

    public void setNameOnCard(String nameOnCard) {
        this.nameOnCard = nameOnCard;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getCvc() {
        return cvc;
    }

    public void setCvc(String cvc) {
        this.cvc = cvc;
    }
}
