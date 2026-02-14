package org.example.donatehub.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.donatehub.enums.Role;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    private String lastName;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role = Role.DONOR;

    @Column(nullable = false)
    private String district;

    @OneToMany(mappedBy = "donor")
    @JsonIgnore
    private List<Donation> donations;

    @OneToMany(mappedBy = "organization")
    @JsonIgnore
    private List<DonationRequest>  donationRequests;

    @Column(nullable = false)
    private Boolean enable;


}
