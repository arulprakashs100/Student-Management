package com.school.student.service;

import com.school.student.entity.Student;
import com.school.student.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    public Student saveStudent(Student student) {
        if (student.getId() == null) {
            if (repository.findByStudentId(student.getStudentId()).isPresent()) {
                throw new RuntimeException("Student ID already exists: " + student.getStudentId());
            }
            if (repository.findByEmail(student.getEmail()).isPresent()) {
                throw new RuntimeException("Email already exists: " + student.getEmail());
            }
        }
        return repository.save(student);
    }

    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    public Optional<Student> getStudentById(Long id) {
        return repository.findById(id);
    }

    public Optional<Student> getStudentByStudentId(String studentId) {
        return repository.findByStudentId(studentId);
    }

    public Optional<Student> getStudentByEmail(String email) {
        return repository.findByEmail(email);
    }

    public Optional<Student> loginStudent(String email, String password) {
        return repository.findByEmail(email)
                .filter(student -> student.getPassword().equals(password));
    }

    public List<Student> searchStudents(String query) {
        return repository.findByStudentIdContainingIgnoreCaseOrNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query, query);
    }

    public void deleteStudent(Long id) {
        repository.deleteById(id);
    }

    public Student updateStudent(Long id, Student studentDetails) {
        return repository.findById(id).map(student -> {
            if (!student.getEmail().equalsIgnoreCase(studentDetails.getEmail())) {
                if (repository.findByEmail(studentDetails.getEmail()).isPresent()) {
                    throw new RuntimeException("Email already exists: " + studentDetails.getEmail());
                }
            }
            if (!student.getStudentId().equalsIgnoreCase(studentDetails.getStudentId())) {
                if (repository.findByStudentId(studentDetails.getStudentId()).isPresent()) {
                    throw new RuntimeException("Student ID already exists: " + studentDetails.getStudentId());
                }
            }
            
            student.setStudentId(studentDetails.getStudentId());
            student.setName(studentDetails.getName());
            student.setEmail(studentDetails.getEmail());
            student.setDepartment(studentDetails.getDepartment());
            student.setContactNumber(studentDetails.getContactNumber());
            student.setAddress(studentDetails.getAddress());
            if (studentDetails.getPassword() != null && !studentDetails.getPassword().isEmpty()) {
                student.setPassword(studentDetails.getPassword());
            }
            return repository.save(student);
        }).orElseThrow(() -> new RuntimeException("Student not found with id " + id));
    }
}
