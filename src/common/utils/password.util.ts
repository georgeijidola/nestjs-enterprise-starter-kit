import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'passwordMatch', async: false })
export class PasswordMatchValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;
    return object.password === object.confirmPassword;
  }

  defaultMessage() {
    return 'Passwords do not match';
  }
}

export class PasswordUtil {
  /**
   * Validates if password matches confirmation password
   * @param password - The password field
   * @param confirmPassword - The password confirmation field
   * @returns boolean indicating if passwords match
   */
  static validatePasswordMatch(
    password: string,
    confirmPassword: string,
  ): boolean {
    return password === confirmPassword;
  }

  /**
   * Validates password strength requirements
   * @param password - The password to validate
   * @returns object with validation result and any error messages
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        password,
      )
    ) {
      errors.push(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Checks if new password is different from current password
   * @param newPassword - The new password
   * @param currentPassword - The current hashed password
   * @param compareFunction - Function to compare passwords (e.g., bcrypt.compare)
   * @returns Promise<boolean> indicating if passwords are different
   */
  static async isPasswordDifferent(
    newPassword: string,
    currentPassword: string,
    compareFunction: (password: string, hash: string) => Promise<boolean>,
  ): Promise<boolean> {
    const isSamePassword = await compareFunction(newPassword, currentPassword);
    return !isSamePassword;
  }
}
