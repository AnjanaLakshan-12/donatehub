package org.example.donatehub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.donatehub.enums.DonationStatus;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;


    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User donor;

    @Column(nullable = false)
    private int quantity;

    @Enumerated(EnumType.STRING)
    private DonationStatus status;

    @OneToMany(mappedBy = "donation")
    private List<DonationRequest>  donationRequests;



}
