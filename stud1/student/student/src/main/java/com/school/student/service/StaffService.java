package com.school.student.service;

import com.school.student.entity.Staff;
import com.school.student.repository.StaffRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StaffService {

    private final StaffRepository repository;

    public StaffService(StaffRepository repository) {
        this.repository = repository;
    }

    public Staff saveStaff(Staff staff) {
        if (staff.getId() == null) {
            if (repository.findByStaffId(staff.getStaffId()).isPresent()) {
                throw new RuntimeException("Staff ID already exists: " + staff.getStaffId());
            }
            if (repository.findByEmail(staff.getEmail()).isPresent()) {
                throw new RuntimeException("Email already exists: " + staff.getEmail());
            }
        }
        return repository.save(staff);
    }

    public Optional<Staff> loginStaff(String email, String password) {
        return repository.findByEmail(email)
                .filter(staff -> staff.getPassword().equals(password));
    }

    public Optional<Staff> getStaffByEmail(String email) {
        return repository.findByEmail(email);
    }
}
