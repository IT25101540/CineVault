// IT25101540 – Gunathilaka H.D.T.T. – Component 05: Admin Management
package com.movieplatform.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "promocodes")
public class PromoCode {
    @Id
    private String id;
    private String code;
    private double discountPercentage;
    private boolean active;

    public PromoCode() {}

    public PromoCode(String id, String code, double discountPercentage, boolean active) {
        this.id = id;
        this.code = code;
        this.discountPercentage = discountPercentage;
        this.active = active;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public double getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(double discountPercentage) { this.discountPercentage = discountPercentage; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
