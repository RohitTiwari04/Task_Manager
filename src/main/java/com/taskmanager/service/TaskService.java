package com.taskmanager.service;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.model.Task;
import com.taskmanager.model.TaskPriority;
import com.taskmanager.model.TaskStatus;
import com.taskmanager.model.User;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {
  @Autowired
  private TaskRepository taskRepository;

  @Autowired
  private UserRepository userRepository;

  @Transactional(readOnly = true)
  public List<TaskResponse> getAllTasksForUser(User user, String sortBy, String sortOrder) {
    Sort sort = Sort.unsorted();
    if (sortBy != null && !sortBy.isBlank()) {
      Sort.Direction direction = "desc".equalsIgnoreCase(sortOrder) ? Sort.Direction.DESC : Sort.Direction.ASC;
      sort = Sort.by(direction, sortBy);
    }
    
    List<Task> tasks = taskRepository.findByUser(user, sort);
    return tasks.stream().map(TaskResponse::build).collect(Collectors.toList());
  }

  @Transactional
  public TaskResponse createTask(User user, TaskRequest request) {
    Task task = Task.builder()
        .title(request.getTitle())
        .description(request.getDescription())
        .status(TaskStatus.valueOf(request.getStatus().toUpperCase()))
        .priority(TaskPriority.valueOf(request.getPriority().toUpperCase()))
        .deadline(request.getDeadline())
        .user(user)
        .build();

    Task savedTask = taskRepository.save(task);
    return TaskResponse.build(savedTask);
  }

  @Transactional
  public TaskResponse updateTask(User user, Long taskId, TaskRequest request) {
    Task task = taskRepository.findById(taskId)
        .orElseThrow(() -> new RuntimeException("Error: Task not found with ID: " + taskId));

    // Verify task ownership
    if (!task.getUser().getId().equals(user.getId())) {
      throw new AccessDeniedException("Error: You do not have permission to update this task.");
    }

    task.setTitle(request.getTitle());
    task.setDescription(request.getDescription());
    task.setStatus(TaskStatus.valueOf(request.getStatus().toUpperCase()));
    task.setPriority(TaskPriority.valueOf(request.getPriority().toUpperCase()));
    task.setDeadline(request.getDeadline());

    Task updatedTask = taskRepository.save(task);
    return TaskResponse.build(updatedTask);
  }

  @Transactional
  public void deleteTask(User user, Long taskId) {
    Task task = taskRepository.findById(taskId)
        .orElseThrow(() -> new RuntimeException("Error: Task not found with ID: " + taskId));

    // Verify task ownership
    if (!task.getUser().getId().equals(user.getId())) {
      throw new AccessDeniedException("Error: You do not have permission to delete this task.");
    }

    taskRepository.delete(task);
  }

  @Transactional
  public TaskResponse updateTaskStatus(User user, Long taskId, String newStatus) {
    Task task = taskRepository.findById(taskId)
        .orElseThrow(() -> new RuntimeException("Error: Task not found with ID: " + taskId));

    // Verify task ownership
    if (!task.getUser().getId().equals(user.getId())) {
      throw new AccessDeniedException("Error: You do not have permission to modify this task.");
    }

    task.setStatus(TaskStatus.valueOf(newStatus.toUpperCase()));
    Task updatedTask = taskRepository.save(task);
    return TaskResponse.build(updatedTask);
  }
}
