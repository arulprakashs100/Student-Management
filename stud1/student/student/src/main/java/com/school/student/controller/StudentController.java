package com.school.student.controller;

import com.school.student.entity.Student;
import com.school.student.dto.LoginRequest;
import com.school.student.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class StudentController {

    private final StudentService service;

    public StudentController(StudentService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerStudent(@RequestBody Student student) {
        try {
            Student saved = service.saveStudent(student);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginStudent(@RequestBody LoginRequest loginRequest) {
        return service.loginStudent(loginRequest.getEmail(), loginRequest.getPassword())
                .<ResponseEntity<?>>map(student -> new ResponseEntity<>(student, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>("Invalid email or password", HttpStatus.UNAUTHORIZED));
    }

    @GetMapping("/search")
    public List<Student> searchStudents(@RequestParam String query) {
        return service.searchStudents(query);
    }

    @GetMapping("/id/{studentId}")
    public ResponseEntity<?> getStudentByStudentId(@PathVariable String studentId) {
        return service.getStudentByStudentId(studentId)
                .<ResponseEntity<?>>map(student -> new ResponseEntity<>(student, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>("Student not found", HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<?> addStudent(@RequestBody Student student) {
        try {
            Student saved = service.saveStudent(student);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return service.getAllStudents();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody Student studentDetails) {
        try {
            Student updated = service.updateStudent(id, studentDetails);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        service.deleteStudent(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
