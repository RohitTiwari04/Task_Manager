package com.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {
  @NotBlank
  private String title;

  private String description;

  @NotNull
  private String status;

  @NotNull
  private String priority;

  private LocalDate deadline;
}
