package org.example.donatehub.DTO;

import lombok.Data;
import org.example.donatehub.enums.Role;

@Data
public class userDto {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private Role role;
    private String district;

}
