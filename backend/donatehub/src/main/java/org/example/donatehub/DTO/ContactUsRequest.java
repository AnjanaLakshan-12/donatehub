package org.example.donatehub.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContactUsRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String message;
}
