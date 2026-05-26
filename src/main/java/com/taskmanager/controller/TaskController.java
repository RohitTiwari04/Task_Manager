package com.taskmanager.controller;

import com.taskmanager.dto.MessageResponse;
import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.model.User;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
  @Autowired
  private TaskService taskService;

  @Autowired
  private UserRepository userRepository;

  private User getAuthenticatedUser() {
    String username = SecurityContextHolder.getContext().getAuthentication().getName();
    return userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("Error: Authenticated user not found."));
  }

  @GetMapping
  public ResponseEntity<List<TaskResponse>> getAllTasks(
      @RequestParam(required = false) String sortBy,
      @RequestParam(required = false) String sortOrder) {
    User user = getAuthenticatedUser();
    List<TaskResponse> tasks = taskService.getAllTasksForUser(user, sortBy, sortOrder);
    return ResponseEntity.ok(tasks);
  }

  @PostMapping
  public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest request) {
    User user = getAuthenticatedUser();
    TaskResponse response = taskService.createTask(user, request);
    return ResponseEntity.ok(response);
  }

  @PutMapping("/{id}")
  public ResponseEntity<TaskResponse> updateTask(
      @PathVariable Long id,
      @Valid @RequestBody TaskRequest request) {
    User user = getAuthenticatedUser();
    TaskResponse response = taskService.updateTask(user, id, request);
    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteTask(@PathVariable Long id) {
    User user = getAuthenticatedUser();
    taskService.deleteTask(user, id);
    return ResponseEntity.ok(new MessageResponse("Task deleted successfully."));
  }

  @PatchMapping("/{id}/status")
  public ResponseEntity<TaskResponse> updateTaskStatus(
      @PathVariable Long id,
      @RequestParam String status) {
    User user = getAuthenticatedUser();
    TaskResponse response = taskService.updateTaskStatus(user, id, status);
    return ResponseEntity.ok(response);
  }
}
