// IT25100813 – Luckshidhan K. – Component 06: Director & Cast Management
package com.movieplatform.model;

/** CastMember – extends Person (Inheritance). agentContact is private (Encapsulation). */
public class CastMember extends Person {
    private String knownRole;
    private String agentContact;   // private – never in public DTO

    public CastMember() { super(); }

    public CastMember(String id, String fullName, String nationality, int birthYear,
                      String biography, String photoUrl, String knownRole, String agentContact) {
        super(id, fullName, nationality, birthYear, biography, photoUrl, "ACTOR");
        this.knownRole = knownRole;
        this.agentContact = agentContact;
    }

    @Override public String displayCredit() { return "Starring " + getFullName(); }

    public String getKnownRole() { return knownRole; }
    public void setKnownRole(String knownRole) { this.knownRole = knownRole; }
    // agentContact – getter intentionally admin-only
    public String getAgentContact() { return agentContact; }
    public void setAgentContact(String agentContact) { this.agentContact = agentContact; }

    @Override public String toString() {
        return "CastMember{" + super.toString() + ", knownRole='" + knownRole + "'}";
    }
}
