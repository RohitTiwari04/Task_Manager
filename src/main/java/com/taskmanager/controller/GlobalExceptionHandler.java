package com.taskmanager.controller;

import com.taskmanager.dto.MessageResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<MessageResponse> handleAccessDeniedException(AccessDeniedException ex) {
    return ResponseEntity.status(HttpStatus.FORBIDDEN)
        .body(new MessageResponse(ex.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<MessageResponse> handleValidationException(MethodArgumentNotValidException ex) {
    String errors = ex.getBindingResult().getFieldErrors().stream()
        .map(error -> error.getField() + ": " + error.getDefaultMessage())
        .collect(Collectors.joining(", "));
    return ResponseEntity.badRequest()
        .body(new MessageResponse("Validation error: " + errors));
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<MessageResponse> handleRuntimeException(RuntimeException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(new MessageResponse(ex.getMessage()));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<MessageResponse> handleGeneralException(Exception ex) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(new MessageResponse("An unexpected error occurred: " + ex.getMessage()));
  }
}
