package org.example.donatehub.DTO;

import lombok.Data;
import org.example.donatehub.enums.Role;

@Data
public class UserResponse {
    private Long id;
    private String firstName;
    private String email;
    private Role role;
    private Boolean enable;
}
