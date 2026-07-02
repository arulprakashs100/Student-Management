package com.school.student.controller;

import com.school.student.entity.Staff;
import com.school.student.dto.LoginRequest;
import com.school.student.service.StaffService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/staff")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class StaffController {

    private final StaffService service;

    public StaffController(StaffService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerStaff(@RequestBody Staff staff) {
        try {
            Staff saved = service.saveStaff(staff);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginStaff(@RequestBody LoginRequest loginRequest) {
        return service.loginStaff(loginRequest.getEmail(), loginRequest.getPassword())
                .<ResponseEntity<?>>map(staff -> new ResponseEntity<>(staff, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>("Invalid email or password", HttpStatus.UNAUTHORIZED));
    }
}
