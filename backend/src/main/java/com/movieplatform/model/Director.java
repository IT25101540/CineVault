// IT25100813 – Luckshidhan K. – Component 06: Director & Cast Management
package com.movieplatform.model;

/** Director – extends Person (Inheritance). */
public class Director extends Person {
    private int awardsWon;
    private String signatureStyle;

    public Director() { super(); }

    public Director(String id, String fullName, String nationality, int birthYear,
                    String biography, String photoUrl, int awardsWon, String signatureStyle) {
        super(id, fullName, nationality, birthYear, biography, photoUrl, "DIRECTOR");
        this.awardsWon = awardsWon;
        this.signatureStyle = signatureStyle;
    }

    @Override public String displayCredit() { return "Directed by " + getFullName(); }

    public int getAwardsWon() { return awardsWon; }
    public void setAwardsWon(int awardsWon) { this.awardsWon = awardsWon; }
    public String getSignatureStyle() { return signatureStyle; }
    public void setSignatureStyle(String signatureStyle) { this.signatureStyle = signatureStyle; }

    @Override public String toString() {
        return "Director{" + super.toString() + ", awardsWon=" + awardsWon + "}";
    }
}
