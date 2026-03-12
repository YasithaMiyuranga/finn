package com.Traffic_Fines.System.Util;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class ValidationUtil {
    private static final ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private static final Validator validator = factory.getValidator();
    public static <T> Map<String, String> validateObject(T object) {
        Set<ConstraintViolation<T>> violations = validator.validate(object);

        return violations.stream()
                .collect(Collectors.toMap(
                        violation -> violation.getPropertyPath().toString(),
                        violation -> violation.getMessage()
                ));
    }
}
