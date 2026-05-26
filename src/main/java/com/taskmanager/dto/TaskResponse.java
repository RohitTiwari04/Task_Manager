package com.taskmanager.dto;

import com.taskmanager.model.Task;
import com.taskmanager.model.TaskPriority;
import com.taskmanager.model.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponse {
  private Long id;
  private String title;
  private String description;
  private TaskStatus status;
  private TaskPriority priority;
  private LocalDate deadline;
  private Long userId;

  public static TaskResponse build(Task task) {
    return TaskResponse.builder()
        .id(task.getId())
        .title(task.getTitle())
        .description(task.getDescription())
        .status(task.getStatus())
        .priority(task.getPriority())
        .deadline(task.getDeadline())
        .userId(task.getUser().getId())
        .build();
  }
}
