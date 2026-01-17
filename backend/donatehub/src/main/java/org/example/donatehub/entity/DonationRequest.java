package org.example.donatehub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.donatehub.enums.RequestStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
public class DonationRequest { //organization makeing request to the donation listing

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donation_id")
    private Donation donation;

    @ManyToOne
    @JoinColumn(name = "org_id")
    private User organization;

    @Column(nullable = false)
    private String purpose;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

}
